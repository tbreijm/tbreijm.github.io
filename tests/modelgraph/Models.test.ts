import chai, { expect } from 'chai'
import { describe } from 'mocha'
import sinonChai from 'sinon-chai'
import * as sinon from 'sinon'
import { complexModelsA, complexModelsB, emptyModels, manifest, simpleModels } from './Models.values'
import { Complex, Simple } from './Model.values'
import { Model, Models, ModelStore, ModelType } from '../../src/modelgraph'
import { Node } from '../../src/hypergraph'

chai.use(sinonChai)

describe('Models', () => {
	describe('all', () => {
		it('should return an empty array when no stores have been registered', () => {
			expect(emptyModels().all(Simple)).to.deep.equal([])
		})

		it('should return the array of models when a store has been registered', () => {
			const models = emptyModels()
			expect(models.all(Simple)).to.deep.equal([])
		})
	})

	describe('belongsTo', () => {
		it('should return false when no stores have been registered', () => {
			expect(emptyModels().belongsTo(Simple, 'smp-1')).to.be.false
		})

		it('should return false when no models have been registered', () => {
			const models = emptyModels()
			expect(models.belongsTo(Simple, 'smp-1')).to.be.false
		})

		it('should return true when a model has been registered', () => {
			const models = emptyModels()
			models.create(Simple, 'smp', {}, 1)
			expect(models.belongsTo(Simple, 'smp-1')).to.be.true
		})

		it('should return false when a model has not been registered', () => {
			const models = emptyModels()
			models.create(Simple, 'smp', {}, 1)
			expect(models.belongsTo(Simple, 'smp-2')).to.be.false
		})
	})

	describe('clone', () => {
		it('should return undefined when no stores have been registered', () => {
			expect(emptyModels().clone('smp', 'smp-1', 1)).to.be.undefined
		})

		it('should return an id when the model exists', () => {
			const store = emptyModels()
			store.create(Complex, 'cpx', {value: 'A'}, 1)

			expect(store.clone('cpx', 'cpx-1', 2)).to.equal('cpx-2')
			expect(store.read<Complex>('cpx-2')).to.deep.equal({value: 'A'})
		})

		it('should return undefined when the properties are undefined', () => {
			const store = emptyModels()
			const readStub = sinon.stub(store, 'read').callsFake(() => undefined)

			store.create(Complex, 'cpx', {value: 'A'}, 1)

			expect(store.clone('cpx', 'cpx-1', 2)).to.be.undefined

			readStub.restore()
		})
	})

	describe('create', () => {
		it('should return an id', () => {
			expect(emptyModels().create(Simple,'smp', {}, 1)).to.equal('smp-1')
		})

		it('should return an id when a model is created', () => {
			const store = emptyModels()
			store.create(Simple, 'smp', {}, 1)
			expect(store.create(Simple, 'smp', {}, 2)).to.equal('smp-2')
		})
	})

	describe('delete', () => {
		it('should return false when no stores have been registered', () => {
			expect(emptyModels().delete('smp-1')).to.be.false
		})

		it('should return false when the store is empty', () => {
			expect(emptyModels().delete('smp-1')).to.be.false
		})

		it('should return true when the model exists', () => {
			const model = emptyModels()
			model.create(Simple, 'smp', {}, 1)
			expect(model.delete('smp-1')).to.be.true
		})

		it('should not delete the model store if models of the type still exist', () => {
			const model = emptyModels()
			model.create(Simple, 'smp', {}, 1)
			model.create(Simple, 'smp', {}, 2)
			expect(model.delete('smp-1')).to.be.true
			expect(model.has(Simple)).to.be.true
		})

		it('should return false when the model store does not exist', () => {
			const stores = new Map<ModelType<any>, ModelStore<any>>()
			const getStub = sinon.stub(stores, 'get').callsFake(_ => {
				return getStub.callCount > 1 ? undefined : stores.get(_)
			})

			const model = new Models(
				new Map<string, Node>(),
				new Map<string, ModelType<any>>(),
				new Map<Node, string>(),
				stores
			)

			model.create(Simple, 'smp', {}, 1)
			expect(model.delete('smp-1')).to.be.false

			getStub.restore()
		})

		it('should return false when the model store does not delete the model', () => {
			const stores = new Map<ModelType<any>, ModelStore<any>>()

			const model = new Models(
				new Map<string, Node>(),
				new Map<string, ModelType<any>>(),
				new Map<Node, string>(),
				stores
			)

			model.create(Simple, 'smp', {}, 1)

			const store = new ModelStore('smp', Simple)
			const deleteStub = sinon.stub(store, 'delete').callsFake(() => false)
			stores.set(Simple, store)

			expect(model.delete('smp-1')).to.be.false

			deleteStub.restore()
		})

		it('should return false when the model does not exist', () => {
			const model = emptyModels()
			model.create(Simple, 'smp',{}, 1)
			expect(model.delete('smp-2')).to.be.false
		})
	})

	describe('equals', () => {
		it('should return true for two empty models', () => {
			const models1 = new Models()
			const models2 = new Models()
			expect(models1.equals(models2)).to.be.true
		})

		it('should return false when one models has models the other does not', () => {
			const models1 = new Models()
			const models2 = complexModelsA()
			expect(models1.equals(models2)).to.be.false
		})

		it('should return false when models contain different models', () => {
			const models1 = simpleModels()
			const models2 = complexModelsA()
			expect(models1.equals(models2)).to.be.false
		})

		it('should return false when models have different properties', () => {
			const models1 = complexModelsA()
			const models2 = complexModelsB()
			expect(models1.equals(models2)).to.be.false
		})

		it('should return true for the same models', () => {
			const models1 = complexModelsA()
			const models2 = complexModelsA()
			expect(models1.equals(models2)).to.be.true
		})

		it('should return true deserialised serialised clone', () => {
			const models1 = complexModelsA()
			const models2 = Models.deserialise(complexModelsA().serialise(manifest), manifest)
			expect(models1.equals(models2)).to.be.true
		})
	})

	describe('get', () => {
		it('should return undefined when no stores have been registered', () => {
			expect(emptyModels().get('smp-1')).to.be.undefined
		})
	})

	describe('has', () => {
		it('should return false when no stores have been registered', () => {
			expect(emptyModels().has(Simple)).to.be.false
		})

		it('should return true when a model of thwe given type exists', () => {
			const models = emptyModels()
			models.create(Simple, 'smp', {}, 1)
			expect(models.has(Simple)).to.be.true
		})

		it('should return false when a store has not been registered', () => {
			const models = emptyModels()
			expect(models.has(Complex)).to.be.false
		})
	})

	describe('insert', () => {
		it('should return false when a model type and prefix do not match', () => {
			expect(emptyModels().insert('cpx',
				new Model('smp-1', {}, Simple), 1)
			).to.be.false
		})
	})

	describe('missing', () => {
		it('should return true for an empty graph', () => {
			expect(emptyModels().missing(Simple)).to.be.true
		})

		it('should return false when a model of the given type exists', () => {
			const models = emptyModels()
			models.create(Simple, 'smp', {}, 1)
			expect(models.missing(Simple)).to.be.false
		})

		it('should return true when no model of the given type exists', () => {
			const models = emptyModels()
			models.create(Simple, 'smp', {}, 1)
			expect(models.missing(Complex)).to.be.true
		})
	})

	describe('read', () => {
		it('should return undefined', () => {
			expect(emptyModels().read<Simple>('smp-1')).to.be.undefined
		})

		it('should return undefined when a model has not been inserted', () => {
			const models = emptyModels()
			expect(models.read<Simple>('smp-1')).to.be.undefined
		})

		it('should return a model properties when a model has been inserted', () => {
			const models = emptyModels()
			models.create(Simple, 'smp', {}, 1)
			expect(models.read<Simple>('smp-1')).to.deep.equal({})
		})

		it('should return undefined when the model id does belong to the given type', () => {
			const models = emptyModels()
			const belongsToStub = sinon.stub(models, 'belongsTo').callsFake(() => false)

			models.create(Simple, 'smp', {}, 1)
			expect(models.read<Simple>('smp-1')).to.be.undefined

			belongsToStub.restore()
		})
	})

	describe('readModel', () => {
		it('should return undefined', () => {
			expect(emptyModels().readModel<Simple>('smp-1')).to.be.undefined
		})

		it('should return undefined when a model has not been inserted', () => {
			const models = emptyModels()
			expect(models.readModel<Simple>('smp-1')).to.be.undefined
		})

		it('should return a model properties when a model has been inserted', () => {
			const models = emptyModels()
			models.create(Simple, 'smp', {}, 1)

			const result = Model.equals(
				new Model('smp-1', {}, Simple),
        models.readModel<Simple>('smp-1')!
			)

			expect(result).to.be.true
		})

		it('should return undefined when the model id does belong to the given type', () => {
			const models = emptyModels()
			const belongsToStub = sinon.stub(models, 'belongsTo').callsFake(() => false)

			models.create(Simple, 'smp', {}, 1)
			expect(models.readModel<Simple>('smp-1')).to.be.undefined

			belongsToStub.restore()
		})
	})

	describe('resolve', () => {
		it('should return undefined when no stores have been registered', () => {
			expect(emptyModels().resolve(1)).to.be.undefined
		})

		it('should return a model properties when the model exists', () => {
			const models = emptyModels()
			models.create(Complex, 'cpx', {value: 'A'}, 1)
			expect(models.resolve(1)).to.deep.equal({value: 'A'})
		})
	})

	describe('update', () => {
		it('should return false when no stores have been registered', () => {
			expect(emptyModels().update<Simple>('smp-1', {})).to.be.false
		})

		it('should return true when a model has been updated', () => {
			const models = emptyModels()
			models.create(Complex, 'cpx', {value: 'A'}, 1)
			expect(models.update<Complex>('cpx-1', {value: 'B'})).to.be.true
		})
	})

	describe('valid', () => {
		it('should return false when no stores have been registered', () => {
			expect(emptyModels().valid('cpx-1')).to.be.false
		})

		it('should return true when a model is valid', () => {
			const models = emptyModels()
			models.create(Complex, 'cpx', {value: 'A'}, 1)

			expect(models.valid('cpx-1')).to.be.true
		})

		it('should return false when no node exists for the given model', () => {
			const models = emptyModels()
			const nodeStub = sinon.stub(models, 'node').callsFake(() => undefined)

			models.create(Complex, 'cpx', {value: 'A'}, 1)

			expect(models.valid('cpx-1')).to.be.false

			nodeStub.restore()
		})
	})

	describe('serialise', () => {
		it('should serialise an empty models', () => {
			const models = emptyModels()
			const expected = {
				models: [],
				nodes: [],
				stores: [],
				types: []
			}
			expect(models.serialise(manifest)).to.deep.equal(expected)
		})

		it('should serialise a models', () => {
			const models = emptyModels()
			models.create(Complex, 'cpx', {value: 'A'}, 1)
			const expected = {
				models: [[1,'cpx-1']],
				nodes: [['cpx-1',1]],
				stores: [['Complex', {
					collection: [
						{
							id: 'cpx-1',
							properties: {
								value: 'A'
							},
							type: 'Complex'
						}
					],
					index: [['cpx-1',0]],
					type: 'Complex'
				}]],
				types: [['cpx-1', 'Complex']]
			}
			expect(models.serialise(manifest)).to.deep.equal(expected)
		})
	})

	describe('deserialise', () => {
		it('should deserialise an empty models', () => {
			const models = emptyModels()
			const data = {
				models: [],
				nodes: [],
				stores: [],
				types: []
			}
			expect(Models.deserialise(data, manifest)).to.deep.equal(models)
		})

		it('should deserialise a models', () => {
			const models = emptyModels()
			models.create(Complex, 'cpx', {value: 'A'}, 1)
			const data = {
				models: [[1,'cpx-1']],
				nodes: [['cpx-1',1]],
				stores: [['Complex', {
					collection: [
						{
							id: 'cpx-1',
							properties: {
								value: 'A'
							},
							type: 'Complex'
						}
					],
					index: [['cpx-1',0]],
					type: 'Complex'
				}]],
				types: [['cpx-1', 'Complex']]
			}
			expect(Models.deserialise(data, manifest)).to.deep.equal(models)
		})
	})
})