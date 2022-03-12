import {evaluate as evaluateOp} from 'mathjs'
import {Attribute, ModelProperties} from '../modelgraph'
import {Mapping, Aggregations, Expansions} from './index'

const {diff, mean} = Aggregations
const {series} = Expansions

type Retrieval<T> = (point: ModelProperties) => T

const map = <T extends Attribute>(lambda: (value: T) => T, retrieve: Retrieval<T>): Mapping<T> =>
	array => array.map(_ => lambda(retrieve(_)))

const ceil = (retrieve: Retrieval<number>): Mapping<number> =>
	map<number>(_ => Math.ceil(_), retrieve)

const delta = (retrieve: Retrieval<number>): Mapping<number> =>
	array => series(1)(array).map(_ => diff(_, retrieve))

const evaluate = (expression: string, scope: (point: ModelProperties) => Record<string, number>): Mapping<number> =>
	array => array.map(_ => evaluateOp(expression, scope(_)))

const floor = (retrieve: Retrieval<number>): Mapping<number> =>
	map<number>(_ => Math.floor(_), retrieve)

const movingAverage = (window: number, retrieve: Retrieval<number>): Mapping<number> =>
	array => series(window)(array).map(_ => mean(_, retrieve))

export {
	map,
	ceil,
	delta,
	evaluate,
	floor,
	movingAverage
}