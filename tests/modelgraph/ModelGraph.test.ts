import chai, { expect } from 'chai'
import { describe } from 'mocha'
import sinonChai from 'sinon-chai'
import * as sinon from 'sinon'
import { Model, ModelGraph, Models, Relationships } from '../../src/modelgraph'
import { Complex, Optional, Simple } from './Model.values'
import { TestA, TestB } from './Relationship.values'
import {
	connected2Graph, connected2GraphB,
	connected4Graph,
	dualConnected2Graph,
	indirectGraph, migratableGraph, relationships0,
	relationships0a, relationships0b,
	relationships1,
	relationships1_4,
	relationships1b,
	relationships1d,
	relationships2a,
	relationships2b,
	singleComplexNodeGraph,
	singleSimpleNodeGraph, tripleGraph,
	unconnected2Graph
} from './ModelGraph.values'
import { manifest } from './Models.values'
import { equal } from '../../src/Equals'

chai.use(sinonChai)

describe('ModelGraph', () => {
	describe('allModels', () => {
		it('should return an empty array when the graph is empty', () => {
			const graph = new ModelGraph()
			expect(graph.allModels(Simple)).to.deep.equal([])
		})

		it('should return all the models of a given type', () => {
			const graph = connected2Graph()
			expect(graph.allModels(Simple)).to.deep.equal([new Model('smp-1', {}, Simple)])
		})
	})

	describe('allRelationships', () => {
		it('should return an empty array when the graph is empty', () => {
			const graph = new ModelGraph()
			expect(graph.allRelationships(TestA)).to.deep.equal([])
		})

		it('should return all relationships of the given type', () => {
			const graph = connected2Graph()
			expect(graph.allRelationships(TestA)).to.deep.equal([relationships1()])
		})
	})

	describe('any', () => {
		it('should return false when the graph is empty', () => {
			const graph = new ModelGraph()
			expect(graph.any(TestA, 'smp-1')).to.be.false
		})

		it('should return false when no models are specified', () => {
			const graph = new ModelGraph()
			expect(graph.any(TestA, [])).to.be.false
		})

		it('should return false when no relationships are specified', () => {
			const graph = new ModelGraph()
			expect(graph.any([], 'smp-1')).to.be.false
		})

		it('should return true when a relationship exists', () => {
			const graph = connected2Graph()
			expect(graph.any(TestA, 'smp-1')).to.be.true
		})

		it('should return false when a relationship does not exist', () => {
			const graph = connected2Graph()
			expect(graph.any(TestB, 'smp-1')).to.be.false
		})

		it('should return true when a relationship exists and all models are specified', () => {
			const graph = connected2Graph()
			expect(graph.any(TestA, ['smp-1', 'cpx-1'])).to.be.true
		})

		it('should return false when a relationship does not exist and multiple models are specified', () => {
			const graph = connected2Graph()
			expect(graph.any(TestA, ['smp-2', 'cpx-1'])).to.be.false
		})

		it('should return true when a relationship exists and some models are specified', () => {
			const graph = tripleGraph()
			expect(graph.any(TestA, ['smp-1', 'cpx-1'])).to.be.true
		})

		it('should return false when a relationship does not exist and some models are specified', () => {
			const graph = tripleGraph()
			expect(graph.any(TestA, ['cpx-1', 'smp-2'])).to.be.false
		})

		it('should return true when multiple relationships are specified of only one is active', () => {
			const graph = connected2Graph()
			expect(graph.any([TestB, TestA], ['smp-1', 'cpx-1'])).to.be.true
		})

		it('should return true when multiple relationships are specified', () => {
			const graph = dualConnected2Graph()
			expect(graph.any([TestA, TestB], ['smp-1', 'cpx-1'])).to.be.true
		})

		it('should return false when a relationship exists and invalid models are specified', () => {
			const graph = connected2Graph()
			expect(graph.any(TestA, ['smp-1', 'cpx-2'])).to.be.false
		})
	})

	describe('belongsTo', () => {
		it('should return false when the graph is empty', () => {
			const graph = new ModelGraph()
			expect(graph.belongsTo(Simple, 'smp-1')).to.be.false
		})

		it('should return true when a model belongs to a type', () => {
			const graph = connected2Graph()
			expect(graph.belongsTo(Complex, 'cpx-1')).to.be.true
		})

		it('should return false when a model belongs to a different type', () => {
			const graph = connected2Graph()
			expect(graph.belongsTo(Simple, 'cpx-1')).to.be.false
		})
	})

	describe('clone', () => {
		it('should return undefined when the graph is empty', () => {
			const graph = new ModelGraph()
			expect(graph.clone('smp', 'smp-1')).to.be.undefined
		})

		it('should return if the new model id is undefined', () => {
			const models = new Models()
			const cloneStub = sinon.stub(models, 'clone').callsFake(() => undefined)

			const graph = new ModelGraph(models)
			const model1 = graph.create(Complex, 'cpx', { value: 'A' })!
			const model2 = graph.create(Simple, 'smp', {})!
			graph.start(TestA, [model1, model2])

			expect(graph.clone('smp', 'smp-1')).to.be.undefined

			cloneStub.restore()
		})

		it('should clone an existing unconnected model and return the new id', () => {
			const graph = unconnected2Graph()
			expect(graph.clone('smp', 'smp-1')).to.equal('smp-2')
		})

		it('should clone an existing connected model and return the new id', () => {
			const graph = connected2Graph()
			const newId = graph.clone('smp', 'smp-1')
			expect(newId).to.equal('smp-2')

			const relationships = graph.allRelationships(TestA)
			expect(equal(relationships, [relationships1(), relationships1d()])).to.be.true
		})
	})

	describe('create', () => {
		it('should create a new model and accompanying node', () => {
			const graph = new ModelGraph()
			expect(graph.create(Complex, 'cpx',{value: 'A'})).to.equal('cpx-1')
		})
	})

	describe('delete', () => {
		it('should return false when the graph is empty', () => {
			const graph = new ModelGraph()
			expect(graph.delete('smp-1')).to.be.false
		})

		it('should return true when a model is deleted', () => {
			const graph = singleSimpleNodeGraph()
			expect(graph.delete('smp-1')).to.be.true
		})

		it('should return if the new model id is undefined', () => {
			const models = new Models()
			const cloneStub = sinon.stub(models, 'delete').callsFake(() => false)

			const graph = new ModelGraph(models)
			graph.create(Complex, 'cpx', { value: 'A' })

			expect(graph.delete('cpx-1')).to.be.false

			cloneStub.restore()
		})

		it('should return false when a model is not deleted', () => {
			const graph = singleSimpleNodeGraph()
			expect(graph.delete('cpx-1')).to.be.false
		})
	})

	describe('end', () => {
		it('should return false when the graph is empty', () => {
			const graph = new ModelGraph()
			expect(graph.end(1)).to.be.false
		})

		it('should return true when a relationship is ended', () => {
			const graph = connected2Graph()
			const {id: edgeId} = graph.one(TestA, ['smp-1'])!
			expect(graph.end(edgeId!)).to.be.true
		})
	})

	describe('endAll', () => {
		it('should return an empty array when the graph is empty', () => {
			const graph = new ModelGraph()
			expect(graph.endAll('cpx-1', new Set())).to.deep.equal([])
		})

		it('should return an array with all relationships that have been ended', () => {
			const graph = connected2Graph()
			expect(graph.endAll('cpx-1', new Set())).to.deep.equal([relationships1()])
		})

		it('should return an array with all relationships that have been ended', () => {
			const relationships = new Relationships()
			const typeStub = sinon.stub(relationships, 'type').callsFake(() => undefined)

			const graph = new ModelGraph(new Models(), relationships)

			graph.start(TestA, [
				graph.create(Complex, 'cpx', { value: 'A' }),
				graph.create(Simple, 'smp', {})
			])

			expect(graph.endAll('cpx-1', new Set([TestA]))).to.deep.equal([])

			typeStub.restore()
		})

		it('should return an array with subset of all relationships that have been ended', () => {
			const graph = dualConnected2Graph()
			expect(graph.endAll('cpx-1', new Set([TestA]))).to.deep.equal([relationships1()])
		})

		it('should return an empty array when no relationships in the subset existed', () => {
			const graph = connected2Graph()
			expect(graph.endAll('cpx-1', new Set([TestB]))).to.deep.equal([])
		})
	})

	describe('equals', () => {
		it('should return true for two empty graphs', () => {
			const graph1 = new ModelGraph()
			const graph2 = new ModelGraph()

			expect(graph1.equals(graph2)).to.be.true
		})

		it('should return false when one graph contains models the other does not', () => {
			const graph1 = new ModelGraph()
			const graph2 = connected2Graph()

			expect(graph1.equals(graph2)).to.be.false
		})

		it('should return false when the models have different properties', () => {
			const graph1 = connected2Graph()
			const graph2 = connected2GraphB()

			expect(graph1.equals(graph2)).to.be.false
		})

		it('should return true for the same graphs', () => {
			const graph1 = migratableGraph()
			const graph2 = migratableGraph()

			expect(graph1.equals(graph2)).to.be.true
		})

		it('should return true deserialised serialised clone', () => {
			const graph1 = migratableGraph()
			const graph2 = ModelGraph.deserialise(migratableGraph().serialise(manifest), manifest)

			expect(graph1.equals(graph2)).to.be.true
		})
	})

	describe('insert', () => {
		it('should insert the given model with a new accompanying node', () => {
			const graph = new ModelGraph()
			expect(graph.insert('cpx', new Model('cpx-1', {value: 'A'}, Complex))).to.be.true
			expect(graph.read('cpx-1')).to.deep.equal({value: 'A'})
		})
		it('should not insert a model when the id exists already', () => {
			const graph = connected2Graph()
			expect(graph.insert('cpx', new Model('cpx-1',{value: 'B'}, Complex))).to.be.false
			expect(graph.read('cpx-1')).to.deep.equal({value: 'A'})
		})
	})

	describe('many', () => {
		it('should return an empty array when the graph is empty', () => {
			const graph = new ModelGraph()
			expect(graph.many(TestA, 'cpx-1')).to.deep.equal([])
		})

		it('should return an empty array when no models are specified', () => {
			const graph = new ModelGraph()
			expect(graph.many(TestA, [])).to.deep.equal([])
		})

		it('should return an empty array when no relationships are specified', () => {
			const graph = new ModelGraph()
			expect(graph.many([], 'cpx-1')).to.deep.equal([])
		})

		it('should return an empty array when a graph has a model without relationships', () => {
			const graph = unconnected2Graph()
			expect(graph.many(TestA, 'cpx-1')).to.deep.equal([])
		})

		it('should return an empty array when a graph has a model without relationships', () => {
			const graph = connected2Graph()
			expect(graph.many(TestB, 'cpx-1')).to.deep.equal([])
		})

		it('should return a relationship array', () => {
			const graph = connected2Graph()
			const relationships = graph.many(TestA, ['cpx-1', 'smp-1'])
			expect(relationships).to.deep.equal([relationships1()])
		})

		it('should return a relationship array when multiple relationships are specified', () => {
			const graph = dualConnected2Graph()
			expect(graph.many([TestA, TestB], ['cpx-1', 'smp-1'])).to.deep.equal(relationships2a())
		})

		it('should return a relationship array when multiple relationships are specified 2', () => {
			const graph = dualConnected2Graph()
			expect(graph.many([TestB, TestA], ['cpx-1', 'smp-1'])).to.deep.equal(relationships2b())
		})

		it('should return a relationship array when multiple relationships are specified 3', () => {
			const graph = connected2Graph()
			expect(graph.many([TestB, TestA], ['cpx-1', 'smp-1'])).to.deep.equal([relationships1()])
		})
	})

	describe('one', () => {
		it('should return an empty relationship when the graph is empty', () => {
			const graph = new ModelGraph()
			expect(graph.one(TestA, ['cpx-1'])).to.deep.equal(relationships0a())
		})

		it('should return an empty relationship when no models are provided', () => {
			const graph = new ModelGraph()
			expect(graph.one(TestA, [])).to.deep.equal(relationships0a())
		})

		it('should return an empty relationship when no models are provided for any relationship', () => {
			const graph = new ModelGraph()
			expect(graph.one([TestA, TestB], [])).to.deep.equal(relationships0a())
		})

		it('should return an empty relationship when a graph has a model without relationships', () => {
			const graph = unconnected2Graph()
			expect(graph.one(TestA, ['cpx-1'])).to.deep.equal(relationships0a())
		})

		it('should return an empty relationship when a graph has a model without relationships', () => {
			const graph = connected2Graph()
			expect(graph.one(TestB, ['cpx-1'])).to.deep.equal(relationships0b())
		})

		it('should return a relationship', () => {
			const graph = connected2Graph()
			expect(graph.one(TestA, ['cpx-1'])).to.deep.equal(relationships1())
		})

		it('should return a relationship when multiple types are given', () => {
			const graph = dualConnected2Graph()
			expect(graph.one([TestA, TestB], ['cpx-1'])).to.deep.equal(relationships1())
		})

		it('should return a relationship when multiple types are given 2', () => {
			const graph = dualConnected2Graph()
			expect(graph.one([TestB, TestA], ['cpx-1'])).to.deep.equal(relationships1b())
		})

		it('should return a relationship when multiple types and models are given', () => {
			const graph = dualConnected2Graph()
			expect(graph.one([TestA, TestB], ['cpx-1', 'smp-1'])).to.deep.equal(relationships1())
		})

		it('should return a relationship when multiple types and models are given 2', () => {
			const graph = dualConnected2Graph()
			expect(graph.one([TestB, TestA], ['cpx-1', 'smp-1'])).to.deep.equal(relationships1b())
		})

		it('should return either relationship', () => {
			const graph = connected2Graph()
			expect(graph.one([TestB, TestA], ['cpx-1', 'smp-1'])).to.deep.equal(relationships1())
		})
	})

	describe('path', () => {
		it('should return false when the graph is empty', () => {
			const graph = new ModelGraph()
			expect(graph.path([TestA],['cpx-1', 'smp-1'])).to.be.false
		})

		it('should return false when no model ids are given', () => {
			const graph = connected2Graph()
			expect(graph.path([TestA], [])).to.be.false
		})

		it('should return false when a single model id is given', () => {
			const graph = connected2Graph()
			expect(graph.path([TestA],['cpx-1'])).to.be.false
		})

		it('should return true when any path exists', () => {
			const graph = connected2Graph()
			expect(graph.path([],['cpx-1', 'smp-1'])).to.be.true
		})

		it('should return false when the relationship type is undefined', () => {
			const relationships = new Relationships()
			const typeStub = sinon.stub(relationships, 'type').callsFake(() => undefined)

			const graph = new ModelGraph(new Models(), relationships)

			graph.start(TestA, [
				graph.create(Complex, 'cpx', { value: 'A' }),
				graph.create(Simple, 'smp', {})
			])

			expect(graph.path([TestA],['cpx-1', 'smp-1'])).to.be.false

			typeStub.restore()
		})

		it('should return true when a direct path exists', () => {
			const graph = connected2Graph()
			expect(graph.path([TestA],['cpx-1', 'smp-1'])).to.be.true
		})

		it('should return false when a path cannot be created with the given relationships', () => {
			const graph = connected2Graph()
			expect(graph.path([TestB],['cpx-1', 'smp-1'])).to.be.false
		})

		it('should return false when some model ids are invalid', () => {
			const graph = connected2Graph()
			expect(graph.path([TestA],['cpx-1', 'smp-2'])).to.be.false
		})

		it('should return true when a direct relationships is started for the given model ids', () => {
			const graph = unconnected2Graph()
			expect(graph.path([TestA],['cpx-1', 'smp-1'])).to.be.false
			graph.start(TestA, ['cpx-1', 'smp-1'])
			expect(graph.path([TestA],['cpx-1', 'smp-1'])).to.be.true
		})

		it('should return false when a direct relationships is ended for the given model ids', () => {
			const graph = connected2Graph()
			expect(graph.path([TestA],['cpx-1', 'smp-1'])).to.be.true
			graph.end(1)
			expect(graph.path([TestA],['cpx-1', 'smp-1'])).to.be.false
		})

		it('should return true when an indirect relationships is started', () => {
			const graph = new ModelGraph()
			graph.create(Complex, 'cpx', {value: 'A'})
			graph.create(Simple, 'smp', {})
			graph.create(Optional, 'opt', {})
			expect(graph.path([TestA, TestB], ['cpx-1', 'opt-1'])).to.be.false

			graph.start(TestA, ['cpx-1', 'smp-1'])
			graph.start(TestB, ['smp-1', 'opt-1'])
			expect(graph.path([TestA, TestB], ['cpx-1', 'opt-1'])).to.be.true
		})

		it('should return false when an indirect relationships is ended', () => {
			const graph = indirectGraph()
			expect(graph.path([TestA, TestB], ['cpx-1', 'opt-1'])).to.be.true

			graph.end(2)
			expect(graph.path([TestA, TestB], ['cpx-1', 'opt-1'])).to.be.false
		})

		it('should return true for multiple connected model ids', () => {
			const graph = indirectGraph()
			expect(graph.path([TestA, TestB], ['cpx-1', 'smp-1', 'opt-1'])).to.be.true
		})

		it('should return false for multiple connected model ids when the path is incomplete', () => {
			const graph = indirectGraph()
			expect(graph.path([TestA], ['cpx-1', 'smp-1', 'opt-1'])).to.be.false
		})
	})

	describe('read', () => {
		it('should return undefined when the graph is empty', () => {
			const graph = new ModelGraph()
			expect(graph.read('cpx-1')).to.be.undefined
		})

		it('should return a model properties', () => {
			const graph = singleComplexNodeGraph()
			expect(graph.read('cpx-1')).to.deep.equal({value: 'A'})
		})
	})

	describe('resolveEdge', () => {
		it('should return an empty relationship when the graph is empty', () => {
			const graph = new ModelGraph()
			expect(graph.resolveEdge(1)).to.deep.equal(relationships0())
		})

		it('should return a relationship', () => {
			const graph = connected4Graph()
			expect(graph.resolveEdge(1)).to.deep.equal(relationships1_4())
		})

		it('should return an empty relationship when a node does not have a model', () => {
			const models = new Models()
			const modelIdStub = sinon.stub(models, 'modelId').callsFake(() => undefined)

			const graph = new ModelGraph(models)

			const model1 = graph.create(Complex, 'cpx', { value: 'A' })!
			const model2 = graph.create(Simple, 'smp', {})!
			const model3 = graph.create(Simple, 'smp', {})!
			const model4 = graph.create(Simple, 'smp', {})!
			graph.start(TestA, [model1, model2, model3, model4])

			expect(graph.resolveEdge(1)).to.deep.equal(relationships0a())

			modelIdStub.restore()
		})

		it('should return an empty relationship when a node does not have a valid model', () => {
			const models = new Models()
			const validStub = sinon.stub(models, 'valid').callsFake(() => {
				return validStub.callCount < 5
			})

			const graph = new ModelGraph(models)

			const model1 = graph.create(Complex, 'cpx', { value: 'A' })!
			const model2 = graph.create(Simple, 'smp', {})!
			const model3 = graph.create(Simple, 'smp', {})!
			const model4 = graph.create(Simple, 'smp', {})!
			graph.start(TestA, [model1, model2, model3, model4])

			expect(graph.resolveEdge(1)).to.deep.equal(relationships0a())

			validStub.restore()
		})
	})

	describe('start', () => {
		it('should return false when the graph is empty', () => {
			const graph = new ModelGraph()
			expect(graph.start(TestA, ['cpx-1', 'smp-1'])).to.be.undefined
		})

		it('should return true when all the models have accompanying nodes', () => {
			const graph = unconnected2Graph()
			expect(graph.start(TestA, ['cpx-1', 'smp-1'])).to.equal(1)
		})

		it('should return true when all the models have accompanying nodes', () => {
			const relationships = new Relationships()
			const startStub = sinon.stub(relationships, 'start').callsFake(() => false)

			const graph = new ModelGraph(new Models(), relationships)

			graph.create(Complex, 'cpx', { value: 'A' })
			graph.create(Simple, 'smp', {})
			expect(graph.start(TestA, ['cpx-1', 'smp-1'])).to.be.undefined

			startStub.restore()
		})
	})

	describe('update', () => {
		it('should return false when the graph is empty', () => {
			expect(new ModelGraph().update('smp-1', {}))
		})
	})

	describe('serialise', () => {
		it('should serialise an empty graph', () => {
			const graph = new ModelGraph()
			const expected = {
				graph: {
					edges: [],
					nodes: [],
					index: []
				},
				models: {
					models: [],
					nodes: [],
					stores: [],
					types: []
				},
				relationships: {
					stores:[],
					types: []
				},
			}
			expect(graph.serialise(manifest)).to.deep.equal(expected)
		})

		it('should serialise a graph', () => {
			const graph = connected2Graph()
			const expected = {
				graph: {
					edges: [{id: 1, nodes: [1,2]}],
					nodes: [2,1],
					index: [
						[1, [1]],
						[2, [1]]
					]
				},
				models: {
					models: [
						[1, 'cpx-1'],
						[2, 'smp-1']
					],
					nodes: [
						['cpx-1', 1],
						['smp-1', 2]
					],
					stores: [
						['Complex', {
							collection: [{id: 'cpx-1', properties: {value: 'A'}, type: 'Complex'}],
							index: [['cpx-1', 0]],
							type: 'Complex'
						}],
						['Simple', {
							collection: [{id: 'smp-1', properties: {}, type: 'Simple'}],
							index: [['smp-1', 0]],
							type: 'Simple'
						}]
					],
					types: [
						['cpx-1', 'Complex'],
						['smp-1', 'Simple']
					]
				},
				relationships: {
					stores:[['TestA', {'edges':[1]}]],
					types: [[1, 'TestA']]
				},
			}
			expect(graph.serialise(manifest)).to.deep.equal(expected)
		})
	})

	describe('deserialise', () => {
		it('should deserialise an empty graph', () => {
			const graph = new ModelGraph()
			const data = {
				graph: {
					edges: [],
					nodes: [],
					index: []
				},
				models: {
					models: [],
					nodes: [],
					stores: [],
					types: []
				},
				relationships: {
					stores:[],
					types: []
				},
			}
			expect(graph.equals(ModelGraph.deserialise(data, manifest))).to.be.true
		})

		it('should deserialise a graph', () => {
			const data = {
				graph: {
					edges: [{id: 1, nodes: [1,2]}],
					nodes: [2,1],
					index: [
						[1, [1]],
						[2, [1]]
					]
				},
				models: {
					models: [
						[1, 'cpx-1'],
						[2, 'smp-1']
					],
					nodes: [
						['cpx-1', 1],
						['smp-1', 2]
					],
					stores: [
						['Complex', {
							collection: [{id: 'cpx-1', properties: {value: 'A'}, type: 'Complex'}],
							index: [['cpx-1', 0]],
							type: 'Complex'
						}],
						['Simple', {
							collection: [{id: 'smp-1', properties: {}, type: 'Simple'}],
							index: [['smp-1', 0]],
							type: 'Simple'
						}]
					],
					types: [
						['cpx-1', 'Complex'],
						['smp-1', 'Simple']
					]
				},
				relationships: {
					stores:[['TestA', {'edges':[1]}]],
					types: [[1, 'TestA']]
				},
				current: [],
			}
			expect(connected2Graph().equals(ModelGraph.deserialise(data, manifest))).to.be.true
		})
	})
})