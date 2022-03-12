import { describe } from 'mocha'
import { expect } from 'chai'
import {
	connected2Graph,
	connected3Graph,
	connected4Graph,
	largeGraph,
	relationships0,
	relationships1,
	relationships1_4,
	relationships1c,
	singleComplexNodeGraph
} from '../modelgraph/ModelGraph.values'
import { Reader } from '../../src/datagraph'
import { Complex, Optional, Simple } from '../modelgraph/Model.values'
import { Model, ModelGraph } from '../../src/modelgraph'
import { TestA } from '../modelgraph/Relationship.values'
import { equal } from '../../src/Equals'

describe('Reader', () => {
	describe('allIds', () => {
		it('should forward the call to the model graph', () => {
			expect(new Reader(connected2Graph()).allIds(Simple)).to.deep.equal(['smp-1'])
		})
	})

	describe('allModels', () => {
		it('should forward the call to the model graph', () => {
			expect(new Reader(connected2Graph()).allModels(Simple)).to.deep.equal([new Model('smp-1', {}, Simple)])
		})
	})

	describe('allRelationships', () => {
		it('should forward the call to the model graph', () => {
			expect(new Reader(connected2Graph()).allRelationships(TestA)).to.deep.equal([relationships1()])
		})
	})

	describe('any', () => {
		it('should forward the call to the model graph', () => {
			expect(new Reader(connected2Graph()).any<TestA>(TestA, 'cpx-1')).to.be.true
		})

		it('should forward the call to the model graph with mixed model types', () => {
			const graph = connected2Graph()
			const complex = graph.readModel<Complex>('cmp-1')
			const simple = graph.readModel<Simple>('smp-1')
			const reader = new Reader(graph)

			expect(reader.any(TestA, [complex, simple])).to.be.true
		})
	})

	describe('belongTo', () => {
		it('should return true when no models or ids are given', () => {
			expect(new Reader(connected4Graph()).belongTo(Complex)).to.be.true
		})

		it('should forward the call to the model graph for a single model or id', () => {
			expect(new Reader(connected4Graph()).belongTo(Complex, 'cpx-1')).to.be.true
		})

		it('should forward the call to the model graph for each model or id', () => {
			expect(new Reader(connected4Graph()).belongTo(Simple, 'smp-1', 'smp-2', 'smp-3')).to.be.true
		})

		it('should return false when any model id is undefined', () => {
			expect(new Reader(connected4Graph()).belongTo(Simple, 'smp-1', 'smp-2', undefined)).to.be.false
		})

		it('should return false when any model id does not belong to given type', () => {
			expect(new Reader(connected4Graph()).belongTo(Simple, 'smp-1', 'smp-2', 'cpx-1')).to.be.false
		})
	})

	describe('belongsTo', () => {
		it('should forward the call to the model graph', () => {
			expect(new Reader(connected2Graph()).belongsTo(Complex, 'cpx-1')).to.be.true
		})

		it('should return false when the given model id is undefined', () => {
			expect(new Reader(connected2Graph()).belongsTo(Complex, undefined)).to.be.false
		})
	})

	describe('count', () => {
		it('should return 0 on an empty model graph', () => {
			const condition = (_: Complex) => _.value === 'A'
			const reader = new Reader(new ModelGraph())
			expect(reader.countIf(Complex, condition)).to.equal(0)
		})

		it('should return the number of models that exist', () => {
			const reader = new Reader(connected4Graph())
			expect(reader.count(Simple)).to.equal(3)
		})
	})

	describe('countIf', () => {
		it('should return 0 on an empty model graph', () => {
			const condition = (_: Complex) => _.value === 'A'
			const reader = new Reader(new ModelGraph())
			expect(reader.countIf(Complex, condition)).to.equal(0)
		})

		it('should return the number of models that meet the condition', () => {
			const condition = () => true
			const reader = new Reader(connected4Graph())
			expect(reader.countIf(Simple, condition)).to.equal(3)
		})

		it('should return the number of models that meet the condition', () => {
			const condition = (_: Optional) => _.value === undefined
			const reader = new Reader(largeGraph())
			expect(reader.countIf(Optional, condition)).to.equal(1)
		})
	})

	describe('exists', () => {
		it('should return false on an empty modal graph', () => {
			const condition = (_: Complex) => _.value === 'A'
			const reader = new Reader(new ModelGraph())
			expect(reader.exists(Complex, condition)).to.be.false
		})

		it('should return true when a model exists that meets the condition', () => {
			const condition = (_: Optional) => _.value === undefined
			const reader = new Reader(largeGraph())
			expect(reader.exists(Optional, condition)).to.be.true
		})

		it('should return false when no model exists that meets the condition', () => {
			const condition = (_: Complex) => _.value === undefined
			const reader = new Reader(largeGraph())
			expect(reader.exists(Complex, condition)).to.be.false
		})

		it('should return true when a model exists', () => {
			const reader = new Reader(connected4Graph())
			expect(reader.exists(Simple)).to.be.true
		})
	})

	describe('filter', () => {
		it('should return an empty array on an empty modal graph', () => {
			const condition = (_: Complex) => _.value === 'A'
			const reader = new Reader(new ModelGraph())
			expect(reader.filter(Complex, condition)).to.deep.equal([])
		})

		it('should return all Optionals that have an undefined value', () => {
			const condition = (_: Optional) => _.value === undefined
			const reader = new Reader(largeGraph())
			expect(reader.filter(Optional, condition)).to.deep.equal([new Model('opt-1', {}, Optional)])
		})
	})

	describe('first', () => {
		it('should return an empty array on an empty modal graph', () => {
			const empty = new Complex('')
			const condition = (_: Complex) => _.value === 'A'
			const reader = new Reader(new ModelGraph())
			expect(reader.first(Complex, condition, empty)).to.deep.equal(empty)
		})

		it('should return the first Optional that has a defined value greater than 1', () => {
			const condition = (_: Optional) => _.value !== undefined && _.value > 1
			const reader = new Reader(largeGraph())
			expect(reader.first(Optional, condition, new Optional()).value).to.equal(2)
		})
	})

	describe('instance', () => {
		it('should return undefined on an empty model graph', () => {
			expect(new Reader(new ModelGraph()).instance(Complex)).to.be.undefined
		})

		it('should return a model id when one exists', () => {
			expect(new Reader(connected2Graph()).instance(Simple)).to.not.be.undefined
		})

		it('should return undefined when none exist', () => {
			expect(new Reader(connected2Graph()).instance(Optional)).to.be.undefined
		})
	})

	describe('many', () => {
		it('should forward the call to the model graph', () => {
			const graph = connected4Graph()
			const reader = new Reader(graph)
			const result = reader.many(TestA, ['cpx-1', 'smp-1'])
			const expected = [relationships1_4()]

			expect(result).to.deep.equal(expected)
		})
		it('should forward the call to the model graph with mixed model types', () => {
			const graph = connected4Graph()
			const complex = graph.readModel<Complex>('cpx-1')
			const simple = graph.readModel<Simple>('smp-1')
			const reader = new Reader(graph)
			const result = reader.many(TestA, [complex, simple])
			const expected = [relationships1_4()]

			expect(result).to.deep.equal(expected)
		})
		it('should forward the call to the model graph for multiple values', () => {
			const graph = connected3Graph()
			const reader = new Reader(graph)
			const result = reader.many(TestA, ['smp-1'])
			const expected = [relationships1(), relationships1c()]

			expect(equal(result, expected)).to.be.true
		})
	})

	describe('manyAs', () => {
		it('should forward the call to the model graph', () => {
			const graph = connected4Graph()
			const reader = new Reader(graph)
			const result = reader.manyAs(TestA, ['cpx-1', 'smp-1'], Simple)
			const expected = [
				new Model('smp-1', {}, Simple),
				new Model('smp-2', {}, Simple),
				new Model('smp-3', {}, Simple)
			]

			expect(result).to.deep.equal(expected)
		})
		it('should forward the call to the model graph with mixed model types', () => {
			const graph = connected4Graph()
			const complex = graph.readModel<Complex>('cpx-1')
			const simple = graph.readModel<Simple>('smp-1')
			const reader = new Reader(graph)
			const result = reader.manyAs(TestA, [complex, simple], Simple)
			const expected = [
				new Model('smp-1', {}, Simple),
				new Model('smp-2', {}, Simple),
				new Model('smp-3', {}, Simple)
			]

			expect(result).to.deep.equal(expected)
		})
		it('should forward the call to the model graph for multiple values', () => {
			const graph = connected3Graph()
			const reader = new Reader(graph)
			const result = reader.manyAs(TestA, ['smp-1'], Complex)
			const expected = [
				new Model('cpx-1', {value: 'A'}, Complex),
				new Model('cpx-2', {value: 'B'}, Complex),
			]

			expect(equal(result, expected)).to.be.true
		})
	})

	describe('missing', () => {
		it('should return true on an empty modal graph', () => {
			const condition = (_: Complex) => _.value === 'A'
			const reader = new Reader(new ModelGraph())
			expect(reader.missing(Complex, condition)).to.be.true
		})

		it('should return false when a model exists that meets the condition', () => {
			const condition = (_: Optional) => _.value === undefined
			const reader = new Reader(largeGraph())
			expect(reader.missing(Optional, condition)).to.be.false
		})

		it('should return true when no model exists that meets the condition', () => {
			const condition = (_: Complex) => _.value === undefined
			const reader = new Reader(largeGraph())
			expect(reader.missing(Complex, condition)).to.be.true
		})

		it('should return true when no model exists', () => {
			const reader = new Reader(connected4Graph())
			expect(reader.missing(Optional)).to.be.true
		})

		it('should return false when a model exists', () => {
			const reader = new Reader(connected4Graph())
			expect(reader.missing(Complex)).to.be.false
		})
	})

	describe('none', () => {
		it('should return true for an empty model graph', () => {
			expect(new Reader(new ModelGraph()).none<TestA>(TestA, 'cpx-1')).to.be.true
		})

		it('should forward the call to the model graph', () => {
			expect(new Reader(connected2Graph()).none<TestA>(TestA, 'cpx-1')).to.be.false
		})

		it('should forward the call to the model graph with mixed model types', () => {
			const graph = connected2Graph()
			const complex = graph.readModel<Complex>('cmp-1')
			const simple = graph.readModel<Simple>('smp-1')
			const reader = new Reader(graph)

			expect(reader.none(TestA, [complex, simple])).to.be.false
		})
	})

	describe('one', () => {
		it('should forward the call to the model graph', () => {
			expect(new Reader(connected2Graph()).one(TestA, ['cpx-1'])).to.deep.equal(relationships1())
		})

		it('should forward the call to the model graph with mixed model types', () => {
			const graph = connected2Graph()
			const complex = graph.readModel<Complex>('cpx-1')
			const simple = graph.readModel<Simple>('smp-1')
			const reader = new Reader(graph)

			expect(reader.one(TestA, [complex, simple])).to.deep.equal(relationships1())
		})
	})

	describe('path', () => {
		it('should forward the call to the model graph', () => {
			expect(new Reader(connected2Graph()).path([TestA], ['cpx-1', 'smp-1'])).to.be.true
		})

		it('should return true when the given model id is undefined', () => {
			expect(new Reader(connected2Graph()).path([TestA], ['cpx-1', 'smp-1', undefined])).to.be.true
		})

		it('should forward the call to the model graph with mixed model types', () => {
			const graph = connected2Graph()
			const complex = graph.readModel<Complex>('cpx-1')
			const simple = graph.readModel<Simple>('smp-1')
			const reader = new Reader(graph)

			expect(reader.path([TestA], [complex, simple])).to.be.true
		})
	})

	describe('read', () => {
		it('should forward the call to the model graph', () => {
			expect(new Reader(singleComplexNodeGraph()).read('cpx-1')).to.deep.equal({value: 'A'})
		})

		it('should return undefined when an undefined model id is given', () => {
			expect(new Reader(singleComplexNodeGraph()).read(undefined)).to.be.undefined
		})
	})

	describe('readModel', () => {
		it('should forward the call to the model graph', () => {
			const expected = new Model('cpx-1', {value: 'A'}, Complex)
			const actual = new Reader(singleComplexNodeGraph()).readModel('cpx-1')

			expect(equal(expected, actual)).to.be.true
		})
		it('should return undefined when an undefined model id is given', () => {
			const expected = undefined
			const actual = new Reader(singleComplexNodeGraph()).readModel(undefined)

			expect(equal(expected, actual)).to.be.true
		})
		it('should return undefined when an unknown model id is given', () => {
			const expected = undefined
			const actual = new Reader(singleComplexNodeGraph()).readModel('cpx-2')

			expect(equal(expected, actual)).to.be.true
		})
	})

	describe('relationship', () => {
		it('should forward the call to the model graph', () => {
			expect(new Reader(connected2Graph()).relationship(1)).to.deep.equal(relationships1())
		})

		it('should return an empty relationship when an undefined model id is given', () => {
			expect(new Reader(connected2Graph()).relationship(undefined)).to.deep.equal(relationships0())
		})
	})

	describe('sum', () => {
		it('should return 0 on an empty modal graph', () => {
			const mapping = (_: Complex) => _.value === 'A' ? 2 : 3
			const reader = new Reader(new ModelGraph())
			expect(reader.sum(Complex, mapping)).to.equal(0)
		})

		it('should return the sum of the model properties', () => {
			const mapping = (_: Optional) => _.value ? _.value : 0
			const reader = new Reader(largeGraph())
			expect(reader.sum(Optional, mapping)).to.equal(6)
		})
	})

	describe('sumIf', () => {
		it('should return 0 on an empty modal graph', () => {
			const condition = (_: Complex) => _.value === 'A'
			const mapping = (_: Complex) => _.value === 'A' ? 2 : 3
			const reader = new Reader(new ModelGraph())
			expect(reader.sumIf(Complex, condition, mapping)).to.equal(0)
		})

		it('should return the sum of the models that meet the given condition', () => {
			const condition = (_: Optional) => _.value !== undefined
			const mapping = ( _: Optional) => _.value!
			const reader = new Reader(largeGraph())
			expect(reader.sumIf(Optional, condition, mapping)).to.equal(6)
		})
	})

	describe('type', () => {
		it('should return false on an empty model graph', () => {
			expect(new Reader(new ModelGraph()).type(Complex)).to.be.false
		})

		it('should return a model id when one exists', () => {
			expect(new Reader(connected2Graph()).type(Simple)).to.be.true
		})

		it('should return undefined when none exist', () => {
			expect(new Reader(connected2Graph()).type(Optional)).to.be.false
		})
	})
})