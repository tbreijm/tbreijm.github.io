import { ModelType, RelationshipType } from './index'

export interface Manifest {
  modelType(key: string): ModelType<any> | undefined;
  modelName(type: ModelType<any>): string | undefined;
  modelIdPrefix(type: ModelType<any>): string;

  relationshipType(key: string): RelationshipType<any> | undefined;
  relationshipName(type: RelationshipType<any>): string | undefined;
}
