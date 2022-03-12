import { expect } from 'chai'
import { describe } from 'mocha'
import { equal } from '../../src/Equals'
import {Mappings} from '../../src/analysis'
import {ModelProperties} from '../../src/modelgraph'

const {evaluate} = Mappings

const data: ModelProperties[] = [
	{x: 1, y: 1},
	{x: 2, y: 4},
	{x: 3, y: 9},
	{x: 4, y: 16},
	{x: 5, y: 25},
	{x: 6, y: 36},
	{x: 7, y: 49},
	{x: 8, y: 64},
]

const emptyData: ModelProperties[] = []

describe('Mapping Analysis', () => {
	describe('evaluate', () => {
		it('should evaluate an empty data set', () => {
			const expected: number[] = []
			const actual = evaluate('2x+y', _ => ({x: Number(_.x), y: Number(_.y)}))(emptyData)
			expect(equal(expected, actual)).to.be.true
		})
		it('should evaluate a given data set', () => {
			const expected: number[] = [3, 8, 15, 24, 35, 48, 63, 80]
			const actual = evaluate('2x+y', _ => ({x: Number(_.x), y: Number(_.y)}))(data)
			expect(equal(expected, actual)).to.be.true
		})
	})
})