import { Subject } from 'rxjs'
import {
	Model,
	ModelGraph, ModelProperties,
	ModelType,
	RelationshipKey,
	RelationshipType,
} from '../modelgraph'
import { ModelOrId, ModelOrIds, sanitise, sanitiseAll } from './ModelOrId'
import { not } from '../math'
import { Change, ChangeType } from './Change'
import { Manifest } from '../modelgraph/Manifest'

export default class Writer {
	constructor(
    private readonly manifest: Manifest,
    private readonly graph: ModelGraph,
    private readonly changes: Subject<Change>,
	) {}

	clone<M extends ModelProperties>(modelOrId: ModelOrId<M>, id?: number): string | undefined {
		const modelId = sanitise(modelOrId)
		if (modelId === undefined) return undefined

		const prefix = modelId.split('-')[0]
		const result = this.graph.clone(prefix, modelId, id)
		if (result) {
			this.graph
				.allRelationshipsFor(result!)
				.forEach(({ type, modelIds, id: relationshipId }) =>
					this.changes.next({
						type: ChangeType.START,
						data: { type, modelIds, relationshipId },
					}),
				)

			this.changes.next({
				type: ChangeType.CLONE,
				data: { oldModelId: modelId, newModelId: result },
			})
		}

		return result
	}

	create<M extends ModelProperties>(type: ModelType<M>, properties: M, propagate: boolean = true): string | undefined {
		const prefix = this.manifest.modelIdPrefix(type)
		const result = this.graph.create<M>(type, prefix, properties)

		if (propagate) {
			this.changes.next({
				type: ChangeType.CREATE,
				data: { newModelId: result },
			})
		}

		return result
	}

	delete<M extends ModelProperties>(modelOrId: ModelOrId<M>): boolean {
		const modelId = sanitise(modelOrId)
		if (modelId === undefined) return false

		const model = this.graph.readModel<M>(modelId)

		this.graph.allRelationshipsFor(modelId).forEach(({ id }) => this.end(id!))
		const result = this.graph.delete(modelId)

		if (result) {
			const { type, properties } = model!

			this.changes.next({
				type: ChangeType.DELETE,
				data: { modelId, type, properties },
			})
		}
		return result
	}

	deleteAll<M extends ModelProperties>(modelOrIds: ModelOrIds<M>): boolean {
		return sanitiseAll(modelOrIds).every((_) => this.delete(_))
	}

	end(relationshipId: number): boolean {
		const relationship = this.graph.resolveEdge(relationshipId)
		const modelIds = relationship.modelIds
		const type = relationship.type

		const result = this.graph.end(relationshipId)
		if (result) {
			this.changes.next({
				type: ChangeType.END,
				data: { type, modelIds, relationshipId },
			})
		}
		return result
	}

	endAll<M extends ModelProperties>(
		modelOrId: ModelOrId<M>,
		relationships: RelationshipType<any>[] = [],
	): Set<number> {
		const modelId = sanitise(modelOrId)
		if (modelId === undefined) return new Set()

		const ended = this.graph.endAll(modelId, new Set(relationships))
		const result = new Set(ended.map((_) => _.id!))

		ended.forEach(({ type, modelIds, id: relationshipId }) =>
			this.changes.next({
				type: ChangeType.END,
				data: { type, modelIds, relationshipId },
			}),
		)

		return result
	}

	insert<M extends ModelProperties>(model: Model<M> | undefined): boolean {
		if (model === undefined) return false

		const prefix = this.manifest.modelIdPrefix(model.type)
		const result = this.graph.insert(prefix, model)

		if (result) {
			this.changes.next({
				type: ChangeType.INSERT,
				data: { newModelId: model.id },
			})
		}

		return result
	}

	migrate<R extends RelationshipKey, M1 extends ModelProperties, M2 extends ModelProperties>(
		type: RelationshipType<R>,
		from: ModelOrIds<M1>,
		to: ModelOrIds<M2>,
	): Set<number> {
		const fromRelationships = this.graph.many(type, sanitiseAll(from))
		if (fromRelationships.length === 0) return new Set()

		if (fromRelationships.every((_) => this.end(_.id!))) {
			return this.startAll(
				type,
				fromRelationships.map((_) => _.replace(from, to)),
			)
		}

		return new Set()
	}

	start<R extends RelationshipKey>(
		type: RelationshipType<R>,
		modelIds: ModelOrIds<any>,
	): number | undefined {
		const sanitisedIds = sanitiseAll(modelIds)
		const result = this.graph.start<R>(type, sanitisedIds)
		if (result) {
			this.changes.next({
				type: ChangeType.START,
				data: { type, modelIds: sanitisedIds, relationshipId: result },
			})
		}
		return result
	}

	startAll<R extends RelationshipKey>(
		type: RelationshipType<R>,
		modelIds: ModelOrIds<any>[],
	): Set<number> {
		return new Set(
			modelIds
				.map((_) => this.start(type, _))
				.filter((_) => Boolean(_))
				.map((_) => _!),
		)
	}

	swap<R extends RelationshipKey, M1 extends ModelProperties, M2 extends ModelProperties>(
		type: RelationshipType<R>,
		models1: ModelOrIds<M1>,
		models2: ModelOrIds<M2>,
	): Set<number> {
		const relationships1 = this.graph.many(type, sanitiseAll(models1))
		const relationships2 = this.graph.many(type, sanitiseAll(models2))

		if ([...relationships1, ...relationships2].every((_) => this.end(_.id!))) {
			return this.startAll(type, [
				...relationships1.map((_) => _.replace(models1, models2)),
				...relationships2.map((_) => _.replace(models2, models1)),
			])
		}

		return new Set()
	}

	update<M extends ModelProperties>(modelOrId: ModelOrId<M>, values: Partial<M>, propagate: boolean = true): boolean {
		const modelId = sanitise(modelOrId)
		if (modelId === undefined) return false

		const result = this.graph.update<M>(modelId, values)
		if (result && propagate) {
			this.changes.next({
				type: ChangeType.UPDATE,
				data: { modelId, values },
			})
		}
		return result
	}

	updateOrCreate<M extends ModelProperties>(
		modelOrId: ModelOrId<M>,
		type: ModelType<M>,
		properties: M,
	): ModelOrId<M> {
		if (not(this.update(modelOrId, properties))) {
			return this.create(type, properties)
		}

		return undefined
	}
}
