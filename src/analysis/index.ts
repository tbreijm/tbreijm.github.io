import {Attribute, ModelProperties} from '../modelgraph'
import * as Aggregations from './Aggregation'
import * as Expansions from './Expansion'
import * as Mappings from './Mapping'

export type Aggregation<T extends Attribute> = (array: ModelProperties[], retrieve: (point: ModelProperties) => T) => T
export type Expansion = (array: ModelProperties[]) => ModelProperties[][]
export type Mapping<T extends Attribute> = (array: ModelProperties[]) => T[]

export {
	Aggregations,
	Expansions,
	Mappings,
}