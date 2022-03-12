import {ModelProperties, Models, ModelType, RelationshipKey, RelationshipType} from '../../src/modelgraph'
import {Manifest} from '../../src/modelgraph/Manifest'
import {Complex, Optional, Simple} from './Model.values'
import {TestA, TestB} from './Relationship.values'

export const emptyModels = (): Models => new Models()

export const simpleModels = (): Models => {
	const models = new Models()
	models.create(Simple, 'smp', {}, 1)
	return models
}

export const complexModelsA = (): Models => {
	const models = new Models()
	models.create(Complex, 'cpx', {value: 'A'}, 1)
	return models
}

export const complexModelsB = (): Models => {
	const models = new Models()
	models.create(Complex, 'cpx', {value: 'B'}, 1)
	return models
}

export const manifest = new class implements Manifest {
	readonly modelTypes = new Map<string, ModelType<any>>([
		['Optional', Optional],
		['Complex', Complex],
		['Simple', Simple]
	])
	readonly modelNames = new Map<ModelType<any>, string>([
		[Optional, 'Optional'],
		[Complex, 'Complex'],
		[Simple, 'Simple']
	])
	readonly modelIdPrefixes = new Map<ModelType<any>, string>([
		[Optional, 'opt'],
		[Complex, 'cpx'],
		[Simple, 'smp']
	])

	readonly relationshipTypes = new Map<string, RelationshipType<any>>([
		['TestA', TestA],
		['TestB', TestB],
	])
	readonly relationshipNames = new Map<RelationshipType<any>, string>([
		[TestA, 'TestA'],
		[TestB, 'TestB'],
	])

	modelName(type: ModelType<ModelProperties>): string | undefined {
		return this.modelNames.get(type)
	}

	modelType(key: string): ModelType<ModelProperties> | undefined {
		return this.modelTypes.get(key)
	}

	modelIdPrefix(type: ModelType<ModelProperties>): string {
		return this.modelIdPrefixes.get(type) || 'undefined'
	}

	relationshipName(type: RelationshipType<RelationshipKey>): string | undefined {
		return this.relationshipNames.get(type)
	}

	relationshipType(key: string): RelationshipType<RelationshipKey> | undefined {
		return this.relationshipTypes.get(key)
	}
}