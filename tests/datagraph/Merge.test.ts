import chai, {expect} from 'chai'
import {describe} from 'mocha'
import * as sinon from 'sinon'
import sinonChai from 'sinon-chai'
import {Differ, Merge, Reader, Writer} from '../../src/datagraph'
import {Model, ModelGraph} from '../../src/modelgraph'
import {Complex, Simple} from '../modelgraph/Model.values'
import {
	connected2Graph,
	connected4Graph,
	largeGraph,
	singleComplexNodeGraph,
	singleComplexNodeGraph2
} from '../modelgraph/ModelGraph.values'
import {TestA} from '../modelgraph/Relationship.values'

chai.use(sinonChai)

describe('Merge', () => {
	describe('ignore', () => {
		it('should do nothing given an empty graph', () => {
			const graph = new ModelGraph()
			const write = sinon.createStubInstance(Writer) as unknown as Writer

			Merge.ignore(graph, new Differ(new ModelGraph()).diff(graph), {
				read: new Reader(graph),
				write
			}, new Set())

			expect(write.clone).to.not.be.called
			expect(write.create).to.not.be.called
			expect(write.delete).to.not.be.called
			expect(write.end).to.not.be.called
			expect(write.endAll).to.not.be.called
			expect(write.insert).to.not.be.called
			expect(write.update).to.not.be.called
		})
		it('should do nothing', () => {
			const graph = connected2Graph()
			const write = sinon.createStubInstance(Writer) as unknown as Writer

			Merge.ignore(graph, new Differ(new ModelGraph()).diff(graph), {
				read: new Reader(graph),
				write
			}, new Set())

			expect(write.clone).to.not.be.called
			expect(write.create).to.not.be.called
			expect(write.delete).to.not.be.called
			expect(write.end).to.not.be.called
			expect(write.endAll).to.not.be.called
			expect(write.insert).to.not.be.called
			expect(write.update).to.not.be.called
		})
	})

	describe('refresh', () => {
		it('should call the correct write operations', () => {
			const originalGraph = new ModelGraph()
			const graph = connected2Graph()
			const write = sinon.createStubInstance(Writer) as unknown as Writer

			Merge.refresh(graph, new Differ(originalGraph).diff(graph), {
				read: new Reader(originalGraph),
				write
			}, new Set())

			expect(write.clone).to.not.be.called
			expect(write.create).to.not.be.called
			expect(write.delete).to.not.be.called
			expect(write.end).to.not.be.called
			expect(write.endAll).to.not.be.called
			expect(write.insert).to.be.calledTwice
			expect(write.update).to.not.be.called
		})
		it('should only add new additions from the given graph', async () => {
			const originalGraph = connected2Graph()
			const graph = largeGraph()
			const writeStub = sinon.createStubInstance(Writer)
			const write = writeStub as unknown as Writer

			Merge.refresh(graph, new Differ(originalGraph).diff(graph), {
				read: new Reader(originalGraph),
				write
			}, new Set())

			expect(write.clone).to.not.be.called
			expect(write.create).to.not.be.called
			expect(write.delete).to.not.be.called
			expect(write.end).to.not.be.called
			expect(write.endAll).to.not.be.called
			expect(write.insert).to.be.callCount(6)
			expect(write.start).to.not.be.called
			expect(write.update).to.not.be.called
		})
	})

	describe('update', () => {
		it('should call the correct write operations', () => {
			const originalGraph = new ModelGraph()
			const graph = connected2Graph()
			const write = sinon.createStubInstance(Writer) as unknown as Writer

			Merge.update(graph, new Differ(originalGraph).diff(graph), {
				read: new Reader(originalGraph),
				write
			}, new Set())

			expect(write.clone).to.not.be.called
			expect(write.create).to.not.be.called
			expect(write.delete).to.not.be.called
			expect(write.end).to.not.be.called
			expect(write.endAll).to.not.be.called
			expect(write.insert).to.be.calledTwice
			expect(write.update).to.not.be.called
		})
		it('should add new additions and update from the given graph', () => {
			const originalGraph = connected2Graph()
			const graph = largeGraph()
			const writeStub = sinon.createStubInstance(Writer)
			const write = writeStub as unknown as Writer

			Merge.update(graph, new Differ(originalGraph).diff(graph), {
				read: new Reader(originalGraph),
				write
			}, new Set())

			expect(write.clone).to.not.be.called
			expect(write.create).to.not.be.called
			expect(write.delete).to.not.be.called
			expect(write.end).to.not.be.called
			expect(write.endAll).to.not.be.called
			expect(write.insert).to.be.callCount(6)
			expect(write.start).to.not.be.called
			expect(write.update).to.not.be.called
		})
		it('should update from the given graph', () => {
			const originalGraph = singleComplexNodeGraph()
			const graph = singleComplexNodeGraph2()
			const writeStub = sinon.createStubInstance(Writer)
			const write = writeStub as unknown as Writer

			Merge.update(graph, new Differ(originalGraph).diff(graph), {
				read: new Reader(originalGraph),
				write
			}, new Set())

			expect(write.clone).to.not.be.called
			expect(write.create).to.not.be.called
			expect(write.delete).to.not.be.called
			expect(write.end).to.not.be.called
			expect(write.endAll).to.not.be.called
			expect(write.insert).to.not.be.called
			expect(write.start).to.not.be.called
			expect(write.update).to.be.calledOnceWith('cpx-1', {'value': 'B'})
		})
		it('should add new relationships and update from the given graph', () => {
			const originalGraph = largeGraph()
			const graph = connected2Graph()
			const writeStub = sinon.createStubInstance(Writer)
			const write = writeStub as unknown as Writer

			Merge.update(graph, new Differ(originalGraph).diff(graph), {
				read: new Reader(originalGraph),
				write
			}, new Set())

			expect(write.clone).to.not.be.called
			expect(write.create).to.not.be.called
			expect(write.delete).to.not.be.called
			expect(write.end).to.not.be.called
			expect(write.endAll).to.not.be.called
			expect(write.insert).to.not.be.called
			expect(write.start).to.be.calledOnce
			expect(write.update).to.not.be.called
		})
		it('should exclude a given set of types from being updated', () => {
			const originalGraph = singleComplexNodeGraph()
			const graph = singleComplexNodeGraph2()
			const write = sinon.createStubInstance(Writer) as unknown as Writer

			Merge.update(graph, new Differ(originalGraph).diff(graph), {
				read: new Reader(originalGraph),
				write
			}, new Set([Complex]))

			expect(write.clone).to.not.be.called
			expect(write.create).to.not.be.called
			expect(write.delete).to.not.be.called
			expect(write.end).to.not.be.called
			expect(write.endAll).to.not.be.called
			expect(write.insert).to.not.be.called
			expect(write.update).to.not.be.called
		})
		it('should exclude a given map of type fields', () => {
			const originalGraph = singleComplexNodeGraph()
			const graph = singleComplexNodeGraph2()
			const write = sinon.createStubInstance(Writer) as unknown as Writer

			Merge.update(graph, new Differ(originalGraph).diff(graph), {
				read: new Reader(originalGraph),
				write
			}, new Map([[Complex, ['value']]]))

			expect(write.clone).to.not.be.called
			expect(write.create).to.not.be.called
			expect(write.delete).to.not.be.called
			expect(write.end).to.not.be.called
			expect(write.endAll).to.not.be.called
			expect(write.insert).to.not.be.called
			expect(write.update).to.not.be.called
		})
		it('should exclude a given map of type fields ignoring non-existent fields', () => {
			const originalGraph = singleComplexNodeGraph()
			const graph = singleComplexNodeGraph2()
			const write = sinon.createStubInstance(Writer) as unknown as Writer

			Merge.update(graph, new Differ(originalGraph).diff(graph), {
				read: new Reader(originalGraph),
				write
			}, new Map([[Complex, ['amount']]]))

			expect(write.clone).to.not.be.called
			expect(write.create).to.not.be.called
			expect(write.delete).to.not.be.called
			expect(write.end).to.not.be.called
			expect(write.endAll).to.not.be.called
			expect(write.insert).to.not.be.called
			expect(write.update).to.have.been.calledOnce
		})
		it('should conditionally update fields', () => {
			const originalGraph = singleComplexNodeGraph()
			const graph = singleComplexNodeGraph2()
			const write = sinon.createStubInstance(Writer) as unknown as Writer

			Merge.update(graph, new Differ(originalGraph).diff(graph), {
				read: new Reader(originalGraph),
				write
			}, (model, field) =>
				field === 'value' && model.properties[field] === 'A'
			)

			expect(write.clone).to.not.be.called
			expect(write.create).to.not.be.called
			expect(write.delete).to.not.be.called
			expect(write.end).to.not.be.called
			expect(write.endAll).to.not.be.called
			expect(write.insert).to.not.be.called
			expect(write.update).to.not.be.called
		})
		it('should not apply changes to models that do not exist', () => {
			const originalGraph = singleComplexNodeGraph()
			const graph = singleComplexNodeGraph2()
			const write = sinon.createStubInstance(Writer) as unknown as Writer

			const readModelStub = sinon.stub(graph, 'readModel').callsFake(() => undefined)

			Merge.update(graph, new Differ(originalGraph).diff(graph), {
				read: new Reader(originalGraph),
				write
			}, () => true
			)

			expect(write.clone).to.not.be.called
			expect(write.create).to.not.be.called
			expect(write.delete).to.not.be.called
			expect(write.end).to.not.be.called
			expect(write.endAll).to.not.be.called
			expect(write.insert).to.not.be.called
			expect(write.update).to.not.be.called

			readModelStub.restore()
		})
	})

	describe('override', () => {
		it('should call the correct write operations', () => {
			const originalGraph = new ModelGraph()
			const graph = connected2Graph()
			const write = sinon.createStubInstance(Writer) as unknown as Writer

			Merge.override(graph, new Differ(originalGraph).diff(graph), {
				read: new Reader(originalGraph),
				write
			}, new Set())

			expect(write.clone).to.not.be.called
			expect(write.create).to.not.be.called
			expect(write.delete).to.not.be.called
			expect(write.end).to.not.be.called
			expect(write.endAll).to.not.be.called
			expect(write.insert).to.be.calledTwice
			expect(write.update).to.not.be.called
		})
		it('should transform a graph into the given graph', async () => {
			const originalGraph = connected2Graph()
			const graph = largeGraph()
			const writeStub = sinon.createStubInstance(Writer)
			const write = writeStub as unknown as Writer

			Merge.override(graph, new Differ(originalGraph).diff(graph), {
				read: new Reader(originalGraph),
				write
			}, new Set())

			expect(writeStub.end).to.be.calledBefore(writeStub.insert)

			expect(write.clone).to.not.be.called
			expect(write.create).to.not.be.called
			expect(write.delete).to.not.be.called
			expect(write.end).to.be.calledOnceWith(1)
			expect(write.endAll).to.not.be.called
			expect(write.insert).to.be.callCount(6)
			expect(write.start).to.not.be.called
			expect(write.update).to.not.be.called
		})
		it('should transform a graph into the given graph 2', async () => {
			const originalGraph = connected2Graph()
			const graph = connected4Graph()
			const writeStub = sinon.createStubInstance(Writer)
			const write = writeStub as unknown as Writer

			Merge.override(graph, new Differ(originalGraph).diff(graph), {
				read: new Reader(originalGraph),
				write
			}, new Set())

			expect(writeStub.end).to.be.calledBefore(writeStub.insert)

			expect(write.clone).to.not.be.called
			expect(write.create).to.not.be.called
			expect(write.delete).to.not.be.called
			expect(write.end).to.be.calledOnceWith(1)
			expect(write.endAll).to.not.be.called
			expect(writeStub.insert.getCall(0)).to.be.calledWith(new Model('smp-2', {}, Simple))
			expect(writeStub.insert.getCall(1)).to.be.calledWith(new Model('smp-3', {}, Simple))
			expect(write.start).to.be.calledOnceWith(TestA, ['cpx-1', 'smp-1', 'smp-2', 'smp-3'])
			expect(write.update).to.not.be.called
		})
		it('should transform a graph into the given graph 3', async () => {
			const originalGraph = connected4Graph()
			const graph = connected2Graph()
			const writeStub = sinon.createStubInstance(Writer)
			const write = writeStub as unknown as Writer

			Merge.override(graph, new Differ(originalGraph).diff(graph), {
				read: new Reader(originalGraph),
				write
			}, new Set())

			expect(writeStub.delete).to.be.calledBefore(writeStub.create)
			expect(writeStub.end).to.be.calledBefore(writeStub.insert)

			expect(write.clone).to.not.be.called
			expect(write.create).to.not.be.called
			expect(write.delete).to.be.calledTwice
			expect(write.end).to.be.calledOnceWith(1)
			expect(write.endAll).to.not.be.called
			expect(writeStub.insert).to.not.be.called
			expect(write.start).to.be.calledOnceWith(TestA, ['cpx-1', 'smp-1'])
			expect(write.update).to.not.be.called
		})
		it('should reset a graph', async () => {
			const originalGraph = connected2Graph()
			const graph = new ModelGraph()
			const writeStub = sinon.createStubInstance(Writer)
			const write = writeStub as unknown as Writer

			Merge.override(graph, new Differ(originalGraph).diff(graph), {
				read: new Reader(originalGraph),
				write
			}, new Set())

			expect(writeStub.delete).to.be.calledBefore(writeStub.insert)
			expect(writeStub.end).to.be.calledBefore(writeStub.insert)

			expect(write.clone).to.not.be.called
			expect(write.create).to.not.be.called
			expect(writeStub.delete.getCall(0)).to.be.calledWith('cpx-1')
			expect(writeStub.delete.getCall(1)).to.be.calledWith('smp-1')
			expect(write.end).to.be.calledOnceWith(1)
			expect(write.endAll).to.not.be.called
			expect(write.insert).to.not.be.called
			expect(write.start).to.not.be.called
			expect(write.update).to.not.be.called
		})
	})
})