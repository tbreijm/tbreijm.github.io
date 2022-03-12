import {equal} from '../../src/Equals'
import { describe } from 'mocha'
import { expect } from 'chai'
import { Differ } from '../../src/datagraph'
import { emptyDiff } from './Differ.values'
import {ModelGraph, ModelProperties} from '../../src/modelgraph'
import {
	connected2Graph, connected4Graph,
	dualConnected2Graph, largeGraph,
	singleComplexNodeGraph,
	singleSimpleNodeGraph
} from '../modelgraph/ModelGraph.values'
import { Complex, Optional, Simple } from '../modelgraph/Model.values'
import { TestA, TestB } from '../modelgraph/Relationship.values'
import { ModelType } from '../../src/modelgraph'

describe('Differ', () => {
	describe('diff', () => {
		it('should produce no differences for two empty graphs', () => {
			const differ = new Differ(new ModelGraph())
			expect(differ.diff(new ModelGraph())).to.deep.equal(emptyDiff())
		})

		it('should produce model type differences', () => {
			const result = new Differ(new ModelGraph()).diff(
				singleSimpleNodeGraph()
			)
			expect(result).to.deep.equal({
				models: {
					types: {
						mine: new Set([]),
						their: new Set([Simple])
					},
					entities: new Map()
				},
				relationships: {
					types: {
						mine: new Set(),
						their: new Set()
					},
					entities: new Map()
				}
			})
		})

		it('should produce model type differences', () => {
			const result = new Differ(singleComplexNodeGraph()).diff(
				singleSimpleNodeGraph()
			)
			expect(result).to.deep.equal({
				models: {
					types: {
						mine: new Set([Complex]),
						their: new Set([Simple])
					},
					entities: new Map()
				},
				relationships: {
					types: {
						mine: new Set(),
						their: new Set()
					},
					entities: new Map()
				}
			})
		})

		it('should produce no differences for two equal simple graphs', () => {
			const result = new Differ(singleComplexNodeGraph()).diff(
				singleComplexNodeGraph()
			)
			expect(result).to.deep.equal(emptyDiff())
		})

		it('should produce relationship type differences', () => {
			const result = new Differ(connected2Graph()).diff(
				dualConnected2Graph()
			)
			expect(result).to.deep.equal({
				models: {
					types: {
						mine: new Set([]),
						their: new Set([])
					},
					entities: new Map()
				},
				relationships: {
					types: {
						mine: new Set([]),
						their: new Set([TestB])
					},
					entities: new Map()
				}
			})
		})

		it('should produce relationship entity differences', () => {
			const result = new Differ(connected2Graph()).diff(
				connected4Graph()
			)

			const expected = {
				models: {
					types: {
						mine: new Set([]),
						their: new Set([])
					},
					entities: new Map([
						[Simple, {
							mine: new Set(),
							their: new Set(['smp-2', 'smp-3']),
							changed: new Set()
						}]
					])
				},
				relationships: {
					types: {
						mine: new Set([]),
						their: new Set([])
					},
					entities: new Map([
						[TestA, {
							mine: new Set([1]),
							their: new Set([1])
						}]
					])
				}
			}

			expect(equal(expected, result)).to.be.true
		})

		it('should produce differences', () => {
			const result = new Differ(connected2Graph()).diff(
				largeGraph()
			)
			expect(result).to.deep.equal({
				models: {
					types: {
						mine: new Set([]),
						their: new Set([Optional])
					},
					entities: new Map<ModelType<ModelProperties>, Record<string, Set<string>>>([
						[Complex, {
							mine: new Set(),
							their: new Set(['cpx-2']),
							changed: new Set()
						}],
						[Simple, {
							mine: new Set([]),
							their: new Set(['smp-2']),
							changed: new Set()
						}]
					])
				},
				relationships: {
					types: {
						mine: new Set([TestA]),
						their: new Set([])
					},
					entities: new Map([])
				}
			})
		})
	})
})