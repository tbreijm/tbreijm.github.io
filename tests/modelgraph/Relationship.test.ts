import { expect } from 'chai'
import { describe } from 'mocha'
import { relationships0a, relationships1, relationships1_array } from './ModelGraph.values'
import { Complex, Simple } from './Model.values'
import { Model } from '../../src/modelgraph'

describe('Relationship', () => {
	describe('model', () => {
		it('should return undefined on an empty relationship without fallback', () => {
			expect(relationships0a().model(Simple)).to.be.undefined
		})

		it('should return the fallback value as a model', () => {
			expect(relationships0a().model(Complex, {value: 'A'})).to.deep.equal(
				new Model('undefined-1', {value: 'A'}, Complex)
			)
		})

		it('should return the first element of the model array', () => {
			expect(relationships1_array().model(Complex)).to.deep.equal(
				new Model('cpx-1', {value: 'A'}, Complex)
			)
		})

		it('should return the model', () => {
			expect(relationships1().model(Complex)).to.deep.equal(
				new Model('cpx-1', {value: 'A'}, Complex)
			)
		})
	})

	describe('models', () => {
		it('should return an empty array on an empty relationship without fallback', () => {
			expect(relationships0a().models(Simple)).to.deep.equal([])
		})

		it('should return all elements of the model array', () => {
			expect(relationships1_array().models(Complex)).to.deep.equal([
				new Model('cpx-1', {value: 'A'}, Complex),
				new Model('cpx-2', {value: 'B'}, Complex),
			])
		})

		it('should return the model as an array', () => {
			expect(relationships1().models(Complex)).to.deep.equal([
				new Model('cpx-1', {value: 'A'}, Complex)
			])
		})
	})
})