import { ModelGraph } from '../../src/modelgraph'
import { TestA, TestB } from './Relationship.values'
import { Complex, Optional, Simple } from './Model.values'
import { Model, ModelType, Relationship } from '../../src/modelgraph'

export const singleComplexNodeGraph = (): ModelGraph => {
	const graph = new ModelGraph()
	graph.create(Complex, 'cpx', { value: 'A' })
	return graph
}

export const singleComplexNodeGraph2 = (): ModelGraph => {
	const graph = new ModelGraph()
	graph.create(Complex, 'cpx', { value: 'B' })
	return graph
}

export const singleOptionalNodeGraph = (): ModelGraph => {
	const graph = new ModelGraph()
	graph.create(Optional, 'opt', {})
	return graph
}

export const singleSimpleNodeGraph = (): ModelGraph => {
	const graph = new ModelGraph()
	graph.create(Simple, 'smp', {})
	return graph
}

export const connected2Graph = (): ModelGraph => {
	const graph = new ModelGraph()

	const model1 = graph.create(Complex, 'cpx', { value: 'A' })!
	const model2 = graph.create(Simple, 'smp', {})!
	graph.start(TestA, [model1, model2])

	return graph
}

export const connected2GraphB = (): ModelGraph => {
	const graph = new ModelGraph()

	const model1 = graph.create(Complex, 'cpx', { value: 'B' })!
	const model2 = graph.create(Simple, 'smp', {})!
	graph.start(TestA, [model1, model2])

	return graph
}

export const dualConnected2Graph = (): ModelGraph => {
	const graph = new ModelGraph()

	const model1 = graph.create(Complex, 'cpx', { value: 'A' })!
	const model2 = graph.create(Simple, 'smp', {})!
	graph.start(TestA, [model1, model2])
	graph.start(TestB, [model1, model2])

	return graph
}

export const connected3Graph = (): ModelGraph => {
	const graph = new ModelGraph()

	const model1 = graph.create(Complex, 'cpx', { value: 'A' })!
	const model2 = graph.create(Complex, 'cpx', { value: 'B' })!
	const model3 = graph.create(Simple, 'smp', {})!
	graph.start(TestA, [model1, model3])
	graph.start(TestA, [model2, model3])

	return graph
}

export const connected4Graph = (): ModelGraph => {
	const graph = new ModelGraph()

	const model1 = graph.create(Complex, 'cpx', { value: 'A' })!
	const model2 = graph.create(Simple, 'smp', {})!
	const model3 = graph.create(Simple, 'smp', {})!
	const model4 = graph.create(Simple, 'smp', {})!
	graph.start(TestA, [model1, model2, model3, model4])

	return graph
}

export const unconnected2Graph = (): ModelGraph => {
	const graph = new ModelGraph()

	graph.create(Complex, 'cpx', { value: 'A' })
	graph.create(Simple, 'smp', {})

	return graph
}

export const largeGraph = (): ModelGraph => {
	const graph = new ModelGraph()

	graph.create(Complex, 'cpx', { value: 'A' })
	graph.create(Complex, 'cpx', { value: 'B' })
	graph.create(Simple, 'smp', {})
	graph.create(Simple, 'smp', {})
	graph.create(Optional, 'opt', {})
	graph.create(Optional, 'opt', { value: 1 })
	graph.create(Optional, 'opt', { value: 2 })
	graph.create(Optional, 'opt', { value: 3 })

	return graph
}

export const indirectGraph = (): ModelGraph => {
	const graph = new ModelGraph()
	graph.create(Complex, 'cpx', { value: 'A' })
	graph.create(Simple, 'smp', {})
	graph.create(Optional, 'opt', {})
	graph.start(TestA, ['cpx-1', 'smp-1'])
	graph.start(TestB, ['smp-1', 'opt-1'])
	return graph
}

export const migratableGraph = (): ModelGraph => {
	const graph = new ModelGraph()
	graph.create(Complex, 'cpx', { value: 'A' })
	graph.create(Complex, 'cpx', { value: 'B' })
	graph.create(Simple, 'smp', {})
	graph.create(Simple, 'smp', {})
	graph.create(Simple, 'smp', {})
	graph.create(Simple, 'smp', {})
	graph.start(TestA, ['cpx-1', 'smp-1'])
	graph.start(TestA, ['cpx-1', 'smp-2'])
	graph.start(TestA, ['cpx-2', 'smp-3'])
	graph.start(TestA, ['cpx-2', 'smp-4'])
	return graph
}

export const tripleGraph = (): ModelGraph => {
	const graph = new ModelGraph()
	graph.create(Complex, 'cpx', { value: 'A' })
	graph.create(Simple, 'smp', {})
	graph.create(Simple, 'smp', {})
	graph.create(Optional, 'opt', {})
	graph.start(TestA, ['cpx-1', 'smp-1', 'opt-1'])
	return graph
}

export const relationships0 = (): Relationship<TestA> => new Relationship(
	undefined,
	[],
	undefined,
	new Map<ModelType<any>, Model<any> | Model<any>[]>()
)

export const relationships0a = (): Relationship<TestA> => new Relationship(
	undefined,
	[],
	TestA,
	new Map<ModelType<any>, Model<any> | Model<any>[]>()
)

export const relationships0b = (): Relationship<TestA> => new Relationship(
	undefined,
	[],
	TestB,
	new Map<ModelType<any>, Model<any> | Model<any>[]>()
)

export const relationships1 = (): Relationship<TestA> => new Relationship(
	1,
	['cpx-1', 'smp-1'],
	TestA,
	new Map<ModelType<any>, Model<any> | Model<any>[]>([
		[Complex, new Model('cpx-1', { value: 'A' }, Complex)],
		[Simple, new Model('smp-1', {}, Simple)]
	])
)

export const relationships1b = (): Relationship<TestA> => new Relationship(
	2,
	['cpx-1', 'smp-1'],
	TestB,
	new Map<ModelType<any>, Model<any> | Model<any>[]>([
		[Complex, new Model('cpx-1', { value: 'A' }, Complex)],
		[Simple, new Model('smp-1', {}, Simple)]
	])
)

export const relationships1c = (): Relationship<TestA> => new Relationship(
	2,
	['cpx-2', 'smp-1'],
	TestA,
	new Map<ModelType<any>, Model<any> | Model<any>[]>([
		[Complex, new Model('cpx-2', { value: 'B' }, Complex)],
		[Simple, new Model('smp-1', {}, Simple)]
	])
)

export const relationships1d = (): Relationship<TestA> => new Relationship(
	2,
	['cpx-1', 'smp-2'],
	TestA,
	new Map<ModelType<any>, Model<any> | Model<any>[]>([
		[Complex, new Model('cpx-1', { value: 'A' }, Complex)],
		[Simple, new Model('smp-2', {}, Simple)]
	])
)

export const relationships1_array = (): Relationship<TestA> => new Relationship(
	1,
	['smp-1', 'cpx-1', 'cpx-2'],
	TestA,
	new Map<ModelType<any>, Model<any> | Model<any>[]>([
		[Simple, new Model('smp-1', {}, Simple)],
		[Complex, [
			new Model('cpx-1', { value: 'A' }, Complex),
			new Model('cpx-2', { value: 'B' }, Complex)
		]]
	])
)

export const relationships1_4 = (): Relationship<TestA> => new Relationship(
	1,
	['cpx-1', 'smp-1', 'smp-2', 'smp-3'],
	TestA,
	new Map<ModelType<any>, Model<any> | Model<any>[]>([
		[Complex, new Model('cpx-1', { value: 'A' }, Complex)],
		[Simple, [
			new Model('smp-1', {}, Simple),
			new Model('smp-2', {}, Simple),
			new Model('smp-3', {}, Simple)
		]]
	])
)

export const relationships2a = (): Relationship<TestA>[] => [
	new Relationship(
		1,
		['cpx-1', 'smp-1'],
		TestA,
		new Map<ModelType<any>, Model<any> | Model<any>[]>([
			[Complex, new Model('cpx-1', { value: 'A' }, Complex)],
			[Simple, new Model('smp-1', {}, Simple)]
		])
	),
	new Relationship(
		2,
		['cpx-1', 'smp-1'],
		TestB,
		new Map<ModelType<any>, Model<any> | Model<any>[]>([
			[Complex, new Model('cpx-1', { value: 'A' }, Complex)],
			[Simple, new Model('smp-1', {}, Simple)]
		])
	)
]

export const relationships2b = (): Relationship<TestA>[] => [
	new Relationship(
		2,
		['cpx-1', 'smp-1'],
		TestB,
		new Map<ModelType<any>, Model<any> | Model<any>[]>([
			[Complex, new Model('cpx-1', { value: 'A' }, Complex)],
			[Simple, new Model('smp-1', {}, Simple)]
		])
	),
	new Relationship(
		1,
		['cpx-1', 'smp-1'],
		TestA,
		new Map<ModelType<any>, Model<any> | Model<any>[]>([
			[Complex, new Model('cpx-1', { value: 'A' }, Complex)],
			[Simple, new Model('smp-1', {}, Simple)]
		])
	)
]

export const migratableRelationships = (): Relationship<TestA>[] => [
	new Relationship(
		1,
		['cpx-1', 'smp-1'],
		TestA,
		new Map<ModelType<any>, Model<any> | Model<any>[]>([
			[Complex, new Model('cpx-1', { value: 'A' }, Complex)],
			[Simple, new Model('smp-1', {}, Simple)]
		])
	),
	new Relationship(
		2,
		['cpx-1', 'smp-2'],
		TestA,
		new Map<ModelType<any>, Model<any> | Model<any>[]>([
			[Complex, new Model('cpx-1', { value: 'A' }, Complex)],
			[Simple, new Model('smp-2', {}, Simple)]
		])
	),
	new Relationship(
		3,
		['smp-3', 'cpx-1'],
		TestA,
		new Map<ModelType<any>, Model<any> | Model<any>[]>([
			[Complex, new Model('cpx-1', { value: 'A' }, Complex)],
			[Simple, new Model('smp-3', {}, Simple)]
		])
	),
	new Relationship(
		4,
		['smp-4', 'cpx-1'],
		TestA,
		new Map<ModelType<any>, Model<any> | Model<any>[]>([
			[Complex, new Model('cpx-1', { value: 'A' }, Complex)],
			[Simple, new Model('smp-4', {}, Simple)]
		])
	),
]

export const swappedRelationships = (): Relationship<TestA>[] => [
	new Relationship(
		1,
		['smp-3', 'cpx-1'],
		TestA,
		new Map<ModelType<any>, Model<any> | Model<any>[]>([
			[Simple, new Model('smp-3', {}, Simple)],
			[Complex, new Model('cpx-1', { value: 'A' }, Complex)]
		])
	),
	new Relationship(
		2,
		['smp-4', 'cpx-1'],
		TestA,
		new Map<ModelType<any>, Model<any> | Model<any>[]>([
			[Simple, new Model('smp-4', {}, Simple)],
			[Complex, new Model('cpx-1', { value: 'A' }, Complex)]
		])
	),
	new Relationship(
		3,
		['smp-1', 'cpx-2'],
		TestA,
		new Map<ModelType<any>, Model<any> | Model<any>[]>([
			[Simple, new Model('smp-1', {}, Simple)],
			[Complex, new Model('cpx-2', { value: 'B' }, Complex)]
		])
	),
	new Relationship(
		4,
		['smp-2', 'cpx-2'],
		TestA,
		new Map<ModelType<any>, Model<any> | Model<any>[]>([
			[Simple, new Model('smp-2', {}, Simple)],
			[Complex, new Model('cpx-2', { value: 'B' }, Complex)]
		])
	),
]

export const swappedRelationships2 = (): Relationship<TestA>[] => [
	new Relationship(
		1,
		['cpx-1', 'smp-1'],
		TestA,
		new Map<ModelType<any>, Model<any> | Model<any>[]>([
			[Complex, new Model('cpx-1', { value: 'A' }, Complex)],
			[Simple, new Model('smp-1', {}, Simple)]
		])
	),
	new Relationship(
		2,
		['cpx-1', 'smp-2'],
		TestA,
		new Map<ModelType<any>, Model<any> | Model<any>[]>([
			[Complex, new Model('cpx-1', { value: 'A' }, Complex)],
			[Simple, new Model('smp-2', {}, Simple)]
		])
	),
	new Relationship(
		3,
		['smp-3'],
		TestA,
		new Map<ModelType<any>, Model<any> | Model<any>[]>([
			[Simple, new Model('smp-3', {}, Simple)]
		])
	),
	new Relationship(
		4,
		['smp-4'],
		TestA,
		new Map<ModelType<any>, Model<any> | Model<any>[]>([
			[Simple, new Model('smp-4', {}, Simple)]
		])
	),
]