import { ModelType, RelationshipType } from '../modelgraph'
import * as Merge from './Merge'

export { Change, ChangeType } from './Change'
export { default as DataGraph } from './DataGraph'
export { default as Differ } from './Differ'
export { Merge }
export { ModelOrId, ModelOrIds, sanitise, sanitiseAll, server } from './ModelOrId'
export { default as Reader } from './Reader'
export { default as Writer } from './Writer'

import Reader from './Reader'
import Writer from './Writer'

export type Context = {
  read: Reader;
};

export type MutableContext = {
  read: Reader;
  write: Writer;
};

export type Diff = {
  models: {
    types: {
      mine: Set<ModelType<any>>;
      their: Set<ModelType<any>>;
    };
    entities: Map<
      ModelType<any>,
      { mine: Set<string>; their: Set<string>; changed: Set<string> }
    >;
  };
  relationships: {
    types: {
      mine: Set<RelationshipType<any>>;
      their: Set<RelationshipType<any>>;
    };
    entities: Map<
      RelationshipType<any>,
      {
        mine: Set<number>;
        their: Set<number>;
      }
    >;
  };
};
