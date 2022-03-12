import { expect } from 'chai'
import { describe } from 'mocha'
import { emptyStore } from './RelationshipStore.values'
import { RelationshipStore } from '../../src/modelgraph'

describe('RelationshipStore', () => {
	describe('all', () => {
		it('should return an empty array when the store is empty', () => {
			expect(emptyStore().all()).to.deep.equal([])
		})
	})

	describe('any', () => {
		it('should return false when the store is empty', () => {
			expect(emptyStore().any()).to.be.false
		})

		it('should return true when the store has relationships', () => {
			const store = emptyStore()
			store.start(1)
			expect(store.any()).to.be.true
		})
	})

	describe('end', () => {
		it('should return false when the store is empty', () => {
			expect(emptyStore().end(1)).to.be.false
		})

		it('should return true when the relationship is in the store ', () => {
			const store = emptyStore()
			store.start(1)
			expect(store.end(1)).to.be.true
		})

		it('should remove the relationship from the store ', () => {
			const store = emptyStore()
			store.start(1)
			store.end(1)
			expect(store.missing(1)).to.be.true
		})
	})

	describe('endAll', () => {
		it('should return false when the store is empty', () => {
			expect(emptyStore().endAll([1,2])).to.be.false
		})
	})

	describe('has', () => {
		it('should return false when the store is empty', () => {
			expect(emptyStore().has(1)).to.be.false
		})
	})

	describe('missing', () => {
		it('should return true when the store is empty', () => {
			expect(emptyStore().missing(1)).to.be.true
		})
	})

	describe('start', () => {
		it('should return true when the store is empty', () => {
			expect(emptyStore().start(1)).to.be.true
		})

		it('should add the relationship to the store', () => {
			const store = emptyStore()
			store.start(1)
			expect(store.has(1)).to.be.true
		})

		it('should return false when the relationship is already in the store', () => {
			const store = emptyStore()
			store.start(1)
			expect(store.start(1)).to.be.false
		})
	})

	describe('serialise', () => {
		it('should serialise an empty store', () => {
			const expected = {'edges':[]}
			expect(emptyStore().serialise()).to.deep.equal(expected)
		})

		it('should serialise a store', () => {
			const expected = {'edges':[1,2,3]}
			const store = emptyStore()
			store.start(1)
			store.start(2)
			store.start(3)
			expect(store.serialise()).to.deep.equal(expected)
		})
	})

	describe('deserialise', () => {
		it('should deserialise an empty store', () => {
			const data = {'edges':[]}
			expect(RelationshipStore.deserialise(data)).to.deep.equal(emptyStore())
		})

		it('should deserialise a store', () => {
			const data = {'edges':[1,2,3]}
			const store = emptyStore()
			store.start(1)
			store.start(2)
			store.start(3)
			expect(RelationshipStore.deserialise(data)).to.deep.equal(store)
		})
	})
})