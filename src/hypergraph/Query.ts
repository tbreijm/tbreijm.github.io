import { EdgeId, expand, HyperGraph, Node, simplify } from '../hypergraph'
import { not, SetOperations } from '../math'

export const hasNode = (graph: HyperGraph, node: Node): boolean => graph.nodes.has(node)

export const missingNode = (graph: HyperGraph, node: Node): boolean =>
	not(hasNode(graph, node))

export const hasEdge = (graph: HyperGraph, edge: EdgeId): boolean =>
	graph.edges.has(simplify(edge))

export const missingEdge = (graph: HyperGraph, edge: EdgeId): boolean =>
	not(hasEdge(graph, edge))

export const hasExact = (graph: HyperGraph, node: Node, edge: EdgeId): boolean =>
	hasEdge(graph, edge) && expand(graph, edge).nodes.has(node)

export const missingExact = (graph: HyperGraph, node: Node, edge: EdgeId): boolean =>
	not(hasExact(graph, node, edge))

export const edgeIntersection = (
	graph: HyperGraph,
	nodes: Node[],
): number[] => {
	if (nodes.length === 0) return []
	return [
		...nodes
			.map((_) => graph.edgesForNode(_))
			.reduce(
				(edges, _) => SetOperations.intersection(edges, new Set(_)),
				new Set(graph.edgesForNode(nodes[0])),
			),
	]
}

export const edgeUnion = (graph: HyperGraph, nodes: Node[]): number[] => {
	if (nodes.length === 0) return []
	return [
		...nodes
			.map((_) => graph.edgesForNode(_))
			.reduce(
				(edges, _) => SetOperations.union(edges, new Set(_)),
				new Set<number>(),
			),
	]
}

export const partition = (
	graph: HyperGraph,
	edgeIds: Set<number> = new Set(),
): Set<Node>[] => {
	return [...graph.nodes].reduce((partitions, node) => {
		if (partitions.some((_) => _.has(node))) return partitions

		const nodes = [
			node,
			...graph
				.edgesForNode(node)
				.filter((_) => edgeIds.size === 0 || edgeIds.has(_))
				.filter((_) => graph.edges.has(_))
				.flatMap((_) => [...graph.edges.get(_)!.nodes]),
		]

		const index = partitions.findIndex((set) => nodes.some((_) => set.has(_)))

		if (index === -1) return [...partitions, new Set(nodes)]

		return [
			...partitions.slice(0, index),
			SetOperations.union(new Set(nodes), partitions[index]),
			...partitions.slice(index + 1),
		]
	}, Array.of<Set<Node>>())
}

export const path = (
	graph: HyperGraph,
	nodes: Node[],
	edgeIds: Set<number>,
): boolean => {
	if (nodes.length < 2) return false

	const visited = new Set<Node>()
	const stack = [nodes[0]]
	const find = new Set<Node>(nodes)

	while (stack.length > 0 && find.size > 0) {
		const node = stack.pop()!

		if (visited.has(node)) continue
		visited.add(node)
		find.delete(node)

		stack.push(
			...graph
				.edgesForNode(node)
				.filter(
					(_) => (edgeIds.size === 0 || edgeIds.has(_)) && hasEdge(graph, _),
				)
				.flatMap((_) => [...expand(graph, _)!.nodes]),
		)
	}

	return find.size === 0
}
