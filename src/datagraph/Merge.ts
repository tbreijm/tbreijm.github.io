import {not, SetOperations} from '../math'
import {Attribute, Model, ModelGraph, ModelProperties, ModelType} from '../modelgraph'
import {Context, Diff, MutableContext} from './index'

export type MergeCondition = (model: Model<any>, field: string, context: Context) => boolean
export type MergeException = Set<ModelType<any>> | Map<ModelType<any>, string[]> | MergeCondition

export type MergeStrategy = (
  graph: ModelGraph,
  diff: Diff,
  context: MutableContext,
  exceptions: MergeException,
) => void;

const removeMyExtraRelationshipTypes = (
	diff: Diff,
	context: MutableContext,
) => {
	[...diff.relationships.types.mine]
		.flatMap((type) => context.read.allRelationships(type))
		.forEach((relationship) => context.write.end(relationship.id!))
}

const removeMyExtraRelationships = (diff: Diff, context: MutableContext) => {
	[...diff.relationships.entities].forEach((entity) => {
		[...entity[1].mine].forEach((_) => context.write.end(_))
	})
}

const removeMyExtraModelTypes = (
	diff: Diff,
	context: MutableContext,
	exceptions: Set<ModelType<any>>,
) => {
	[...SetOperations.diff(diff.models.types.mine, exceptions)]
		.flatMap((type) => context.read.allModels(type))
		.forEach((model) => context.write.delete(model.id))
}

const removeMyExtraModels = (
	diff: Diff,
	context: MutableContext,
	exceptions: Set<ModelType<any>>,
) => {
	[...diff.models.entities]
		.filter(([type]) => not(exceptions.has(type)))
		.forEach((entity) => {
			[...entity[1].mine].forEach((_) => context.write.delete(_))
		})
}

const addTheirExtraModelTypes = (
	graph: ModelGraph,
	diff: Diff,
	context: MutableContext,
) => {
	[...diff.models.types.their].forEach((type) => {
		graph.allModels(type).forEach((_) => context.write.insert(_))
	})
}

const addTheirExtraModels = (
	graph: ModelGraph,
	diff: Diff,
	context: MutableContext,
) => {
	[...diff.models.entities].forEach((entity) => {
		[...entity[1].their].forEach((_) =>
			context.write.insert(graph.readModel(_)),
		)
	})
}

const addTheirModelUpdates = (
	graph: ModelGraph,
	diff: Diff,
	context: MutableContext,
) => (condition: MergeCondition) => {
	const immutableContext = {
		read: context.read
	} as Context

	[...diff.models.entities].forEach(([type, { changed }]) => {
		[...changed].forEach((_) => {
			const model = graph.readModel(_) as Model<ModelProperties>

			if (model === undefined) return

			const updatableFields = Object.keys(model.properties)
				.filter(field => condition(model, field, immutableContext))
				.reduce((result, field) => {
					result[field] = model.properties[field]
					return result
				}, {} as {[key: string]: Attribute}) as ModelProperties

			if (Object.keys(updatableFields).length) {
				context.write.update(_, updatableFields)
			}
		})
	})
}

const addTheirExtraRelationshipTypes = (
	graph: ModelGraph,
	diff: Diff,
	context: MutableContext,
) => {
	[...diff.relationships.types.their].forEach((type) => {
		graph
			.allRelationships(type)
			.forEach((_) => context.write.start(type, _.modelIds))
	})
}

const addTheirExtraRelationships = (
	graph: ModelGraph,
	diff: Diff,
	context: MutableContext,
) => {
	[...diff.relationships.entities].forEach(([type, { their }]) => {
		[...their].forEach((_) =>
			context.write.start(type, graph.resolveEdge(_).modelIds),
		)
	})
}

export const ignore: MergeStrategy = () => {
	// do nothing
}

export const refresh: MergeStrategy = (
	graph: ModelGraph,
	diff: Diff,
	context: MutableContext
): void => {
	addTheirExtraModelTypes(graph, diff, context)
	addTheirExtraModels(graph, diff, context)
	addTheirExtraRelationshipTypes(graph, diff, context)
	addTheirExtraRelationships(graph, diff, context)
}

export const update: MergeStrategy = (
	graph: ModelGraph,
	diff: Diff,
	context: MutableContext,
	exceptions: MergeException,
): void => {
	refresh(graph, diff, context, exceptions)
	const conditionHandler = addTheirModelUpdates(graph, diff, context)

	if (exceptions instanceof Set) {
		conditionHandler(model => not(exceptions.has(model.type)))
		return
	}

	if (exceptions instanceof Map) {
		conditionHandler((model, field) =>
			exceptions.has(model.type) && not((new Set(exceptions.get(model.type))).has(field))
		)
		return
	}

	conditionHandler(exceptions)
}

export const override: MergeStrategy = (
	graph: ModelGraph,
	diff: Diff,
	context: MutableContext,
	exceptions: MergeException,
): void => {
	removeMyExtraRelationshipTypes(diff, context)
	removeMyExtraRelationships(diff, context)

	if (exceptions instanceof Set) {
		removeMyExtraModelTypes(diff, context, exceptions)
		removeMyExtraModels(diff, context, exceptions)
	}

	update(graph, diff, context, exceptions)
}
