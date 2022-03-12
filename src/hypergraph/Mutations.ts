import {
	Edge,
	EdgeId,
	expand,
	HyperGraph,
	Node,
	simplify,
} from '../hypergraph'
import { MapOperations, SetOperations } from '../math'
import { missingEdge } from './Query'

export const clone = (node: Node, newNode: Node) => (graph: HyperGraph): HyperGraph =>
	graph.edgesForNode(node).reduce(
		(newGraph: HyperGraph, edge: EdgeId) =>
			start({
				id: newGraph.nextEdgeId(),
				nodes: SetOperations.replace(
					expand(newGraph, edge).nodes,
					node,
					newNode,
				),
			})(graph),
		graph.map(
			(nodes) =>
				SetOperations.union(nodes, SetOperations.replace(nodes, node, newNode)),
			(_) => _,
			(_) => _,
		),
	)

export const create = (node: Node) => (graph: HyperGraph): HyperGraph =>
	graph.map(
		(nodes) => SetOperations.insert(nodes, node),
		(_) => _,
		(_) => _,
	)

export const end = (edgeOrId: EdgeId) => (graph: HyperGraph): HyperGraph => {
	const edge: Edge = expand(graph, edgeOrId)
	const edgeId: number = simplify(edgeOrId)

	if (missingEdge(graph, edgeId)) {
		return graph
	}

	return graph.map(
		(_) => SetOperations.clone(_),
		(edges) => MapOperations.remove(edges, edgeId),
		(index) =>
			MapOperations.clean(
				MapOperations.union(
					index,
					new Map(
						[...edge.nodes].map((node) => [
							node,
							SetOperations.remove(new Set(index.get(node)), edgeId),
						]),
					),
				),
				(set: Set<Node>) => set.size === 0,
			),
	)
}

export const endAll = (node: Node, edgeIds: number[]) => (
	graph: HyperGraph,
): HyperGraph => {
	const edgeSet = new Set(edgeIds)
	return graph
		.edgesForNode(node)
		.filter((_) => edgeSet.has(_))
		.reduce(
			(newGraph: HyperGraph, edge) => end(edge)(newGraph),
			graph.map(
				(_) => _,
				(_) => _,
				(index) => {
					const oldSet = index.get(node)
					if (oldSet === undefined) return index

					return MapOperations.clean(
						MapOperations.insert(
							index,
							node,
							SetOperations.diff(oldSet, new Set(edgeIds)),
						),
						(set: Set<Node>) => set.size === 0,
					)
				},
			),
		)
}

export const remove = (node: Node) => (graph: HyperGraph): HyperGraph => {
	return endAll(
		node,
		graph.edgesForNode(node),
	)(graph).map(
		(nodes) => SetOperations.remove(nodes, node),
		(_) => _,
		(index) => MapOperations.remove(index, node),
	)
}

export const start = (edge: Edge) => (graph: HyperGraph): HyperGraph =>
	graph.map(
		(_) => SetOperations.union(_, edge.nodes),
		(_) => MapOperations.insert(_, edge.id, edge),
		(index) =>
			MapOperations.union(
				index,
				new Map(
					[...edge.nodes].map((node) => [
						node,
						SetOperations.insert(new Set(index.get(node)), edge.id),
					]),
				),
			),
	)
