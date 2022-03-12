import {
	Edge,
	expand,
	HyperGraph,
	Mutations,
	Node,
	Query,
} from '../hypergraph'
import {JSONObject} from '../Input'
import {
	Model, ModelProperties,
	Models,
	ModelType,
	Relationship,
	RelationshipKey,
	Relationships,
	RelationshipType,
} from '../modelgraph'
import {not} from '../math'
import {Manifest} from './Manifest'

export default class ModelGraph {
	constructor(
		private readonly models = new Models(),
		private readonly relationships = new Relationships(),
		private graph: HyperGraph = new HyperGraph(
			new Set<Node>(),
			new Map<number, Edge>(),
			new Map<Node, Set<number>>(),
		),
	) {
	}

	all<M extends ModelProperties>(type: ModelType<M>): Readonly<M>[] {
		return this.models.all(type).map(_ => _.properties)
	}

	allIds<M extends ModelProperties>(type: ModelType<M>): string[] {
		return this.models.allIds(type)
	}

	allModels<M extends ModelProperties>(type: ModelType<M>): Readonly<Model<M>>[] {
		return this.models.all(type)
	}

	allRelationships<R extends RelationshipKey>(
		type: RelationshipType<R>,
	): Relationship<R>[] {
		return this.relationships.all(type).map((_) => this.resolveEdge(_))
	}

	allRelationshipsFor(modelId: string): Relationship<any>[] {
		const node = this.models.node(modelId)
		if (node === undefined) return []
		return this.graph.edgesForNode(node).map((_) => this.resolveEdge(_))
	}

	any<R extends RelationshipKey>(
		types: RelationshipType<R> | RelationshipType<R>[],
		modelIds: string | string[],
	): boolean {
		return this.query(types, modelIds).length > 0
	}

	belongsTo<M extends ModelProperties>(type: ModelType<M>, modelId: string): boolean {
		return this.models.belongsTo(type, modelId)
	}

	clone(prefix: string, modelId: string, id?: number): string | undefined {
		const node = this.models.node(modelId)
		if (node === undefined) return undefined

		const newNode = this.graph.nextNodeId()
		const newModelId = this.models.clone(prefix, modelId, newNode, id)
		if (newModelId === undefined) return undefined

		this.graph = Mutations.clone(node, newNode)(this.graph)

		const oldEdges = this.graph.edgesForNode(node)
		const newEdges = this.graph.edgesForNode(newNode)

		oldEdges.forEach((oldId, index) => {
			this.relationships.start(
				this.relationships.type(oldId)!,
				newEdges[index],
			)
		})

		return newModelId
	}

	create<M extends ModelProperties>(type: ModelType<M>, prefix: string, properties: M): string {
		const newNode = this.graph.nextNodeId()

		const modelId = this.models.create(type, prefix, properties, newNode)

		this.graph = Mutations.create(newNode)(this.graph)
		return modelId
	}

	delete(modelId: string): boolean {
		const node = this.models.node(modelId)
		if (node === undefined) return false

		if (this.models.delete(modelId)) {
			this.graph = Mutations.remove(node)(this.graph)
			return true
		}

		return false
	}

	end(relationshipId: number): boolean {
		if (this.relationships.end(relationshipId)) {
			this.graph = Mutations.end(relationshipId)(this.graph)
			return true
		}

		return false
	}

	endAll(
		modelId: string,
		relationships: Set<RelationshipType<any>>,
	): Relationship<any>[] {
		const node = this.models.node(modelId)
		if (node === undefined) return []

		const edgeIds = this.graph.edgesForNode(node).filter((_) => {
			if (relationships.size === 0) return true
			const type = this.relationships.type(_)
			if (type === undefined) return false
			return relationships.has(type)
		})

		const ended = edgeIds.map((_) => this.resolveEdge(_))

		this.relationships.endAll(edgeIds)
		this.graph = Mutations.endAll(node, edgeIds)(this.graph)
		return ended
	}

	equals(graph: ModelGraph): boolean {
		return (
			this.models.equals(graph.models) &&
			this.relationships.equals(graph.relationships) &&
			this.graph.equals(graph.graph)
		)
	}

	insert<M extends ModelProperties>(prefix: string, model: Model<M>): boolean {
		const newNode = this.graph.nextNodeId()

		if (this.models.insert(prefix, model, newNode)) {
			this.graph = Mutations.create(newNode)(this.graph)
			return true
		}

		return false
	}

	many<R extends RelationshipKey>(
		types: RelationshipType<R> | RelationshipType<R>[],
		modelIds: string | string[],
	): Relationship<R>[] {
		return this.query(types, modelIds).map((_) => this.resolveEdge(_))
	}

	one<R extends RelationshipKey>(
		types: RelationshipType<R> | RelationshipType<R>[],
		modelIds: string | string[],
	): Relationship<R> {
		const validEdges = this.query(types, modelIds)
		return validEdges.length === 0
			? new Relationship(undefined, [], types, new Map())
			: this.resolveEdge(validEdges[0])
	}

	path<R extends RelationshipKey>(
		types: RelationshipType<R> | RelationshipType<R>[],
		modelIds: string[],
	): boolean {
		if (modelIds.some((_) => not(this.models.valid(_)))) return false
		const typeSet = new Set(Array.isArray(types) ? types : [types])

		const nodes = modelIds.map((_) => this.models.node(_)!)
		const edgeIds = Query.edgeUnion(this.graph, nodes).filter((_) => {
			const type = this.relationships.type(_)
			return type === undefined ? false : typeSet.has(type)
		})

		if (typeSet.size > 0 && edgeIds.length === 0) return false

		return Query.path(this.graph, nodes, new Set(edgeIds))
	}

	query<R extends RelationshipKey>(
		types: RelationshipType<R> | RelationshipType<R>[],
		modelIds: string | string[],
	): number[] {
		const modelIdArray = Array.isArray(modelIds) ? modelIds : [modelIds]
		const typeArray = Array.isArray(types) ? types : [types]

		if (modelIdArray.length === 0) return []
		if (typeArray.length === 0) return []

		const nodes = modelIdArray.map((_) => this.models.node(_))
		if (nodes.length === 0) return []
		if (nodes.some((_) => _ === undefined)) return []

		const sortedNodes = nodes
			.map((_) => _!)
			.sort(
				(m, n) =>
					this.graph.countEdgesForNode(m) - this.graph.countEdgesForNode(n),
			)

		const edges = this.graph
			.edgesForNode(sortedNodes[0]!)
			.map((_) => expand(this.graph, _))

		return typeArray.flatMap((type) =>
			edges
				.filter((edge) => this.relationships.type(edge.id) === type)
				.filter((edge) => nodes.every((_) => edge.nodes.has(_!)))
				.map((_) => _.id)
				.sort((i, j) => i - j),
		)
	}

	read<M extends ModelProperties>(modelId: string): M | undefined {
		return this.models.read(modelId)
	}

	readModel<M extends ModelProperties>(modelId: string): Model<M> | undefined {
		return this.models.readModel(modelId)
	}

	resolveEdge(edgeId: number | undefined): Relationship<any> {
		const type = this.relationships.type(edgeId)
		const emptyRelationship = new Relationship(undefined, [], type, new Map())

		if (edgeId === undefined) return emptyRelationship

		if (Query.missingEdge(this.graph, edgeId)) return emptyRelationship

		const {nodes} = this.graph.edges.get(edgeId)!
		if ([...nodes].some((_) => this.models.modelId(_) === undefined)) {
			return emptyRelationship
		}

		const modelIds = [...nodes].map((_) => this.models.modelId(_)!)
		if (modelIds.some((_) => not(this.models.valid(_)))) {
			return emptyRelationship
		}

		const models = modelIds.reduce((map, modelId) => {
			const model = this.models.get(modelId)!
			const existing = map.get(model.type)

			if (existing === undefined) return map.set(model.type, model)
			if (Array.isArray(existing))
				return map.set(model.type, [...existing, model])

			return map.set(model.type, [existing, model])
		}, new Map<ModelType<any>, Model<any> | Model<any>[]>())

		return new Relationship(edgeId, modelIds, type, models)
	}

	start<R extends RelationshipKey>(
		type: RelationshipType<R>,
		modelIds: string[],
	): number | undefined {
		if (modelIds.some((_) => not(this.models.valid(_)))) return undefined

		const nodes = new Set(modelIds.map((_) => this.models.node(_)!))
		const edgeId = this.graph.nextEdgeId()

		if (not(this.relationships.start(type, edgeId))) return undefined

		this.graph = Mutations.start({
			id: edgeId,
			nodes,
		})(this.graph)

		return edgeId
	}

	types(): {models: Set<ModelType<ModelProperties>>, relationships: Set<RelationshipType<RelationshipKey>>} {
		return {
			models: this.models.typeSet(),
			relationships: this.relationships.typeSet(),
		}
	}

	update<M extends ModelProperties>(modelId: string, values: Partial<M>): boolean {
		return this.models.update(modelId, values)
	}

	copy(manifest: Manifest): ModelGraph {
		return ModelGraph.deserialise(this.serialise(manifest), manifest)
	}

	serialise(manifest: Manifest): JSONObject {
		return {
			models: this.models.serialise(manifest),
			relationships: this.relationships.serialise(manifest),
			graph: this.graph.serialise(),
		}
	}

	static deserialise(data: any, manifest: Manifest): ModelGraph {
		return new ModelGraph(
			Models.deserialise(data.models, manifest),
			Relationships.deserialise(data.relationships, manifest),
			HyperGraph.deserialise(data.graph),
		)
	}
}
