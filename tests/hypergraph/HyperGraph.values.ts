import {Edge, HyperGraph, Node} from '../../src/hypergraph'

export const emptyGraph = (): HyperGraph => new HyperGraph(
	new Set<Node>(),
	new Map<number, Edge>(),
	new Map<Node, Set<number>>()
)

export const unconnectedGraph = (): HyperGraph => new HyperGraph(
	new Set<Node>([1]),
	new Map<number, Edge>(),
	new Map<Node, Set<number>>()
)

export const unconnectedGraph2 = (): HyperGraph => new HyperGraph(
	new Set<Node>([1, 2]),
	new Map<number, Edge>(),
	new Map<Node, Set<number>>()
)

export const connectedGraph = (): HyperGraph => new HyperGraph(
	new Set<Node>([1, 2]),
	new Map<number, Edge>([[1, {
		id: 1,
		nodes: new Set([1,2])
	}]]),
	new Map<Node, Set<number>>([[1, new Set([1])], [2, new Set([1])]]))

export const connectedGraph2 = (): HyperGraph => new HyperGraph(
	new Set<Node>([1, 2, 3]),
	new Map<number, Edge>([
		[1, {
			id: 1,
			nodes: new Set([1,2])
		}],
		[2, {
			id: 2,
			nodes: new Set([2,3])
		}],
	]),
	new Map<Node, Set<number>>([
		[1, new Set([1])],
		[2, new Set([1,2])],
		[3, new Set([2])],
	]))

export const connectedGraph3 = (): HyperGraph => new HyperGraph(
	new Set<Node>([1, 2, 3]),
	new Map<number, Edge>([
		[2, {
			id: 2,
			nodes: new Set([2,3])
		}],
	]),
	new Map<Node, Set<number>>([
		[2, new Set([2])],
		[3, new Set([2])],
	]))
