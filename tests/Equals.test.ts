import {expect} from 'chai'
import {describe} from 'mocha'
import {equal} from '../src/Equals'

describe('Equals', () => {
	it('should return true when no values are given', () => {
		const result = equal()
		expect(result).to.be.true
	})

	it('should return true when one value is given', () => {
		const result = equal(false)
		expect(result).to.be.true
	})

	it('should return true when both values are undefined', () => {
		const value1 = undefined
		const value2 = undefined
		const result = equal(value1, value2)
		expect(result).to.be.true
	})

	it('should return true when both values are null', () => {
		const value1 = null
		const value2 = null
		const result = equal(value1, value2)
		expect(result).to.be.true
	})

	it('should return true when both values are NaN', () => {
		const result = equal(NaN, NaN)
		expect(result).to.be.true
	})

	it('should return true when both values are true', () => {
		const value1 = true
		const value2 = true
		const result = equal(value1, value2)
		expect(result).to.be.true
	})

	it('should return true when both values are false', () => {
		const value1 = false
		const value2 = false
		const result = equal(value1, value2)
		expect(result).to.be.true
	})

	it('should return true when both values are 0', () => {
		const value1 = 0
		const value2 = 0
		const result = equal(value1, value2)
		expect(result).to.be.true
	})

	it('should return true when both values are 1', () => {
		const value1 = 1
		const value2 = 1
		const result = equal(value1, value2)
		expect(result).to.be.true
	})

	it('should return true when both values are -1', () => {
		const value1 = -1
		const value2 = -1
		const result = equal(value1, value2)
		expect(result).to.be.true
	})

	it('should return true when both values are floating point numbers with the same digits, in the same order', () => {
		const value1 = -1234.5678
		const value2 = -1234.5678
		const result = equal(value1, value2)
		expect(result).to.be.true
	})

	it('should return true when both values are the empty string', () => {
		const value1 = ''
		const value2 = ''
		const result = equal(value1, value2)
		expect(result).to.be.true
	})

	it('should return true when all values are strings with the same characters, in the same order', () => {
		const value1 = 'AVeryLongSentenceIsTheBestWayToCheckEqualityOfStrings'
		const value2 = 'AVeryLongSentenceIsTheBestWayToCheckEqualityOfStrings'
		const value3 = 'AVeryLongSentenceIsTheBestWayToCheckEqualityOfStrings'
		const result = equal(value1, value2, value3)
		expect(result).to.be.true
	})

	it('should return true when both values are regular expressions with the pattern and the same flags', () => {
		const value1 = new RegExp('abc', 'i')
		const value2 = new RegExp('abc', 'i')
		const result = equal(value1, value2)
		expect(result).to.be.true
	})

	it('should return true when both values are empty arrays', () => {
		const result = equal([], [])
		expect(result).to.be.true
	})

	it('should return true when all values are arrays with the same elements, in the same order', () => {
		const value1 = [1,2,3,4,5,6]
		const value2 = [1,2,3,4,5,6]
		const value3 = [1,2,3,4,5,6]
		const result = equal(value1, value2, value3)
		expect(result).to.be.true
	})

	it('should return true when both values are empty objects', () => {
		const value1 = {}
		const value2 = {}
		const result = equal(value1, value2)
		expect(result).to.be.true
	})

	it('should return true when both values are objects with the same key value pairs', () => {
		const value1 = {a: 1, b: 2, c: 3}
		const value2 = {a: 1, b: 2, c: 3}
		const result = equal(value1, value2)
		expect(result).to.be.true
	})

	it('should return true when both values are objects with the same key value pairs in different orders', () => {
		const value1 = {a: 1, b: 2, c: 3}
		const value2 = {a: 1, c: 3, b: 2}
		const result = equal(value1, value2)
		expect(result).to.be.true
	})

	it('should return true when both values are objects with the same valueOf output', () => {
		function Test(n: number) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			this.number = n
		}

		Test.prototype.valueOf = function() {
			return this.number
		}

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const value1 = new Test(4)

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const value2 = new Test(4)

		const result = equal(value1, value2)
		expect(result).to.be.true
	})

	it('should return true when both values are objects with the same toString output', () => {
		function Test(n: number) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			this.number = n
		}

		Test.prototype.toString = function() {
			return `${this.number}`
		}

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const value1 = new Test(4)

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const value2 = new Test(4)

		const result = equal(value1, value2)
		expect(result).to.be.true
	})

	it('should return true when both values are empty Sets', () => {
		const value1 = new Set<never>()
		const value2 = new Set<never>()
		const result = equal(value1, value2)
		expect(result).to.be.true
	})

	it('should return true when both values are the same Set', () => {
		const value1 = new Set<number>([1,2,3])
		const value2 = new Set<number>([1,2,3])
		const result = equal(value1, value2)
		expect(result).to.be.true
	})

	it('should return true when both values are the same Set with different orders', () => {
		const value1 = new Set<number>([1,2,3])
		const value2 = new Set<number>([2,1,3])
		const result = equal(value1, value2)
		expect(result).to.be.true
	})

	it('should return true when both values are empty Maps', () => {
		const value1 = new Map<never, never>()
		const value2 = new Map<never, never>()
		const result = equal(value1, value2)
		expect(result).to.be.true
	})

	it('should return true when both values are Map with the same key value pairs', () => {
		const value1 = new Map<number, string>([[1, 'a'], [2, 'b'], [3, 'c']])
		const value2 = new Map<number, string>([[1, 'a'], [2, 'b'], [3, 'c']])
		const result = equal(value1, value2)
		expect(result).to.be.true
	})

	it('should return false when both values are empty functions', () => {
		/*
            General Functional Equality is undecidable - Rice Theorem
            Take 2 functions and run them for every value (could be infinite and will never halt)

            For Practical Notes see:
            https://stackoverflow.com/a/21680065
         */

		// eslint-disable-next-line @typescript-eslint/no-empty-function
		const value1 = () => {}
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		const value2 = () => {}
		const result = equal(value1, value2)
		expect(result).to.be.false
	})

	it('should return false when comparing an empty Map and empty Set', () => {
		const value1 = new Map<never, never>()
		const value2 = new Set<never>()
		const result = equal(value1, value2)
		expect(result).to.be.false
	})

	it('should return false when comparing an empty Array and an object', () => {
		const result = equal([], {})
		expect(result).to.be.false
	})

	it('should return false when two maps have different keys', () => {
		const value1 = new Map<number, string>([[1, 'a'], [2, 'b'], [3, 'c']])
		const value2 = new Map<number, string>([[1, 'a'], [2, 'b']])
		const result = equal(value1, value2)
		expect(result).to.be.false
	})

	it('should return false when two maps have different values', () => {
		const value1 = new Map<number, string>([[1, 'a'], [2, 'b'], [3, 'c']])
		const value2 = new Map<number, string>([[1, 'a'], [2, 'b'], [3, 'd']])
		const result = equal(value1, value2)
		expect(result).to.be.false
	})

	it('should return false when one array is longer than the other', () => {
		const value1 = [1,2,3,4,5,6]
		const value2 = [1,2,3,4,5]
		const result = equal(value1, value2)
		expect(result).to.be.false
	})

	it('should return false when the order of the elements in an array differ', () => {
		const value1 = [1,2,3,4,5,6]
		const value2 = [1,2,3,4,6,5]
		const result = equal(value1, value2)
		expect(result).to.be.false
	})

	it('should return false when some objects have different keys', () => {
		const value1 = {a: 1, b: 2, c: 3}
		const value2 = {a: 1, b: 2, c: 3}
		const value3 = {a: 1, b: 2, d: 3}
		const result = equal(value1, value2, value3)
		expect(result).to.be.false
	})

	it('should return false when some objects have different values', () => {
		const value1 = {a: 1, b: 2, c: 3}
		const value2 = {a: 1, b: 2, c: 3}
		const value3 = {a: 1, b: 2, c: 4}
		const result = equal(value1, value2, value3)
		expect(result).to.be.false
	})
})