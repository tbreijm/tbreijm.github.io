import {ModelOrIds, sanitiseAll} from '../datagraph'
import {SetOperations} from '../math'
import {Model, ModelProperties, ModelType, RelationshipKey, RelationshipType} from '../modelgraph/index'

export default class Relationship<R extends RelationshipKey> {
	readonly empty: boolean
	readonly type: RelationshipType<R> | undefined

	constructor(
		readonly id: number | undefined,
		readonly modelIds: string[],
		type: RelationshipType<R> | RelationshipType<R>[] | undefined,
		private readonly modelMap: Map<ModelType<any>, Model<any> | Model<any>[]>,
	) {
		this.empty = modelIds.length === 0
		this.type = Array.isArray(type) ? type[0] : type
	}

	has<M extends ModelProperties>(type: ModelType<M>): boolean {
		return this.modelMap.has(type)
	}

	model<M extends ModelProperties>(type: ModelType<M>, fallback?: M): Model<M> | undefined {
		const model = this.modelMap.get(type)

		if (model === undefined && fallback === undefined) return undefined
		if (model === undefined && fallback !== undefined)
			return new Model<M>('undefined-1', fallback, type)

		if (Array.isArray(model)) return model[0]

		return model
	}

	models<M extends ModelProperties>(type: ModelType<M>): Model<M>[] {
		const model = this.modelMap.get(type)

		if (model === undefined) return []
		if (Array.isArray(model)) return model

		return [model]
	}

	replace(original: ModelOrIds<any>, replacement: ModelOrIds<any>): string[] {
		const originalSet = new Set(sanitiseAll(original))
		const replacementSet = new Set(sanitiseAll(replacement))

		return [
			...SetOperations.union(
				SetOperations.diff(new Set(this.modelIds), originalSet),
				replacementSet,
			),
		]
	}
}
