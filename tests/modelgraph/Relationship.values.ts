import { RelationshipKey, Relationships } from '../../src/modelgraph'

export class TestA implements RelationshipKey {
  key = 'test-a'
}

export class TestB implements RelationshipKey {
  key = 'test-b'
}

export const emptyRelationships = (): Relationships => new Relationships()

export const testARelationships = (): Relationships => {
	const relationships = new Relationships()
	relationships.start(TestA, 1)
	return relationships
}

export const testBRelationships1 = (): Relationships => {
	const relationships = new Relationships()
	relationships.start(TestB, 1)
	return relationships
}

export const testBRelationships2 = (): Relationships => {
	const relationships = new Relationships()
	relationships.start(TestB, 2)
	return relationships
}

export const testRelationships = (): Relationships => {
	const relationships = new Relationships()
	relationships.start(TestA, 1)
	relationships.start(TestB, 2)
	return relationships
}