import { expect } from 'chai'
import { describe } from 'mocha'
import { Edge, expand, Node, simplify } from '../../src/hypergraph'
import { connectedGraph, emptyGraph, unconnectedGraph } from './HyperGraph.values'

describe('Edge', () => {
	describe('simplify', () => {
		it('should return a number when passed a number', () => {
			expect(simplify(1)).to.equal(1)
		})

		it('should return a number when passed an edge', () => {
			const edge: Edge = {
				id: 1,
				nodes: new Set<Node>()
			}

			expect(simplify(edge)).to.equal(1)
		})
	})

	describe('expand', () => {
		it('should return undefined when expanding an edge id for an empty graph', () => {
			expect(expand(emptyGraph(), 1)).to.be.undefined
		})

		it('should return undefined when expanding an edge id for an unconnected graph', () => {
			expect(expand(unconnectedGraph(), 1)).to.be.undefined
		})

		it('should return an edge when expanding an edge id for an connected graph', () => {
			const edge = expand(connectedGraph(), 1)
			expect(edge.id).to.equal(1)
			expect(edge.nodes).to.deep.equal(new Set([1,2]))
		})

		it('should return undefined when expanding a non-existent edge id for an connected graph', () => {
			expect(expand(connectedGraph(), 2)).to.be.undefined
		})

		it('should return an edge when expanding an edge id for an connected graph', () => {
			const edge = {
				id: 1,
				nodes: new Set([1,2])
			}

			const result = expand(connectedGraph(), edge)
			expect(result.id).to.equal(edge.id)
			expect(result.nodes).to.deep.equal(edge.nodes)
		})
	})
})