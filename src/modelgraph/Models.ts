import {equal} from '../Equals'
import {Model, ModelProperties, ModelStore, ModelType} from '../modelgraph/index'
import { Node } from '../hypergraph'
import { not } from '../math'
import { Manifest } from './Manifest'

export default class Models {
	constructor(
    private readonly nodes = new Map<string, Node>(),
    private readonly types = new Map<string, ModelType<any>>(),
    private readonly models = new Map<Node, string>(),
    private readonly stores = new Map<ModelType<any>, ModelStore<any>>(),
	) {}

	all<M extends ModelProperties>(type: ModelType<M>): Readonly<Model<M>>[] {
		return this.stores.has(type) ? this.stores.get(type)!.all() : []
	}

	allIds<M extends ModelProperties>(type: ModelType<M>): string[] {
		return this.stores.has(type) ? this.stores.get(type)!.allIds() : []
	}

	belongsTo<M extends ModelProperties>(type: ModelType<M>, modelId: string): boolean {
		return this.has(type) && this.stores.get(type)!.has(modelId)
	}

	clone(prefix: string, modelId: string, node: Node, id?: number): string | undefined {
		const type = this.types.get(modelId)
		if (type === undefined) return undefined

		const properties = this.read(modelId)
		if (properties === undefined) return undefined

		return this.create(type, prefix, properties, node, id)
	}

	create<M extends ModelProperties>(
		type: ModelType<M>,
		prefix: string,
		properties: M,
		node: Node,
		id?: number,
	): string {
		let store = this.stores.get(type)

		if (store === undefined) {
			store = new ModelStore<M>(prefix, type)
		}

		const modelId = id === undefined
			? store.nextId()
			: `${prefix}-${id}`
		store.insertOrUpdate(modelId, properties)

		this.stores.set(type, store)
		this.nodes.set(modelId, node)
		this.types.set(modelId, type)
		this.models.set(node, modelId)
		return modelId
	}

	delete(modelId: string): boolean {
		const type = this.types.get(modelId)
		if (type === undefined) return false

		const modelStore = this.stores.get(type)
		if (modelStore === undefined) return false

		const result = modelStore.delete(modelId)

		if (result) {
			this.types.delete(modelId)
		}

		if (modelStore.empty()) {
			this.stores.delete(type)
		}

		return result
	}

	equals(models: Models): boolean {
		const typesKeysThis = [...this.types.keys()]
		const storesKeysThis = [...this.stores.keys()]

		return (
			equal(typesKeysThis, [...models.types.keys()]) &&
      typesKeysThis.every((_) => this.types.get(_) === models.types.get(_)) &&
      equal(this.nodes, models.nodes) &&
      equal(this.models, models.models) &&
      equal(storesKeysThis, [...models.stores.keys()]) &&
      storesKeysThis.every((_) =>
        this.stores.get(_)!.equals(models.stores.get(_)!),
      )
		)
	}

	get<M extends ModelProperties>(modelId: string): Readonly<Model<M>> | undefined {
		if (not(this.valid(modelId))) return undefined
		return this.stores.get(this.types.get(modelId)!)!.get(modelId)
	}

	has<M extends ModelProperties>(type: ModelType<M>): boolean {
		return this.stores.has(type)
	}

	insert<M extends ModelProperties>(prefix: string, model: Model<M>, node: Node): boolean {
		let store = this.stores.get(model.type)

		if (store === undefined) {
			store = new ModelStore<M>(prefix, model.type)
		}

		if (not(model.id.startsWith(prefix))) return false
		if (this.belongsTo(model.type, model.id)) return false

		store.insertOrUpdate(model.id, model.properties)

		this.stores.set(model.type, store)
		this.nodes.set(model.id, node)
		this.types.set(model.id, model.type)
		this.models.set(node, model.id)

		return this.belongsTo(model.type, model.id)
	}

	missing<M extends ModelProperties>(type: ModelType<M>): boolean {
		return not(this.has(type))
	}

	modelId(node: Node): string | undefined {
		return this.models.get(node)
	}

	node(modelId: string): Node | undefined {
		return this.nodes.get(modelId)
	}

	read<M extends ModelProperties>(modelId: string): M | undefined {
		const type = this.types.get(modelId)
		if (type === undefined) return undefined

		return this.belongsTo(type, modelId)
			? (this.stores.get(type)!.read(modelId) as M)
			: undefined
	}

	readModel<M extends ModelProperties>(modelId: string): Model<M> | undefined {
		const type = this.types.get(modelId)
		if (type === undefined) return undefined

		return this.belongsTo(type, modelId)
			? (this.stores.get(type)!.readModel(modelId) as Model<M>)
			: undefined
	}

	resolve<M extends ModelProperties>(node: Node): M | undefined {
		const modelId = this.models.get(node)
		if (modelId === undefined) return undefined

		return this.read(modelId)
	}

	typeSet(): Set<ModelType<ModelProperties>> {
		return new Set(this.stores.keys())
	}

	update<M extends ModelProperties>(modelId: string, values: Partial<M>): boolean {
		const type = this.types.get(modelId)
		if (type === undefined) return false

		return this.stores.get(type)!.update(modelId, values)
	}

	valid(modelId: string): boolean {
		const type = this.types.get(modelId)
		if (type === undefined) return false

		const node = this.node(modelId)
		if (node === undefined) return false

		return this.stores.get(type)!.has(modelId)
	}

	serialise(manifest: Manifest): Record<string, unknown> {
		return {
			nodes: [...this.nodes],
			types: [...this.types].map(([k, type]) => [k, manifest.modelName(type)]),
			models: [...this.models],
			stores: [...this.stores].map(([type, store]) => [
				manifest.modelName(type),
				store.serialise(manifest),
			]),
		}
	}

	static deserialise(data: any, manifest: Manifest): Models {
		return new Models(
			new Map(data.nodes),
			new Map(
				data.types.map((entry: any) => [
					entry[0],
					manifest.modelType(entry[1]),
				]),
			),
			new Map(data.models),
			new Map(
				data.stores.map((entry: any) => [
					manifest.modelType(entry[0]),
					ModelStore.deserialise(entry[1], manifest),
				]),
			),
		)
	}
}
