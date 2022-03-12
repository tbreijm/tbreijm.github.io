import { expect } from 'chai'
import { describe } from 'mocha'
import { Query } from '../../src/hypergraph'
import {
	connectedGraph,
	connectedGraph2,
	connectedGraph3,
	emptyGraph,
	unconnectedGraph,
	unconnectedGraph2
} from './HyperGraph.values'

describe('Query', () => {
	describe('hasNode', () => {
		it('should return false for an empty graph', () => {
			expect(Query.hasNode(emptyGraph(), 1)).to.be.false
		})

		it('should return true when node is in graph', () => {
			expect(Query.hasNode(unconnectedGraph(), 1)).to.be.true
		})

		it('should return false when node is not in graph', () => {
			expect(Query.hasNode(unconnectedGraph(), 2)).to.be.false
		})
	})

	describe('missingNode', () => {
		it('should return true for an empty graph', () => {
			expect(Query.missingNode(emptyGraph(), 1)).to.be.true
		})

		it('should return false when node is in graph', () => {
			expect(Query.missingNode(unconnectedGraph(), 1)).to.be.false
		})

		it('should return true when node is not in graph', () => {
			expect(Query.missingNode(unconnectedGraph(), 2)).to.be.true
		})
	})

	describe('hasEdge', () => {
		it('should return false for an empty graph', () => {
			expect(Query.hasEdge(emptyGraph(), 1)).to.be.false
		})

		it('should return false for an unconnected graph', () => {
			expect(Query.hasEdge(unconnectedGraph(), 1)).to.be.false
		})

		it('should return true when edge is in graph', () => {
			expect(Query.hasEdge(connectedGraph(), 1)).to.be.true
		})

		it('should return false when edge is not in graph', () => {
			expect(Query.hasEdge(connectedGraph(), 2)).to.be.false
		})
	})

	describe('missingEdge', () => {
		it('should return true for an empty graph', () => {
			expect(Query.missingEdge(emptyGraph(), 1)).to.be.true
		})

		it('should return true for an unconnected graph', () => {
			expect(Query.missingEdge(unconnectedGraph(), 1)).to.be.true
		})

		it('should return false when edge is in graph', () => {
			expect(Query.missingEdge(connectedGraph(), 1)).to.be.false
		})

		it('should return true when edge is not in graph', () => {
			expect(Query.missingEdge(connectedGraph(), 2)).to.be.true
		})
	})

	describe('hasExact', () => {
		it('should return false for an empty graph', () => {
			expect(Query.hasExact(emptyGraph(), 1, 1)).to.be.false
		})

		it('should return false for an unconnected graph', () => {
			expect(Query.hasExact(unconnectedGraph(), 1, 1)).to.be.false
		})

		it('should return true when the node is part of the edge', () => {
			expect(Query.hasExact(connectedGraph(), 1, 1)).to.be.true
			expect(Query.hasExact(connectedGraph(), 2, 1)).to.be.true
		})

		it('should return false when the node is not part of the edge', () => {
			expect(Query.hasExact(connectedGraph(), 3, 1)).to.be.false
		})
	})

	describe('missingExact', () => {
		it('should return true for an empty graph', () => {
			expect(Query.missingExact(emptyGraph(), 1, 1)).to.be.true
		})

		it('should return true for an unconnected graph', () => {
			expect(Query.missingExact(unconnectedGraph(), 1, 1)).to.be.true
		})

		it('should return false when the node is part of the edge', () => {
			expect(Query.missingExact(connectedGraph(), 1, 1)).to.be.false
			expect(Query.missingExact(connectedGraph(), 2, 1)).to.be.false
		})

		it('should return true when the node is not part of the edge', () => {
			expect(Query.missingExact(connectedGraph(), 3, 1)).to.be.true
		})
	})

	describe('edgeIntersection', () => {
		it('should return an empty array for an empty graph', () => {
			expect(Query.edgeIntersection(emptyGraph(), [1])).to.deep.equal([])
		})

		it('should return an empty array if no nodes are provided', () => {
			expect(Query.edgeIntersection(connectedGraph(), [])).to.deep.equal([])
		})

		it('should return the edge containing all the given nodes', () => {
			expect(Query.edgeIntersection(connectedGraph(), [1,2])).to.deep.equal([1])
		})
	})

	describe('edgeUnion', () => {
		it('should return an empty array for an empty graph', () => {
			expect(Query.edgeUnion(emptyGraph(), [1])).to.deep.equal([])
		})

		it('should return an empty array if no nodes are provided', () => {
			expect(Query.edgeUnion(connectedGraph(), [])).to.deep.equal([])
		})

		it('should return the edge containing all the given nodes', () => {
			expect(Query.edgeUnion(connectedGraph2(), [1,3])).to.deep.equal([1,2])
		})
	})

	describe('partition', () => {
		it('should return an empty array for an empty graph', () => {
			expect(Query.partition(emptyGraph())).to.deep.equal([])
		})

		it('should return an array of sets for each node', () => {
			const expected = [
				new Set([1]),
				new Set([2]),
			]

			const graph = unconnectedGraph2()
			expect(Query.partition(graph)).to.deep.equal(expected)
		})

		it('should return an array of one set for two directly connected nodes', () => {
			const expected = [
				new Set([1,2]),
			]

			const graph = connectedGraph()
			expect(Query.partition(graph)).to.deep.equal(expected)
		})

		it('should return an array of one set for two indirectly connected nodes', () => {
			const expected = [
				new Set([1,2,3]),
			]

			const graph = connectedGraph2()
			expect(Query.partition(graph)).to.deep.equal(expected)
		})

		it('should return an array of sets for each connected sub graph', () => {
			const expected = [
				new Set([1]),
				new Set([2,3]),
			]

			const graph = connectedGraph3()
			expect(Query.partition(graph)).to.deep.equal(expected)
		})
	})

	describe('path', () => {
		it('should return false for an empty graph', () => {
			expect(Query.path(emptyGraph(), [1,2], new Set([1]))).to.be.false
		})

		it('should return false for an empty node array', () => {
			expect(Query.path(connectedGraph(), [], new Set([1]))).to.be.false
		})

		it('should return false for a single node', () => {
			expect(Query.path(connectedGraph(), [1], new Set([1]))).to.be.false
		})

		it('should return true for an empty edge set and connected nodes', () => {
			expect(Query.path(connectedGraph(), [1,2], new Set())).to.be.true
		})

		it('should return false for an empty edge set and unconnected nodes', () => {
			expect(Query.path(unconnectedGraph(), [1,2], new Set())).to.be.false
		})

		it('should return false when no path exists', () => {
			expect(Query.path(unconnectedGraph(), [1,2], new Set([1]))).to.be.false
		})

		it('should return true when a direct path exists', () => {
			expect(Query.path(connectedGraph(), [1,2], new Set([1]))).to.be.true
		})

		it('should return true when a indirect path exists', () => {
			expect(Query.path(connectedGraph2(), [1,3], new Set([1, 2]))).to.be.true
		})

		it('should return false when no indirect path exists', () => {
			expect(Query.path(connectedGraph3(), [1,3], new Set([2]))).to.be.false
		})

		it('should return true when a indirect path exists for multiple nodes', () => {
			expect(Query.path(connectedGraph2(), [1,2,3], new Set([1, 2]))).to.be.true
		})
	})
})