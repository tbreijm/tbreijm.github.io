import {Edge, Node} from '.'
import {equal} from '../Equals'
import {HyperGraphData, JSONObject} from '../Input'

export class HyperGraph {
	constructor(
		readonly nodes: Set<Node>,
		readonly edges: Map<number, Edge>,
		readonly nodeEdgeIndex: Map<Node, Set<number>>,
	) {}

	countEdgesForNode(node: Node): number {
		const edges = this.nodeEdgeIndex.get(node)
		return edges ? edges.size : 0
	}

	edgesForNode(node: Node): number[] {
		const edges = this.nodeEdgeIndex.get(node)
		return edges ? [...edges] : []
	}

	nextNodeId(): number {
		return this.nextId(this.nodes.has.bind(this.nodes))
	}

	nextEdgeId(): number {
		return this.nextId(this.edges.has.bind(this.edges))
	}

	private nextId(has: (id: number) => boolean): number {
		let id = 1
		while (has(id)) {
			id += 1
		}
		return id
	}

	equals(graph: HyperGraph): boolean {
		const nodesEqual = equal(this.nodes, graph.nodes)
		const edgesEqual = equal(this.edges, graph.edges)
		const indexEqual = equal(this.nodeEdgeIndex, graph.nodeEdgeIndex)

		return nodesEqual && edgesEqual && indexEqual
	}

	map(
		nodeMap: (nodes: Set<Node>) => Set<Node>,
		edgeMap: (edges: Map<number, Edge>) => Map<number, Edge>,
		indexMap: (index: Map<Node, Set<number>>) => Map<Node, Set<number>>,
	): HyperGraph {
		return new HyperGraph(
			nodeMap(this.nodes),
			edgeMap(this.edges),
			indexMap(this.nodeEdgeIndex),
		)
	}

	serialise(): JSONObject {
		return {
			nodes: [...this.nodes],
			edges: [...this.edges.values()].map(({ id, nodes }) => ({
				id,
				nodes: [...nodes],
			})),
			index: [...this.nodeEdgeIndex].map(([k, v]) => [k, [...v]]),
		}
	}

	static deserialise(data: HyperGraphData): HyperGraph {
		return new HyperGraph(
			new Set(data.nodes),
			new Map(
				data.edges.map((edge: JSONObject) => [
					Number(edge.id),
					{ id: Number(edge.id), nodes: new Set(edge.nodes as number[]) },
				]),
			),
			new Map(data.index.map((entry) => [Number(entry[0]), new Set(entry[1] as unknown as number[])])),
		)
	}
}
