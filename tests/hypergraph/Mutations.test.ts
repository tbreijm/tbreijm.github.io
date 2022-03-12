import { expect } from 'chai'
import { describe } from 'mocha'
import {
	connectedGraph,
	connectedGraph2,
	connectedGraph3,
	emptyGraph,
	unconnectedGraph,
	unconnectedGraph2
} from './HyperGraph.values'
import { Mutations } from '../../src/hypergraph'

describe('Mutations', () => {
	describe('clone', () => {
		it('should return an empty graph if an empty graph is provided', () => {
			const expected = emptyGraph()
			const result = Mutations.clone(1, 2)(emptyGraph())
			expect(expected.equals(result)).to.be.true
		})

		it('should return a graph with the new node if the graph is unconnected', () => {
			const expected = unconnectedGraph2()
			const result = Mutations.clone(1, 2)(unconnectedGraph())
			expect(expected.equals(result)).to.be.true
		})

		it('should return a graph with the new node and edges', () => {
			const expected = connectedGraph2()
			const result = Mutations.clone(1, 3)(connectedGraph())
			expect(expected.equals(result)).to.be.true
		})
	})

	describe('create', () => {
		it('should return a new graph with an additional node when the provided graph is empty', () => {
			const expected = unconnectedGraph()
			const result = Mutations.create(1)(emptyGraph())
			expect(expected.equals(result)).to.be.true
		})

		it('should return a new graph with an additional node', () => {
			const expected = unconnectedGraph2()
			const result = Mutations.create(2)(unconnectedGraph())
			expect(expected.equals(result)).to.be.true
		})
	})

	describe('end', () => {
		it('should return an empty graph when the provided graph is empty', () => {
			const expected = emptyGraph()
			const result = Mutations.end(1)(emptyGraph())
			expect(expected.equals(result)).to.be.true
		})

		it('should return a new graph without an edge when the edge was present', () => {
			const expected = unconnectedGraph2()
			const result = Mutations.end(1)(connectedGraph())
			expect(expected.equals(result)).to.be.true
		})

		it('should return the same graph when the edge was not present', () => {
			const expected = connectedGraph()
			const result = Mutations.end(2)(connectedGraph())
			expect(expected.equals(result)).to.be.true
		})
	})

	describe('endAll', () => {
		it('should return an empty graph when the provided graph is empty', () => {
			const expected = emptyGraph()
			const result = Mutations.endAll(1, [])(emptyGraph())
			expect(expected.equals(result)).to.be.true
		})

		it('should return the same graph if the graph has no edges', () => {
			const expected = unconnectedGraph()
			const result = Mutations.endAll(1, [])(unconnectedGraph())
			expect(expected.equals(result)).to.be.true
		})

		it('should return a graph with all edges removed for the given node', () => {
			const expected = unconnectedGraph2()
			const result = Mutations.endAll(1, [1])(connectedGraph())
			expect(expected.equals(result)).to.be.true
		})

		it('should return the same graph when the node is not present', () => {
			const expected = connectedGraph()
			const result = Mutations.endAll(3, [1])(connectedGraph())
			expect(expected.equals(result)).to.be.true
		})

		it('should return a graph with a subset of the edges removed for the given node', () => {
			const expected = connectedGraph3()
			const result = Mutations.endAll(2, [1])(connectedGraph2())
			expect(expected.equals(result)).to.be.true
		})
	})

	describe('remove', () => {
		it('should return an empty graph when the provided graph is empty', () => {
			const expected = emptyGraph()
			const result = Mutations.remove(1)(emptyGraph())
			expect(expected.equals(result)).to.be.true
		})

		it('should return an empty graph when the only node is removed', () => {
			const expected = emptyGraph()
			const result = Mutations.remove(1)(unconnectedGraph())
			expect(expected.equals(result)).to.be.true
		})

		it('should return a graph without the node and its edges', () => {
			const expected = unconnectedGraph()
			const result = Mutations.remove(2)(connectedGraph())
			expect(expected.equals(result)).to.be.true
		})

		it('should return the same graph when the node is not present', () => {
			const expected = connectedGraph()
			const result = Mutations.remove(3)(connectedGraph())
			expect(expected.equals(result)).to.be.true
		})
	})

	describe('start', () => {
		it('should return a new graph with the missing nodes and new edge when the provided graph is empty', () => {
			const edge = {
				id: 1,
				nodes: new Set([1,2])
			}
			const expected = connectedGraph()
			const result = Mutations.start(edge)(emptyGraph())
			expect(expected.equals(result)).to.be.true
		})
	})
})