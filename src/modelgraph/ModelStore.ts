import {JSONObject} from '../Input'
import {Model, ModelProperties, ModelType} from '../modelgraph/index'
import {not} from '../math'
import {Manifest} from './Manifest'
import { equal } from '../Equals'

export default class ModelStore<M extends ModelProperties> {
	constructor(
		readonly prefix: string,
		private readonly type: ModelType<M>,
		private readonly collection: Readonly<Model<M>>[] = [],
		private readonly index = new Map<string, number>(),
	) {
	}

	all(): Readonly<Model<M>>[] {
		return [...this.collection]
	}

	allIds(): string[] {
		return this.all().map((_) => _.id)
	}

	any(): boolean {
		return this.collection.length > 0
	}

	delete(modelId: string): boolean {
		const position = this.index.get(modelId)
		if (position === undefined) return false

		this.collection.splice(position, 1)
		this.index.clear()
		this.collection.forEach((model, newPosition) =>
			this.index.set(model.id, newPosition),
		)
		return true
	}

	empty(): boolean {
		return this.collection.length === 0
	}

	equals(store: ModelStore<any>): boolean {
		return (
			this.prefix === store.prefix &&
			this.type === store.type &&
			equal(this.index, store.index) &&
			this.collection.length === store.collection.length &&
			this.collection.every((value, index) =>
				Model.equals(value, store.collection[index]),
			)
		)
	}

	has(modelId: string): boolean {
		return this.index.has(modelId)
	}

	get(modelId: string): Readonly<Model<M>> | undefined {
		if (this.missing(modelId)) return undefined
		return this.collection[this.index.get(modelId)!]
	}

	insertOrUpdate(modelId: string, properties: M): void {
		const position = this.index.get(modelId)
		const model = new Model(modelId, properties, this.type)

		if (position === undefined) {
			const newPosition = this.collection.length
			this.index.set(modelId, newPosition)
			this.collection.splice(newPosition, 0, model)
			return
		}

		this.collection.splice(position, 1, model)
		return
	}

	missing(modelId: string): boolean {
		return not(this.has(modelId))
	}

	nextId(): string {
		const set = new Set(this.index.keys())
		let counter = 1
		let id = `${this.prefix}-${counter}`
		while (set.has(id)) {
			counter += 1
			id = `${this.prefix}-${counter}`
		}
		return id
	}

	read(modelId: string): M | undefined {
		return this.index.has(modelId)
			? this.collection[this.index.get(modelId)!].properties
			: undefined
	}

	readModel(modelId: string): Model<M> | undefined {
		return this.index.has(modelId)
			? this.collection[this.index.get(modelId)!]
			: undefined
	}

	update(modelId: string, values: Partial<M>): boolean {
		if (this.missing(modelId)) return false

		this.insertOrUpdate(modelId, {
			...this.read(modelId)!,
			...values,
		} as M)

		return true
	}

	serialise(manifest: Manifest): JSONObject {
		return {
			collection: [...this.collection].map(({id, properties, type}) => ({
				id,
				properties,
				type: manifest.modelName(type),
			})),
			index: [...this.index],
			type: manifest.modelName(this.type),
		}
	}

	static deserialise(data: any, manifest: Manifest): ModelStore<any> {
		const type = manifest.modelType(data.type)!

		return new ModelStore(
			manifest.modelIdPrefix(type)!,
			type,
			data.collection.map((model: any) => ({
				id: model.id,
				properties: model.properties,
				type: manifest.modelType(model.type),
			})),
			new Map(data.index),
		)
	}
}
