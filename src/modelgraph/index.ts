export type Attribute = number | boolean | string | undefined

export type ModelProperties = Record<string, Attribute>

export interface RelationshipKey {
  key: string;
}

export type ModelType<T extends ModelProperties> = new (...args: any[]) => T;
export type RelationshipType<T extends RelationshipKey> = new (
  ...args: any[]
) => T;

export { default as Model } from './Model'
export { default as ModelStore } from './ModelStore'
export { default as Models } from './Models'

export { default as Relationship } from './Relationship'
export { default as RelationshipStore } from './RelationshipStore'
export { default as Relationships } from './Relationships'

export { default as ModelGraph } from './ModelGraph'
