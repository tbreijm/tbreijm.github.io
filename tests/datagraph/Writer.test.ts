import { describe } from 'mocha'
import chai, { expect } from 'chai'
import sinonChai from 'sinon-chai'
import * as sinon from 'sinon'
import { TestScheduler } from 'rxjs/testing'
import { Change, ChangeType, Reader, Writer } from '../../src/datagraph'
import { Model, ModelGraph } from '../../src/modelgraph'
import { Subject } from 'rxjs'
import { filter } from 'rxjs/operators'
import { Complex, Simple } from '../modelgraph/Model.values'
import { TestA, TestB } from '../modelgraph/Relationship.values'
import {
	connected2Graph,
	dualConnected2Graph,
	largeGraph,
	migratableGraph, migratableRelationships, swappedRelationships, swappedRelationships2,
	unconnected2Graph
} from '../modelgraph/ModelGraph.values'
import { manifest } from '../modelgraph/Models.values'
import { equal } from '../../src/Equals'

chai.use(sinonChai)

describe('Writer', () => {

	let testScheduler: TestScheduler

	beforeEach(() => {
		testScheduler = new TestScheduler((actual, expected) => {
			expect(actual).deep.equal(expected)
		})
	})

	describe('clone', () => {
		it('should clone a model', () => {
			const changes = new Subject<Change>()
			const writer = new Writer(manifest, connected2Graph(), changes)

			const values = {
				a: {
					type: ChangeType.CLONE,
					data: { oldModelId: 'cpx-1', newModelId: 'cpx-2' }
				}
			}
			const observable = changes.pipe(filter(_ => _.type === ChangeType.CLONE))

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => writer.clone('cpx-1'))
				expectObservable(observable, '--!').toBe('-a', values)
			})
		})

		it('should clone a model with a custom id', () => {
			const changes = new Subject<Change>()
			const writer = new Writer(manifest, connected2Graph(), changes)

			const values = {
				a: {
					type: ChangeType.CLONE,
					data: { oldModelId: 'cpx-1', newModelId: 'cpx-134' }
				}
			}
			const observable = changes.pipe(filter(_ => _.type === ChangeType.CLONE))

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => writer.clone('cpx-1', 134))
				expectObservable(observable, '--!').toBe('-a', values)
			})
		})

		it('should not clone a non-existent model', () => {
			const changes = new Subject<Change>()
			const writer = new Writer(manifest, unconnected2Graph(), changes)
			const observable = changes.pipe(filter(_ => _.type === ChangeType.CLONE))

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => writer.clone('cpx-5'))
				expectObservable(observable, '--!').toBe('')
			})
		})

		it('should not clone an undefined model', () => {
			const changes = new Subject<Change>()
			const writer = new Writer(manifest, new ModelGraph(), changes)
			const observable = changes.pipe(filter(_ => _.type === ChangeType.CLONE))

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => writer.clone(undefined))
				expectObservable(observable, '--!').toBe('')
			})
		})
	})

	describe('create', () => {
		it('should create a model', () => {
			const changes = new Subject<Change>()
			const writer = new Writer(manifest, new ModelGraph(), changes)

			const values = {
				a: {
					type: ChangeType.CREATE,
					data: { newModelId: 'smp-1' }
				}
			}
			const observable = changes.pipe(filter(_ => _.type === ChangeType.CREATE))

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => {
					writer.create(Simple, {})
				})
				expectObservable(observable, '--!').toBe('-a', values)
			})
		})
	})

	describe('delete', () => {
		it('should delete a model', () => {
			const changes = new Subject<Change>()
			const graph = connected2Graph()
			const writer = new Writer(manifest, graph, changes)
			const reader = new Reader(graph)

			const values = {
				a: {
					type: ChangeType.END,
					data: { type: TestA, modelIds: ['cpx-1', 'smp-1'], relationshipId: 1}
				},
				b: {
					type: ChangeType.DELETE,
					data: { type: Complex, modelId: 'cpx-1', properties: {value: 'A'} }
				}
			}
			const observable = changes.pipe(
				filter(_ =>
					_.type === ChangeType.DELETE || _.type === ChangeType.END
				)
			)

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => {
					writer.delete('cpx-1')
				})
				expectObservable(observable, '--!').toBe('-(ab)', values)
			})

			expect(reader.allRelationships(TestA)).to.deep.equal([])
		})

		it('should not delete a non-existent model', () => {
			const changes = new Subject<Change>()
			const writer = new Writer(manifest, unconnected2Graph(), changes)
			const observable = changes.pipe(filter(_ => _.type === ChangeType.DELETE))

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => writer.delete('cpx-5'))
				expectObservable(observable, '--!').toBe('')
			})
		})

		it('should not delete an undefined model', () => {
			const changes = new Subject<Change>()
			const writer = new Writer(manifest, new ModelGraph(), changes)
			const observable = changes.pipe(filter(_ => _.type === ChangeType.DELETE))

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => writer.delete(undefined))
				expectObservable(observable, '--!').toBe('')
			})
		})
	})

	describe('deleteAll', () => {
		it('should delete all given models', () => {
			const changes = new Subject<Change>()
			const writer = new Writer(manifest, connected2Graph(), changes)

			const values = {
				a: {
					type: ChangeType.DELETE,
					data: { type: Complex, modelId: 'cpx-1', properties: {value: 'A'} }
				},
				b: {
					type: ChangeType.DELETE,
					data: { type: Simple, modelId: 'smp-1', properties: {} }
				}
			}
			const observable = changes.pipe(filter(_ => _.type === ChangeType.DELETE))

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => {
					writer.deleteAll(['cpx-1', 'smp-1'])
				})
				expectObservable(observable, '--!').toBe('-(ab)', values)
			})
		})

		it('should not delete a non-existent model', () => {
			const changes = new Subject<Change>()
			const writer = new Writer(manifest, connected2Graph(), changes)

			const values = {
				a: {
					type: ChangeType.DELETE,
					data: { type: Complex, modelId: 'cpx-1', properties: {value: 'A'} }
				}
			}
			const observable = changes.pipe(filter(_ => _.type === ChangeType.DELETE))

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => {
					writer.deleteAll(['cpx-1', 'smp-2'])
				})
				expectObservable(observable, '--!').toBe('-a', values)
			})
		})

		it('should not delete an undefined model', () => {
			const changes = new Subject<Change>()
			const writer = new Writer(manifest, connected2Graph(), changes)

			const values = {
				a: {
					type: ChangeType.DELETE,
					data: { type: Complex, modelId: 'cpx-1', properties: {value: 'A'} }
				}
			}
			const observable = changes.pipe(filter(_ => _.type === ChangeType.DELETE))

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => {
					writer.deleteAll(['cpx-1', undefined])
				})
				expectObservable(observable, '--!').toBe('-a', values)
			})
		})
	})

	describe('end', () => {
		it('should end a relationship', () => {
			const changes = new Subject<Change>()
			const writer = new Writer(manifest, connected2Graph(), changes)

			const values = {
				a: {
					type: ChangeType.END,
					data: { type: TestA, modelIds: ['cpx-1', 'smp-1'], relationshipId: 1 }
				}
			}
			const observable = changes.pipe(filter(_ => _.type === ChangeType.END))

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => writer.end(1))
				expectObservable(observable, '--!').toBe('-a', values)
			})
		})

		it('should not end an non existent relationship', () => {
			const changes = new Subject<Change>()
			const writer = new Writer(manifest, connected2Graph(), changes)
			const observable = changes.pipe(filter(_ => _.type === ChangeType.END))

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => writer.end(2))
				expectObservable(observable, '--!').toBe('')
			})
		})
	})

	describe('endAll', () => {
		it('should end all relationships for a model', () => {
			const changes = new Subject<Change>()
			const writer = new Writer(manifest, dualConnected2Graph(), changes)

			const values = {
				a: {
					type: ChangeType.END,
					data: { type: TestA, modelIds: ['cpx-1', 'smp-1'], relationshipId: 1 }
				},
				b: {
					type: ChangeType.END,
					data: { type: TestB, modelIds: ['cpx-1', 'smp-1'], relationshipId: 2 }
				}
			}
			const observable = changes.pipe(filter(_ => _.type === ChangeType.END))

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => writer.endAll('cpx-1'))
				expectObservable(observable, '--!').toBe('-(ba)', values)
			})
		})

		it('should not end all relationships for an undefined model', () => {
			const changes = new Subject<Change>()
			const writer = new Writer(manifest, new ModelGraph(), changes)
			const observable = changes.pipe(filter(_ => _.type === ChangeType.END))

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => writer.endAll(undefined))
				expectObservable(observable, '--!').toBe('')
			})
		})
	})

	describe('insert', () => {
		it('should insert a model', () => {
			const changes = new Subject<Change>()
			const writer = new Writer(manifest, new ModelGraph(), changes)

			const values = {
				a: {
					type: ChangeType.INSERT,
					data: { newModelId: 'smp-1' }
				}
			}
			const observable = changes.pipe(filter(_ => _.type === ChangeType.INSERT))

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => {
					writer.insert(new Model('smp-1', {}, Simple))
				})
				expectObservable(observable, '--!').toBe('-a', values)
			})
		})

		it('should not insert an undefined model', () => {
			const changes = new Subject<Change>()
			const writer = new Writer(manifest, new ModelGraph(), changes)
			const observable = changes.pipe(filter(_ => _.type === ChangeType.INSERT))

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => {
					writer.insert(undefined)
				})
				expectObservable(observable, '--!').toBe('--')
			})
		})

		it('should not insert when graph insertion is unsuccessful', () => {
			const graph = new ModelGraph()
			const insertFail = sinon.stub(graph, 'insert').callsFake(() => false)

			const changes = new Subject<Change>()
			const writer = new Writer(manifest, graph, changes)
			const observable = changes.pipe(filter(_ => _.type === ChangeType.INSERT))

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => {
					writer.insert(new Model('smp-1', {}, Simple))
				})
				expectObservable(observable, '--!').toBe('--')
			})

			insertFail.restore()
		})
	})

	describe('migrate', () => {
		it('should not migrate when the graph is empty', () => {
			const changes = new Subject<Change>()
			const writer = new Writer(manifest, new ModelGraph(), changes)
			const observable = changes.pipe(filter(_ => _.type === ChangeType.END))

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => writer.migrate(TestA, 'cpx-1', 'cpx-2'))
				expectObservable(observable, '--!').toBe('')
			})
		})

		it('should return an empty set when the end operation fails', () => {
			const writer = new Writer(manifest, migratableGraph(), new Subject<Change>())
			const endFail = sinon.stub(writer, 'end').callsFake(() => false)

			const result = writer.migrate(TestA, 'cpx-2', 'cpx-1')

			expect(result).to.deep.equal(new Set())

			endFail.restore()
		})

		it('should call the correct functions when migrating a relationship sub-graph', () => {
			const changes = new Subject<Change>()
			const writer = new Writer(manifest, migratableGraph(), changes)

			const values = {
				a: {
					type: ChangeType.END,
					data: { type: TestA, modelIds: ['cpx-2', 'smp-4'], relationshipId: 4 }
				},
				b: {
					type: ChangeType.END,
					data: { type: TestA, modelIds: ['cpx-2', 'smp-3'], relationshipId: 3 }
				},
				c: {
					type: ChangeType.START,
					data: { type: TestA, modelIds: ['smp-4', 'cpx-1'], relationshipId: 4 }
				},
				d: {
					type: ChangeType.START,
					data: { type: TestA, modelIds: ['smp-3', 'cpx-1'], relationshipId: 3 }
				}
			}

			const observable = changes.pipe(filter(_ =>
				_.type === ChangeType.END || _.type === ChangeType.START))

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => writer.migrate(TestA, 'cpx-2', 'cpx-1'))
				expectObservable(observable, '--!').toBe('-(badc)', values)
			})
		})

		it('should produce the correct result when migrating a relationship sub-graph', () => {
			const changes = new Subject<Change>()
			const graph = migratableGraph()
			const writer = new Writer(manifest, graph, changes)
			const reader = new Reader(graph)

			writer.migrate(TestA, 'cpx-2', 'cpx-1')

			const result1 = reader.many(TestA, 'cpx-1')
			expect(equal(result1, migratableRelationships())).to.be.true

			const result2 = reader.many(TestA, 'cpx-2')
			expect(equal(result2, [])).to.be.true
		})
	})

	describe('start', () => {
		it('should start a relationship', () => {
			const changes = new Subject<Change>()
			const writer = new Writer(manifest, unconnected2Graph(), changes)

			const values = {
				a: {
					type: ChangeType.START,
					data: { type: TestA, modelIds: ['smp-1', 'cpx-1'], relationshipId: 1 }
				}
			}
			const observable = changes.pipe(filter(_ => _.type === ChangeType.START))

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => writer.start(TestA, ['smp-1', 'cpx-1']))
				expectObservable(observable, '--!').toBe('-a', values)
			})
		})

		it('should not start a relationship if the graph operation is unsuccessful', () => {
			const changes = new Subject<Change>()
			const graph = unconnected2Graph()
			const startFail = sinon.stub(graph, 'start').callsFake(() => undefined)
			const writer = new Writer(manifest, graph, changes)

			const observable = changes.pipe(filter(_ => _.type === ChangeType.START))

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => writer.start(TestA, ['smp-1', 'cpx-1']))
				expectObservable(observable, '--!').toBe('--')
			})

			startFail.restore()
		})
	})

	describe('startAll', () => {
		it('should start a single relationship', () => {
			const changes = new Subject<Change>()
			const writer = new Writer(manifest, unconnected2Graph(), changes)

			const values = {
				a: {
					type: ChangeType.START,
					data: { type: TestA, modelIds: ['smp-1', 'cpx-1'], relationshipId: 1 }
				}
			}
			const observable = changes.pipe(filter(_ => _.type === ChangeType.START))

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => writer.startAll(TestA, [['smp-1', 'cpx-1']]))
				expectObservable(observable, '--!').toBe('-a', values)
			})
		})

		it('should start multiple relationships', () => {
			const changes = new Subject<Change>()
			const writer = new Writer(manifest, largeGraph(), changes)

			const values = {
				a: {
					type: ChangeType.START,
					data: { type: TestA, modelIds: ['smp-1', 'cpx-1'], relationshipId: 1 }
				},
				b: {
					type: ChangeType.START,
					data: { type: TestA, modelIds: ['smp-2', 'cpx-1'], relationshipId: 2 }
				},
				c: {
					type: ChangeType.START,
					data: { type: TestA, modelIds: ['smp-1', 'cpx-2'], relationshipId: 3 }
				}
			}
			const observable = changes.pipe(filter(_ => _.type === ChangeType.START))

			const relationships = [['smp-1', 'cpx-1'], ['smp-2', 'cpx-1'], ['smp-1', 'cpx-2']]

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => writer.startAll(TestA, relationships))
				expectObservable(observable, '--!').toBe('-(abc)', values)
			})
		})
	})

	describe('swap', () => {
		it('should not swap when the graph is empty', () => {
			const changes = new Subject<Change>()
			const writer = new Writer(manifest, new ModelGraph(), changes)
			const observable = changes.pipe(filter(_ => _.type === ChangeType.END))

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => writer.swap(TestA, 'cpx-1', 'cpx-2'))
				expectObservable(observable, '--!').toBe('')
			})
		})

		it('should return an empty set when the end operation fails', () => {
			const writer = new Writer(manifest, migratableGraph(), new Subject<Change>())
			const endFail = sinon.stub(writer, 'end').callsFake(() => false)

			const result = writer.swap(TestA, 'cpx-2', 'cpx-1')

			expect(result).to.deep.equal(new Set())

			endFail.restore()
		})

		it('should call the correct functions when swapping relationship sub-graphs', () => {
			const changes = new Subject<Change>()
			const writer = new Writer(manifest, migratableGraph(), changes)

			const values = {
				a: {
					type: ChangeType.END,
					data: { type: TestA, modelIds: ['cpx-2', 'smp-4'], relationshipId: 4 }
				},
				b: {
					type: ChangeType.END,
					data: { type: TestA, modelIds: ['cpx-2', 'smp-3'], relationshipId: 3 }
				},
				c: {
					type: ChangeType.END,
					data: { type: TestA, modelIds: ['cpx-1', 'smp-2'], relationshipId: 2 }
				},
				d: {
					type: ChangeType.END,
					data: { type: TestA, modelIds: ['cpx-1', 'smp-1'], relationshipId: 1 }
				},
				e: {
					type: ChangeType.START,
					data: { type: TestA, modelIds: ['smp-4', 'cpx-1'], relationshipId: 2 }
				},
				f: {
					type: ChangeType.START,
					data: { type: TestA, modelIds: ['smp-3', 'cpx-1'], relationshipId: 1 }
				},
				g: {
					type: ChangeType.START,
					data: { type: TestA, modelIds: ['smp-2', 'cpx-2'], relationshipId: 4 }
				},
				h: {
					type: ChangeType.START,
					data: { type: TestA, modelIds: ['smp-1', 'cpx-2'], relationshipId: 3 }
				}
			}

			const observable = changes.pipe(filter(_ =>
				_.type === ChangeType.END || _.type === ChangeType.START))

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => writer.swap(TestA, 'cpx-2', 'cpx-1'))
				expectObservable(observable, '--!').toBe('-(badcfehg)', values)
			})
		})

		it('should produce the correct result when swapping relationship sub-graphs', () => {
			const changes = new Subject<Change>()
			const graph = migratableGraph()
			const writer = new Writer(manifest, graph, changes)
			const reader = new Reader(graph)

			writer.swap(TestA, 'cpx-2', 'cpx-1')

			const result = reader.allRelationships(TestA)
			expect(equal(result, swappedRelationships())).to.be.true
		})

		it('should produce the correct result when swapping with an empty set', () => {
			const changes = new Subject<Change>()
			const graph = migratableGraph()
			const writer = new Writer(manifest, graph, changes)
			const reader = new Reader(graph)

			writer.swap(TestA, 'cpx-2', undefined)

			const result = reader.allRelationships(TestA)
			expect(equal(result, swappedRelationships2())).to.be.true
		})
	})

	describe('update', () => {
		it('should update a model', () => {
			const changes = new Subject<Change>()
			const writer = new Writer(manifest, connected2Graph(), changes)

			const values = {
				a: {
					type: ChangeType.UPDATE,
					data: { modelId: 'cpx-1', values: {} }
				}
			}
			const observable = changes.pipe(filter(_ => _.type === ChangeType.UPDATE))

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => {
					writer.update<Complex>('cpx-1', {})
				})
				expectObservable(observable, '--!').toBe('-a', values)
			})
		})

		it('should not update a non-existent model', () => {
			const changes = new Subject<Change>()
			const writer = new Writer(manifest, unconnected2Graph(), changes)
			const observable = changes.pipe(filter(_ => _.type === ChangeType.UPDATE))

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => writer.update<Complex>('cpx-5', {}))
				expectObservable(observable, '--!').toBe('')
			})
		})

		it('should not update an undefined model', () => {
			const changes = new Subject<Change>()
			const writer = new Writer(manifest, new ModelGraph(), changes)
			const observable = changes.pipe(filter(_ => _.type === ChangeType.UPDATE))

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => writer.update(undefined, {}))
				expectObservable(observable, '--!').toBe('')
			})
		})
	})

	describe('updateOrCreate', () => {
		it('should update a model', () => {
			const changes = new Subject<Change>()
			const writer = new Writer(manifest, connected2Graph(), changes)

			const values = {
				a: {
					type: ChangeType.UPDATE,
					data: { modelId: 'cpx-1', values: {value: 'B'} }
				}
			}
			const observable = changes.pipe(filter(_ => _.type === ChangeType.UPDATE))

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => {
					writer.updateOrCreate('cpx-1', Complex, {value: 'B'})
				})
				expectObservable(observable, '--!').toBe('-a', values)
			})
		})

		it('should create a non-existent model', () => {
			const changes = new Subject<Change>()
			const observable = changes.pipe(filter(_ => _.type === ChangeType.CREATE))
			const writer = new Writer(manifest, unconnected2Graph(), changes)

			const values = {
				a: {
					type: ChangeType.CREATE,
					data: { newModelId: 'cpx-2' }
				}
			}

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => {
					writer.updateOrCreate('cpx-2', Complex, {value: 'A'})
				})
				expectObservable(observable, '--!').toBe('-a', values)
			})
		})

		it('should create a new model when the model id is undefined', () => {
			const changes = new Subject<Change>()
			const observable = changes.pipe(filter(_ => _.type === ChangeType.CREATE))
			const writer = new Writer(manifest, unconnected2Graph(), changes)

			const values = {
				a: {
					type: ChangeType.CREATE,
					data: { newModelId: 'cpx-2' }
				}
			}

			testScheduler.run(({ expectObservable, cold }) => {
				cold('-a').subscribe(() => {
					writer.updateOrCreate(undefined, Complex, {value: 'A'})
				})
				expectObservable(observable, '--!').toBe('-a', values)
			})
		})
	})
})