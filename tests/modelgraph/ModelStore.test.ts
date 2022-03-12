import { expect } from 'chai'
import { describe } from 'mocha'
import { emptyComplexStore, emptyStore, Optional, Simple } from './Model.values'
import { Model, ModelStore } from '../../src/modelgraph'
import { manifest } from './Models.values'

describe('ModelStore', () => {
	describe('all', () => {
		it('should return an empty array if the store is empty', () => {
			expect(emptyStore().all()).to.deep.equal([])
		})

		it('should return an array of models when the store is not empty', () => {
			const store = emptyStore()
			const model = new Model('smp-1', {}, Simple)
			store.insertOrUpdate('smp-1', {})
			expect(store.all()).to.deep.equal([model])
		})
	})

	describe('any', () => {
		it('should return an empty array if the store is empty', () => {
			expect(emptyStore().any()).to.be.false
		})

		it('should return an array of models when the store is not empty', () => {
			const store = emptyStore()
			store.insertOrUpdate('smp-1', {})
			expect(store.any()).to.be.true
		})
	})

	describe('delete', () => {
		it('should return false when the store is empty', () => {
			expect(emptyStore().delete('smp-1')).to.be.false
		})

		it('should return true when the store has the model', () => {
			const store = emptyStore()
			store.insertOrUpdate('smp-1', {})
			expect(store.delete('smp-1')).to.be.true
		})

		it('should remove the model from the store', () => {
			const store = emptyStore()
			store.insertOrUpdate('smp-1', {})
			store.delete('smp-1')
			expect(store.missing('smp-1')).to.be.true
		})

		it('should remove only the given model from the store', () => {
			const store = emptyStore()
			store.insertOrUpdate('smp-1', {})
			store.insertOrUpdate('smp-2', {})
			store.delete('smp-1')
			expect(store.missing('smp-1')).to.be.true
			expect(store.has('smp-2')).to.be.true
		})

		it('should return false when the store does not have the model', () => {
			const store = emptyStore()
			store.insertOrUpdate('smp-1', {})
			expect(store.delete('smp-2')).to.be.false
		})
	})

	describe('get', () => {
		it('should return undefined when the store is empty', () => {
			expect(emptyStore().get('smp-1')).to.be.undefined
		})
	})

	describe('has', () => {
		it('should return false if the store is empty', () => {
			expect(emptyStore().has('smp-1')).to.be.false
		})
	})

	describe('insertOrUpdate', () => {
		it('should insert a new model when it does not exist yet', () => {
			const store = emptyStore()
			const model = new Model('smp-1', {}, Simple)
			store.insertOrUpdate('smp-1', {})
			expect(store.all()).to.deep.equal([model])
		})

		it('should update a model when it exists', () => {
			const store = emptyComplexStore()
			store.insertOrUpdate('smp-1', { value: 'A' })
			store.insertOrUpdate('smp-1', { value: 'B' })
			expect(store.read('smp-1')).to.deep.equal({ value: 'B' })
		})
	})

	describe('missing', () => {
		it('should return true if the store is empty', () => {
			expect(emptyStore().missing('smp-1')).to.be.true
		})
	})

	describe('read', () => {
		it('should return undefined if the store is empty', () => {
			expect(emptyStore().read('smp-1')).to.be.undefined
		})

		it('should return a model properties when the store has the model', () => {
			const store = emptyStore()
			store.insertOrUpdate('smp-1', {})
			expect(store.read('smp-1')).to.deep.equal({})
		})

		it('should return undefined when the store does not have the model', () => {
			const store = emptyStore()
			store.insertOrUpdate('smp-1', {})
			expect(store.read('smp-2')).to.be.undefined
		})
	})

	describe('readModel', () => {
		it('should return undefined if the store is empty', () => {
			expect(emptyStore().readModel('smp-1')).to.be.undefined
		})

		it('should return a model properties when the store has the model', () => {
			const store = emptyStore()
			store.insertOrUpdate('smp-1', {})
			expect(store.readModel('smp-1')).to.deep.equal(new Model('smp-1', {}, Simple))
		})

		it('should return undefined when the store does not have the model', () => {
			const store = emptyStore()
			store.insertOrUpdate('smp-1', {})
			expect(store.readModel('smp-2')).to.be.undefined
		})
	})

	describe('update', () => {
		it('should return false if the store is empty', () => {
			expect(emptyStore().update('smp-1', {}))
		})

		it('should return true when a model is updated', () => {
			const store = emptyComplexStore()
			store.insertOrUpdate('cpx-1', { value: 'A' })
			expect(store.update('cpx-1', { value: 'B' }))
		})

		it('should update a model properties', () => {
			const store = emptyComplexStore()
			store.insertOrUpdate('cpx-1', { value: 'A' })
			store.update('cpx-1', { value: 'B' })
			expect(store.read('cpx-1')).to.deep.equal({ value: 'B' })
		})

		it('should not change a model properties if no changes are supplied', () => {
			const store = emptyComplexStore()
			store.insertOrUpdate('cpx-1', { value: 'A' })
			store.update('cpx-1', {})
			expect(store.read('cpx-1')).to.deep.equal({ value: 'A' })
		})

		it('should update an optional properties field with a new value', () => {
			const store = new ModelStore('opt', Optional)
			store.insertOrUpdate('opt-1', { value: 1 })
			store.update('opt-1', { value: 2 })
			expect(store.read('opt-1')).to.deep.equal({ value: 2 })
		})

		it('should update an optional properties field with undefined', () => {
			const store = new ModelStore('opt', Optional)
			store.insertOrUpdate('opt-1', { value: 1 })
			store.update('opt-1', { value: undefined })
			expect(store.read('opt-1')!.value).to.be.undefined
		})

		it('should not change an optional properties field with empty values', () => {
			const store = new ModelStore('opt', Optional)
			store.insertOrUpdate('opt-1', { value: 1 })
			store.update('opt-1', {})
			expect(store.read('opt-1')!.value).to.equal(1)
		})

		it('should update an undefined optional property with a value', () => {
			const store = new ModelStore('opt', Optional)
			store.insertOrUpdate('opt-1', {})
			store.update('opt-1', { value: 1 })
			expect(store.read('opt-1')!.value).to.equal(1)
		})
	})

	describe('serialise', () => {
		it('should serialise an empty store', () => {
			const store = new ModelStore('opt', Optional)
			const expected = { 'collection': [], 'index': [], type: 'Optional' }
			expect(store.serialise(manifest)).to.deep.equal(expected)
		})

		it('should serialise a store', () => {
			const store = new ModelStore('opt', Optional)
			store.insertOrUpdate('opt-1', { value: 1 })
			const expected = {
				collection: [
					{
						id:  'opt-1',
						properties: { value: 1 },
						type: 'Optional'
					}
				],
				index: [['opt-1', 0]],
				type: 'Optional'
			}
			expect(store.serialise(manifest)).to.deep.equal(expected)
		})
	})

	describe('deserialise', () => {
		it('should deserialise an empty store', () => {
			const store = new ModelStore('opt', Optional)
			const data = { 'collection': [], 'index': [], type: 'Optional' }
			expect(ModelStore.deserialise(data, manifest)).to.deep.equal(store)
		})

		it('should deserialise a store', () => {
			const store = new ModelStore('opt', Optional)
			store.insertOrUpdate('opt-1', { value: 1 })
			const data = {
				collection: [
					{
						id: 'opt-1',
						properties: { value: 1 },
						type: 'Optional'
					}
				],
				index: [['opt-1', 0]],
				type: 'Optional'
			}
			expect(ModelStore.deserialise(data, manifest)).to.deep.equal(store)
		})
	})
})