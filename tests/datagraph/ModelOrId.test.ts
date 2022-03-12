import { sanitise, sanitiseAll, server } from '../../src/datagraph'
import { expect } from 'chai'
import { Model } from '../../src/modelgraph'
import { Simple } from '../modelgraph/Model.values'

describe('ModelOrId', () => {
	describe('sanitise', () => {
		it('should return undefined when an undefined model id is passed', () => {
			expect(sanitise(undefined)).to.be.undefined
		})

		it('should return an id if a model is given', () => {
			expect(sanitise(new Model('smp-1', {}, Simple))).to.equal('smp-1')
		})

		it('should return a string if a string is given', () => {
			expect(sanitise('mod-109')).to.equal('mod-109')
		})
	})

	describe('sanitiseAll', () => {
		it('should return an empty array when an undefined model id is passed', () => {
			expect(sanitiseAll(undefined)).to.deep.equal([])
		})

		it('should return an empty array when an array of undefined is passed', () => {
			expect(sanitiseAll([undefined, undefined, undefined])).to.deep.equal([])
		})

		it('should return an empty array when an empty array is passed', () => {
			expect(sanitiseAll([])).to.deep.equal([])
		})

		it('should return an array when a single number is passed', () => {
			expect(sanitiseAll('mod-109')).to.deep.equal(['mod-109'])
		})

		it('should return an array when a single number is passed', () => {
			expect(sanitiseAll(new Model('smp-1', {}, Simple))).to.deep.equal(['smp-1'])
		})

		it('should return an array when a number array is passed', () => {
			expect(sanitiseAll(['mod-1', 'mod-2', 'mod-3', 'mod-109'])).to.deep.equal(['mod-1', 'mod-2', 'mod-3', 'mod-109'])
		})

		it('should return an array when a model array is passed', () => {
			const models = [
				new Model('smp-1', {}, Simple),
				new Model('smp-2', {}, Simple),
				new Model('smp-3', {}, Simple)
			]

			expect(sanitiseAll(models)).to.deep.equal(['smp-1', 'smp-2', 'smp-3'])
		})

		it('should return an array when a mixed array is passed', () => {
			const models = [
				new Model('smp-1', {}, Simple),
				new Model('smp-2', {}, Simple),
				new Model('smp-3', {}, Simple),
				undefined,
				undefined,
				'mod-109',
				undefined
			]

			expect(sanitiseAll(models)).to.deep.equal(['smp-1', 'smp-2', 'smp-3', 'mod-109'])
		})
	})

	describe('server', () => {
		it('should return undefined when an undefined model id is passed', () => {
			expect(server(undefined)).to.be.undefined
		})

		it('should return undefined if the id does not contain a dash', () => {
			expect(server('1234567')).to.be.undefined
		})

		it('should return undefined if the id contains a negative number', () => {
			expect(server('model--1')).to.be.undefined
		})

		it('should return undefined the numeric part of a model id', () => {
			expect(server('model-123')).to.equal(123)
		})
	})
})