import {expect} from 'chai'
import {describe} from 'mocha'
import {Edge, HyperGraph, Node} from '../../src/hypergraph'
import {HyperGraphData} from '../../src/Input'
import {connectedGraph, emptyGraph, unconnectedGraph} from './HyperGraph.values'

describe('HyperGraph', () => {
	it('should create an empty HyperGraph', () => {
		const graph = emptyGraph()

		expect(graph.nodes).to.deep.equal(new Set<Node>())
		expect(graph.edges).to.deep.equal(new Map<number, Edge>())
		expect(graph.nodeEdgeIndex).to.deep.equal(new Map<Node, Set<number>>())
	})

	describe('countEdgesForNode', () => {
		it('should return 0 for an empty graph', () => {
			expect(emptyGraph().countEdgesForNode(1)).to.equal(0)
		})

		it('should return 0 for an unconnected node', () => {
			expect(unconnectedGraph().countEdgesForNode(1)).to.equal(0)
		})

		it('should return an edge array for a connected node', () => {
			const graph = connectedGraph()
			expect(graph.countEdgesForNode(1)).to.equal(1)
			expect(graph.countEdgesForNode(2)).to.equal(1)
		})
	})

	describe('edgesForNode', () => {
		it('should return an empty edge array for an empty graph', () => {
			expect(emptyGraph().edgesForNode(1)).to.deep.equal([])
		})

		it('should return an empty edge array for an unconnected node', () => {
			expect(unconnectedGraph().edgesForNode(1)).to.deep.equal([])
		})

		it('should return an edge array for a connected node', () => {
			const graph = connectedGraph()
			expect(graph.edgesForNode(1)).to.deep.equal([1])
			expect(graph.edgesForNode(2)).to.deep.equal([1])
		})
	})

	describe('equals', () => {
		it('should return true for two empty graphs', () => {
			const graph1 = emptyGraph()
			const graph2 = emptyGraph()
			expect(graph1.equals(graph2)).to.be.true
		})

		it('should return false for an empty graph and a non empty graph', () => {
			const graph1 = emptyGraph()
			const graph2 = unconnectedGraph()
			expect(graph1.equals(graph2)).to.be.false
		})

		it('should return false for a connected graph and an unconnected graph', () => {
			const graph1 = connectedGraph()
			const graph2 = unconnectedGraph()
			expect(graph1.equals(graph2)).to.be.false
		})

		it('should return false for a connected graph and a connected graph without index', () => {
			const graph1 = connectedGraph()
			const graph2 = new HyperGraph(
				new Set<Node>([1, 2]),
				new Map<number, Edge>([[1, {
					id: 1,
					nodes: new Set([1,2])
				}]]),
				new Map<Node, Set<number>>())
			expect(graph1.equals(graph2)).to.be.false
		})
	})

	describe('nextId', () => {
		it('should return id 1 for a new node for an empty graph', () => {
			const graph = emptyGraph()
			expect(graph.nextNodeId()).to.equal(1)
		})

		it('should return id 1 for a new edge for an empty graph', () => {
			const graph = emptyGraph()
			expect(graph.nextNodeId()).to.equal(1)
		})

		it('should return next id for a new node for a unconnected graph', () => {
			const graph = unconnectedGraph()
			expect(graph.nextNodeId()).to.equal(2)
		})

		it('should return next id for a new node for a connected graph', () => {
			const graph = connectedGraph()
			expect(graph.nextNodeId()).to.equal(3)
		})
	})

	describe('map', () => {
		it('should map an empty with identity functions to itself', () => {
			const resultGraph = emptyGraph().map(
				nodes => nodes,
				edges => edges,
				index => index
			)
			expect(resultGraph).to.deep.equal(emptyGraph())
		})

		it('should map an empty graph with any pure functions to itself', () => {
			const resultGraph = emptyGraph().map(
				nodes => new Set(nodes),
				edges => new Map(edges),
				index => new Map(index)
			)
			expect(resultGraph).to.deep.equal(emptyGraph())
		})

		it('should map a graph with any pure functions', () => {
			const resultGraph = connectedGraph().map(
				nodes => new Set(nodes),
				edges => new Map(edges),
				index => new Map(index)
			)
			expect(resultGraph).to.deep.equal(connectedGraph())
		})
	})

	describe('serialise', () => {
		it('should serialise an empty graph', () => {
			const expected = {'nodes':[],'edges':[],'index':[]}
			expect(emptyGraph().serialise()).to.deep.equal(expected)
		})

		it('should serialise an unconnected graph', () => {
			const expected = {'nodes':[1],'edges':[],'index':[]}
			expect(unconnectedGraph().serialise()).to.deep.equal(expected)
		})

		it('should serialise a connected graph', () => {
			const expected = {'nodes':[1,2],'edges':[{'id':1,'nodes':[1,2]}],'index':[[1,[1]],[2,[1]]]}
			expect(connectedGraph().serialise()).to.deep.equal(expected)
		})
	})

	describe('deserialise', () => {
		it('should deserialise an empty graph', () => {
			const data = {'nodes':[],'edges':[],'index':[]}
			expect(HyperGraph.deserialise(data)).to.deep.equal(emptyGraph())
		})

		it('should deserialise an unconnected graph', () => {
			const data = {'nodes':[1],'edges':[],'index':[]}
			expect(HyperGraph.deserialise(data)).to.deep.equal(unconnectedGraph())
		})

		it('should deserialise a connected graph', () => {
			const data: HyperGraphData = {'nodes':[1,2],'edges':[{'id':1,'nodes':[1,2]}],'index':[[1,[1]],[2,[1]]]}
			expect(HyperGraph.deserialise(data)).to.deep.equal(connectedGraph())
		})
	})
})