import {notEqual} from '../Equals'
import {diff, intersection} from '../math/Set'
import {ModelGraph, ModelType, RelationshipType} from '../modelgraph'
import {Diff} from './index'

export default class Differ {
	constructor(private readonly graph: ModelGraph) {
	}

	diff(graph: ModelGraph): Diff {
		const {
			models: myModels,
			relationships: myRelationships,
		} = this.graph.types()
		const {
			models: theirModels,
			relationships: theirRelationships,
		} = graph.types()

		return {
			models: {
				types: {
					mine: diff(myModels, theirModels),
					their: diff(theirModels, myModels),
				},
				entities: this.modelsDiff(graph, [
					...intersection(myModels, theirModels),
				]),
			},
			relationships: {
				types: {
					mine: diff(myRelationships, theirRelationships),
					their: diff(theirRelationships, myRelationships),
				},
				entities: this.relationshipsDiff(graph, [
					...intersection(myRelationships, theirRelationships),
				]),
			},
		}
	}

	private modelIds(graph: ModelGraph, type: ModelType<any>) {
		return new Set(graph.allModels(type).map((_) => _.id))
	}

	private modelsDiff(graph: ModelGraph, modelTypes: ModelType<any>[]) {
		return new Map(
			modelTypes
				.map(this.modelTypeDiff(graph))
				.filter(
					(result) =>
						result.mine.size > 0 ||
						result.their.size > 0 ||
						result.changed.size > 0,
				)
				.map(({type, ...rest}) => [type, rest]),
		)
	}

	private modelTypeDiff(graph: ModelGraph) {
		return (type: ModelType<any>) => {
			const myModelIds = this.modelIds(this.graph, type)
			const theirModelIds = this.modelIds(graph, type)

			return {
				type,
				mine: diff(myModelIds, theirModelIds),
				their: diff(theirModelIds, myModelIds),
				changed: new Set(
					[...intersection(myModelIds, theirModelIds)].filter((modelId) =>
						notEqual(this.graph.read(modelId), graph.read(modelId)),
					),
				),
			}
		}
	}

	private relationshipsDiff(
		graph: ModelGraph,
		relationshipTypes: RelationshipType<any>[],
	) {
		return new Map(
			relationshipTypes
				.map(this.relationshipTypeDiff(graph))
				.filter((result) => result.mine.size > 0 || result.their.size > 0)
				.map(({type, ...rest}) => [type, rest]),
		)
	}

	private static hasNot = (
		modelIds: string[],
		array: { id: number | undefined; modelIds: string[] }[],
	): boolean => {
		return array.every((_) => notEqual(modelIds, _.modelIds))
	}

	private relationshipTypeDiff(graph: ModelGraph) {
		return (type: RelationshipType<any>) => {
			const myRelationships = this.graph
				.allRelationships(type)
				.map(({id, modelIds}) => ({id, modelIds}))

			const theirRelationships = graph
				.allRelationships(type)
				.map(({id, modelIds}) => ({id, modelIds}))

			const mine = new Set(
				myRelationships
					.filter((_) => Differ.hasNot(_.modelIds, theirRelationships))
					.map((_) => _.id!),
			)

			const their = new Set(
				theirRelationships
					.filter((_) => Differ.hasNot(_.modelIds, myRelationships))
					.map((_) => _.id!),
			)

			return {
				type,
				mine,
				their,
			}
		}
	}
}
