import { expect } from 'chai'
import { describe } from 'mocha'
import { SetOperations as Operations } from '../../src/math'
import { emptySet, nonEmptySet3, nonEmptySet5 } from './Set.values'
import { equal } from '../../src/Equals'

describe('Set Operations', () => {
	describe('clone', () => {
		it('should return an empty set for an empty set', () => {
			const set1 = Operations.clone(emptySet())
			const set2 = new Set<number>()
			expect(equal(set1, set2)).to.be.true
		})

		it('should return a set with the same items as the input set', () => {
			const set1 = Operations.clone(nonEmptySet3())
			const set2 = new Set<number>([1,2,3])
			expect(equal(set1, set2)).to.be.true
		})
	})

	describe('insert', () => {
		it('should return a set with an item for an empty set', () => {
			const set1 = Operations.insert(emptySet(), 1)
			const set2 = new Set<number>([1])
			expect(equal(set1, set2)).to.be.true
		})

		it('should return a set with the same items as the input set when the item is present', () => {
			const set1 = Operations.insert(nonEmptySet3(), 1)
			const set2 = new Set<number>([1,2,3])
			expect(equal(set1, set2)).to.be.true
		})

		it('should return a set with the new item when the item is not present', () => {
			const set1 = Operations.insert(nonEmptySet3(), 4)
			const set2 = new Set<number>([1,2,3,4])
			expect(equal(set1, set2)).to.be.true
		})
	})

	describe('remove', () => {
		it('should return an empty set for an empty set', () => {
			const set1 = Operations.remove(emptySet(), 1)
			const set2 = new Set<number>([])
			expect(equal(set1, set2)).to.be.true
		})

		it('should return a set with the same items as the input set when the item is not present', () => {
			const set1 = Operations.remove(nonEmptySet3(), 4)
			const set2 = new Set<number>([1,2,3])
			expect(equal(set1, set2)).to.be.true
		})

		it('should return a set without the item when the item is present', () => {
			const set1 = Operations.remove(nonEmptySet3(), 1)
			const set2 = new Set<number>([2,3])
			expect(equal(set1, set2)).to.be.true
		})
	})

	describe('replace', () => {
		it('should return an empty set for an empty set', () => {
			const set1 = Operations.replace(emptySet(), 1, 4)
			const set2 = new Set<number>([])
			expect(equal(set1, set2)).to.be.true
		})

		it('should return a set with the same items as the input set when the item is not present', () => {
			const set1 = Operations.replace(nonEmptySet3(), 4, 1)
			const set2 = new Set<number>([1,2,3])
			expect(equal(set1, set2)).to.be.true
		})

		it('should return a set with the replacement item when the item is present', () => {
			const set1 = Operations.replace(nonEmptySet3(), 1, 4)
			const set2 = new Set<number>([2,3,4])
			expect(equal(set1, set2)).to.be.true
		})

		it('should return a set with the replacement item when the item is present', () => {
			const set1 = Operations.replace(nonEmptySet3(), 1, 4)
			const set2 = new Set<number>([2,3,4])
			expect(equal(set1, set2)).to.be.true
		})
	})

	describe('union', () => {
		it('should return an empty set for a union of empty sets', () => {
			const set1 = Operations.union(emptySet(), emptySet())
			const set2 = new Set<number>([])
			expect(equal(set1, set2)).to.be.true
		})

		it('should return the same set if the other is empty', () => {
			const set1 = Operations.union(nonEmptySet3(), emptySet())
			const set2 = new Set<number>([1,2,3])
			expect(equal(set1, set2)).to.be.true
		})

		it('should return the set if the union is with itself', () => {
			const set1 = Operations.union(nonEmptySet3(), nonEmptySet3())
			const set2 = new Set<number>([1,2,3])
			expect(equal(set1, set2)).to.be.true
		})

		it('should return the set of elements in both sets', () => {
			const set1 = Operations.union(nonEmptySet3(), nonEmptySet5())
			const set2 = new Set<number>([1,2,3,4,5])
			expect(equal(set1, set2)).to.be.true
		})
	})
})