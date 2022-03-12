import { expect } from 'chai'
import { describe } from 'mocha'
import { MapOperations as Operations } from '../../src/math'
import { emptyMap, nonEmptyMap3, nonEmptyMap3A, nonEmptyMap4, nonEmptyMap5 } from './Map.values'
import { equal } from '../../src/Equals'

describe('Map Operations', () => {
	describe('clone', () => {
		it('should return an empty map for an empty map', () => {
			const map1 = Operations.clone(emptyMap())
			const map2 = new Map<string, number>()
			expect(equal(map1, map2)).to.be.true
		})

		it('should return a map with the same items as the input map', () => {
			const map1 = Operations.clone(nonEmptyMap3())
			const map2 = nonEmptyMap3()
			expect(equal(map1, map2)).to.be.true
		})
	})

	describe('insert', () => {
		it('should return a set with an item for an empty set', () => {
			const map1 = Operations.insert(emptyMap(), 'A', 1)
			const map2 = new Map<string, number>([['A', 1]])
			expect(equal(map1, map2)).to.be.true
		})

		it('should return a set with the same items as the input set when the item is present', () => {
			const map1 = Operations.insert(nonEmptyMap3(), 'A', 1)
			const map2 = nonEmptyMap3()
			expect(equal(map1, map2)).to.be.true
		})

		it('should return a set with updated items when the key is present but value is different', () => {
			const map1 = Operations.insert(nonEmptyMap3(), 'A', 4)
			const map2 = nonEmptyMap3A()
			expect(equal(map1, map2)).to.be.true
		})

		it('should return a set with the new item when the item is not present', () => {
			const map1 = Operations.insert(nonEmptyMap3(), 'D', 4)
			const map2 = nonEmptyMap4()
			expect(equal(map1, map2)).to.be.true
		})
	})

	describe('remove', () => {
		it('should return an empty set for an empty set', () => {
			const map1 = Operations.remove(emptyMap(), 'A')
			const map2 = new Map<string, number>()
			expect(equal(map1, map2)).to.be.true
		})

		it('should return a set with the same items as the input set when the item is not present', () => {
			const map1 = Operations.remove(nonEmptyMap3(), 'D')
			const map2 = nonEmptyMap3()
			expect(equal(map1, map2)).to.be.true
		})

		it('should return a set without the item when the item is present', () => {
			const map1 = Operations.remove(nonEmptyMap5(), 'E')
			const map2 = nonEmptyMap4()
			expect(equal(map1, map2)).to.be.true
		})
	})

	describe('union', () => {
		it('should return an empty set for a union of empty sets', () => {
			const map1 = Operations.union(emptyMap(), emptyMap())
			const map2 = new Map<string, number>()
			expect(equal(map1, map2)).to.be.true
		})

		it('should return the same set if the other is empty', () => {
			const map1 = Operations.union(nonEmptyMap3(), emptyMap())
			const map2 = nonEmptyMap3()
			expect(equal(map1, map2)).to.be.true
		})

		it('should return the set if the union is with itself', () => {
			const map1 = Operations.union(nonEmptyMap3(), nonEmptyMap3())
			const map2 = nonEmptyMap3()
			expect(equal(map1, map2)).to.be.true
		})

		it('should return the set of elements in both sets', () => {
			const map1 = Operations.union(nonEmptyMap3(), nonEmptyMap5())
			const map2 = nonEmptyMap5()
			expect(equal(map1, map2)).to.be.true
		})

		it(`should return the set of elements in both sets with second value 
      in case of matching keys and different values`, () => {
			const map1 = Operations.union(nonEmptyMap3(), nonEmptyMap3A())
			const map2 = nonEmptyMap3A()
			expect(equal(map1, map2)).to.be.true
		})
	})
})