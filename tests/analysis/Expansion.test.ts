import { expect } from 'chai'
import { describe } from 'mocha'
import { equal } from '../../src/Equals'
import {Expansions} from '../../src/analysis'
import {ModelProperties} from '../../src/modelgraph'

const {series} = Expansions

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

describe('Expansion Analysis', () => {
	describe('series', () => {
		it('should create an empty series from an empty data set', () => {
			const expected: ModelProperties[][] = []
			const actual = series(0)(emptyData)
			expect(equal(expected, actual)).to.be.true
		})
		it('should create a n*1 series when look back is 0', () => {
			const expected: ModelProperties[][] = [
				[{x: 1, y: 1},],
				[{x: 2, y: 4},],
				[{x: 3, y: 9},],
				[{x: 4, y: 16},],
				[{x: 5, y: 25},],
				[{x: 6, y: 36},],
				[{x: 7, y: 49},],
				[{x: 8, y: 64},],
			]
			const actual = series(0)(data)
			expect(equal(expected, actual)).to.be.true
		})
		it('should create a 1*n series when look back is equal to the size of the data set', () => {
			const expected: ModelProperties[][] = [
				[
					{x: 1, y: 1},
					{x: 2, y: 4},
					{x: 3, y: 9},
					{x: 4, y: 16},
					{x: 5, y: 25},
					{x: 6, y: 36},
					{x: 7, y: 49},
					{x: 8, y: 64},
				]
			]
			const actual = series(8)(data)
			expect(equal(expected, actual)).to.be.true
		})
		it('should create a m*n series when look back is less than the size of the data set and greater than 0', () => {
			const expected: ModelProperties[][] = [
				[{x: 1, y: 1},{x: 2, y: 4},{x: 3, y: 9},],
				[{x: 2, y: 4},{x: 3, y: 9},{x: 4, y: 16},],
				[{x: 3, y: 9},{x: 4, y: 16},{x: 5, y: 25},],
				[{x: 4, y: 16},{x: 5, y: 25},{x: 6, y: 36},],
				[{x: 5, y: 25},{x: 6, y: 36},{x: 7, y: 49},],
				[{x: 6, y: 36},{x: 7, y: 49},{x: 8, y: 64},],
			]
			const actual = series(2)(data)
			expect(equal(expected, actual)).to.be.true
		})
	})
})