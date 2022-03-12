import {
	Model,
	ModelGraph,
	ModelProperties,
	ModelType,
	Relationship,
	RelationshipKey,
	RelationshipType,
} from '../modelgraph'
import { ModelOrId, ModelOrIds, sanitise, sanitiseAll } from './ModelOrId'
import { not } from '../math'

export default class Reader {
	constructor(private readonly graph: ModelGraph) {}

	all<M extends ModelProperties>(type: ModelType<M>): Readonly<M>[] {
		return this.graph.all(type)
	}

	allIds<M extends ModelProperties>(type: ModelType<M>): string[] {
		return this.graph.allIds<M>(type)
	}

	allModels<M extends ModelProperties>(type: ModelType<M>): Readonly<Model<M>>[] {
		return this.graph.allModels<M>(type)
	}

	allRelationships<R extends RelationshipKey>(
		type: RelationshipType<R>,
	): Relationship<R>[] {
		return this.graph.allRelationships<R>(type)
	}

	allRelationshipsFor(modelIds: ModelOrIds<ModelProperties>): Relationship<any>[] {
		return sanitiseAll(modelIds).flatMap(_ => this.graph.allRelationshipsFor(_))
	}

	any<R extends RelationshipKey>(
		types: RelationshipType<R> | RelationshipType<R>[],
		modelIds: ModelOrIds<ModelProperties>,
	): boolean {
		return this.graph.any<R>(types, sanitiseAll(modelIds))
	}

	belongTo<M extends ModelProperties>(type: ModelType<M>, ...modelOrIds: ModelOrId<M>[]): boolean {
		return modelOrIds.every(_ => this.belongsTo(type, _))
	}

	belongsTo<M extends ModelProperties>(type: ModelType<M>, modelOrId: ModelOrId<M>): boolean {
		const modelId = sanitise(modelOrId)
		return modelId === undefined ? false : this.graph.belongsTo<M>(type, modelId!)
	}

	count<M extends ModelProperties>(type: ModelType<M>): number {
		return this.allIds(type).length
	}

	countIf<M extends ModelProperties>(type: ModelType<M>, func: (properties: M, id?: string) => boolean): number {
		return this.sum(type, (properties: M, id?: string) => (func(properties, id) ? 1 : 0))
	}

	exists<M extends ModelProperties>(type: ModelType<M>, func: (properties: M) => boolean = () => true): boolean {
		return this.allModels(type).some((_) => func(_.properties))
	}

	filter<M extends ModelProperties>(type: ModelType<M>, func: (properties: M) => boolean): Readonly<Model<M>>[] {
		return this.allModels(type).filter((_) => func(_.properties))
	}

	first<M extends ModelProperties>(type: ModelType<M>, func: (properties: M) => boolean, fallback: M): M {
		const results = this.filter(type, func)

		if (results.length > 0) return results[0].properties
		return fallback
	}

	instance<M extends ModelProperties>(type: ModelType<M>): string | undefined {
		const models = this.graph.allModels(type)

		if (models.length > 0) {
			return models[0].id
		}

		return undefined
	}

	many<R extends RelationshipKey>(
		types: RelationshipType<R> | RelationshipType<R>[],
		modelIds: ModelOrIds<ModelProperties>,
	): Relationship<R>[] {
		return this.graph.many<R>(types, sanitiseAll(modelIds))
	}

	manyAs<R extends RelationshipKey, M extends ModelProperties>(
		types: RelationshipType<R> | RelationshipType<R>[],
		modelIds: ModelOrIds<ModelProperties>,
		modelType: ModelType<M>,
	): Model<M>[] {
		return this.many(types, modelIds)
			.flatMap((_: Relationship<any>) => _.models(modelType))
			.filter((_) => Boolean(_))
	}

	missing<M extends ModelProperties>(type: ModelType<M>, func: (properties: M) => boolean = () => true): boolean {
		return this.allModels(type).every((_) => not(func(_.properties)))
	}

	none<R extends RelationshipKey>(
		types: RelationshipType<R> | RelationshipType<R>[],
		modelIds: ModelOrIds<ModelProperties>,
	): boolean {
		return not(this.any(types, modelIds))
	}

	one<R extends RelationshipKey>(
		types: RelationshipType<R> | RelationshipType<R>[],
		modelIds: ModelOrIds<ModelProperties>,
	): Relationship<R> {
		return this.graph.one<R>(types, sanitiseAll(modelIds))
	}

	path<R extends RelationshipKey>(
		types: RelationshipType<R> | RelationshipType<R>[],
		modelIds: ModelOrIds<ModelProperties>,
	): boolean {
		return this.graph.path(types, sanitiseAll(modelIds))
	}

	read<M extends ModelProperties>(modelOrId: ModelOrId<M>): M | undefined {
		const modelId = sanitise(modelOrId)
		if (modelId === undefined) return undefined
		return this.graph.read<M>(modelId)
	}

	readModel<M extends ModelProperties>(modelOrId: ModelOrId<M>): Model<M> | undefined {
		const modelId = sanitise(modelOrId)
		if (modelId === undefined) return undefined
		return this.graph.readModel<M>(modelId)
	}

	relationship<R extends RelationshipKey>(
		relationshipId: number | undefined,
	): Relationship<R> {
		return this.graph.resolveEdge(relationshipId)
	}

	sum<M extends ModelProperties>(type: ModelType<M>, func: (properties: M, id?: string) => number): number {
		return this.allModels(type)
			.map((_) => func(_.properties, _.id))
			.reduce((sum, value) => sum + value, 0)
	}

	sumIf<M extends ModelProperties>(
		type: ModelType<M>,
		condition: (properties: M, id?: string) => boolean,
		func: (properties: M, id?: string) => number,
	): number {
		return this.sum(type, (properties: M, id?: string) =>
			condition(properties, id) ? func(properties, id) : 0,
		)
	}

	type<M extends ModelProperties>(type: ModelType<M>): boolean {
		return not(this.instance(type) === undefined)
	}
}
