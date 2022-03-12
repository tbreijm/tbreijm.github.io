import { expect } from 'chai'
import { describe } from 'mocha'
import {diff, max, mean, median, min, percentile, standardDeviation, sum, sumIf} from '../../src/analysis/Aggregation'
import { equal } from '../../src/Equals'
import {Aggregations} from '../../src/analysis'
import {ModelProperties} from '../../src/modelgraph'

const {countIf, count} = Aggregations

type Point = ModelProperties & {
	'x': number
	'y': number
}

const data: Point[] = [
	{x: 1, y: 1},
	{x: 2, y: 4},
	{x: 3, y: 9},
	{x: 4, y: 16},
	{x: 5, y: 25},
	{x: 6, y: 36},
	{x: 7, y: 49},
	{x: 8, y: 64},
]

const emptyData: Point[] = []

describe('Aggregation Analysis', () => {
	describe('countIf', () => {
		it('should return 0 for empty data set', () => {
			const expected = 0
			const actual = countIf(_ => (_ as Point).x % 2 === 0)(emptyData, _ => (_ as Point).x)
			expect(equal(expected, actual)).to.be.true
		})
		it('should return the count of all points with an even x value for the data set', () => {
			const expected = 4
			const actual = countIf(_ => (_ as Point).x % 2 === 0)(data, _ => (_ as Point).x)
			expect(equal(expected, actual)).to.be.true
		})
	})
	describe('count', () => {
		it('should return 0 for empty data set', () => {
			const expected = 0
			const actual = count(emptyData, _ => (_ as Point).x)
			expect(equal(expected, actual)).to.be.true
		})
		it('should return n for a data set of size n', () => {
			const expected = 8
			const actual = count(data, _ => (_ as Point).x)
			expect(equal(expected, actual)).to.be.true
		})
	})
	describe('diff', () => {
		it('should return 0 for empty data set', () => {
			const expected = 0
			const actual = diff(emptyData, _ => (_ as Point).y)
			expect(equal(expected, actual)).to.be.true
		})
		it('should return 0 for a data set with one value', () => {
			const expected = 0
			const actual = diff([{x: 1, y: 1},], _ => (_ as Point).y)
			expect(equal(expected, actual)).to.be.true
		})
		it('should return the difference between two data points', () => {
			const expected = 3
			const actual = diff([{x: 1, y: 1}, {x: 2, y: 4},], _ => (_ as Point).y)
			expect(equal(expected, actual)).to.be.true
		})
		it('should return the difference between the first two data points', () => {
			const expected = 3
			const actual = diff(data, _ => (_ as Point).y)
			expect(equal(expected, actual)).to.be.true
		})
	})
	describe('max', () => {
		it('should return 0 for empty data set', () => {
			const expected = 0
			const actual = max(emptyData, _ => (_ as Point).x)
			expect(equal(expected, actual)).to.be.true
		})
		it('should return the min x value for the data set', () => {
			const expected = 8
			const actual = max(data, _ => (_ as Point).x)
			expect(equal(expected, actual)).to.be.true
		})
	})
	describe('mean', () => {
		it('should return 0 for empty data set', () => {
			const expected = 0
			const actual = mean(emptyData, _ => (_ as Point).x)
			expect(equal(expected, actual)).to.be.true
		})
		it('should return the mean x value for the data set', () => {
			const expected = 4.5
			const actual = mean(data, _ => (_ as Point).x)
			expect(equal(expected, actual)).to.be.true
		})
	})
	describe('median', () => {
		it('should return 0 for empty data set', () => {
			const expected = 0
			const actual = median(emptyData, _ => (_ as Point).y)
			expect(equal(expected, actual)).to.be.true
		})
		it('should return the median y value for the data set', () => {
			const expected = 20.5
			const actual = median(data, _ => (_ as Point).y)
			expect(equal(expected, actual)).to.be.true
		})
	})
	describe('min', () => {
		it('should return 0 for empty data set', () => {
			const expected = 0
			const actual = min(emptyData, _ => (_ as Point).x)
			expect(equal(expected, actual)).to.be.true
		})
		it('should return the min x value for the data set', () => {
			const expected = 1
			const actual = min(data, _ => (_ as Point).x)
			expect(equal(expected, actual)).to.be.true
		})
	})
	describe('percentile', () => {
		it('should return 0 for empty data set', () => {
			const expected = 0
			const actual = percentile(0.5)(emptyData, _ => (_ as Point).y)
			expect(equal(expected, actual)).to.be.true
		})
		it('should return the 10th percentile y value for a data set of size 1', () => {
			const expected = 1
			const actual = percentile(0.1)([{x: 1, y: 1},], _ => (_ as Point).y)
			expect(equal(expected, actual)).to.be.true
		})
		it('should return the 90th percentile y value for a data set of size 1', () => {
			const expected = 1
			const actual = percentile(0.9)([{x: 1, y: 1},], _ => (_ as Point).y)
			expect(equal(expected, actual)).to.be.true
		})
		it('should return the 100th percentile y value for a data set of size 1', () => {
			const expected = 1
			const actual = percentile(1)([{x: 1, y: 1},], _ => (_ as Point).y)
			expect(equal(expected, actual)).to.be.true
		})
		it('should return the 10th percentile y value for the data set', () => {
			const expected = 3.1
			const actual = percentile(0.1)(data, _ => (_ as Point).y)
			expect(equal(expected, actual)).to.be.true
		})
		it('should return the median y value for the data set', () => {
			const expected = 20.5
			const actual = percentile(0.5)(data, _ => (_ as Point).y)
			expect(equal(expected, actual)).to.be.true
		})
		it('should return the 90th percentile y value for the data set', () => {
			const expected = 53.5
			const actual = percentile(0.9)(data, _ => (_ as Point).y)
			expect(equal(expected, actual)).to.be.true
		})
		it('should return the 100th percentile y value for the data set', () => {
			const expected = 64
			const actual = percentile(1)(data, _ => (_ as Point).y)
			expect(equal(expected, actual)).to.be.true
		})
	})
	describe('standardDeviation', () => {
		it('should return 0 for empty data set', () => {
			const expected = 0
			const actual = standardDeviation(emptyData, _ => (_ as Point).y)
			expect(equal(expected, actual)).to.be.true
		})
		it('should return the standard deviation of the y value for the data set', () => {
			const expected = 22.58317958127243
			const actual = standardDeviation(data, _ => (_ as Point).y)
			expect(equal(expected, actual)).to.be.true
		})
	})
	describe('sumIf', () => {
		it('should return 0 for empty data set', () => {
			const expected = 0
			const actual = sumIf(_ => (_ as Point).x % 2 === 0)(emptyData, _ => (_ as Point).y)
			expect(equal(expected, actual)).to.be.true
		})
		it('should return the sum of all the y values for points with an even x value in the data set', () => {
			const expected = 120
			const actual = sumIf(_ => (_ as Point).x % 2 === 0)(data, _ => (_ as Point).y)
			expect(equal(expected, actual)).to.be.true
		})
	})
	describe('sum', () => {
		it('should return 0 for empty data set', () => {
			const expected = 0
			const actual = sum(emptyData, _ => (_ as Point).y)
			expect(equal(expected, actual)).to.be.true
		})
		it('should return the sum of all the y values for points in the data set', () => {
			const expected = 204
			const actual = sum(data, _ => (_ as Point).y)
			expect(equal(expected, actual)).to.be.true
		})
	})
})