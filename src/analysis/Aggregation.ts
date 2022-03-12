import {ModelProperties} from '../modelgraph'
import {Aggregation} from './index'
import {
	mean as meanOp,
	median as medianOp,
	quantileSeq,
	std
} from 'mathjs'

const countIf = (condition: (point: ModelProperties) => boolean): Aggregation<number> =>
	array => array.filter(_ => condition(_)).length

const count: Aggregation<number> = (array, retrieve) => countIf(() => true)(array, retrieve)

const diff: Aggregation<number> = (array, retrieve) => array.length >= 2
	? retrieve(array[1]) - retrieve(array[0]) : 0

const max: Aggregation<number> = (array, retrieve) => array.length > 0
	? Math.max(...array.map(_ => retrieve(_))) : 0

const mean: Aggregation<number> = (array, retrieve) => array.length > 0
	? meanOp(...array.map(_ => retrieve(_))) : 0

const median: Aggregation<number> = (array, retrieve) => array.length > 0
	? medianOp(...array.map(_ => retrieve(_))) : 0

const min: Aggregation<number> = (array, retrieve) => array.length > 0
	? Math.min(...array.map(_ => retrieve(_))) : 0

const percentile = (probability: number): Aggregation<number> => (array, retrieve) =>
	array.length > 0 ? quantileSeq(array.map(_ => retrieve(_)), probability) as unknown as number : 0

const standardDeviation: Aggregation<number> = (array, retrieve) =>
	array.length > 0 ? std(...array.map(_ => retrieve(_))) : 0

const sumIf = (condition: (point: ModelProperties) => boolean): Aggregation<number> => (array, retrieve) =>
	array.filter(_ => condition(_)).map(_ => retrieve(_)).reduce((a,b) => a+b, 0)
const sum: Aggregation<number> = (array, retrieve) => sumIf(() => true)(array, retrieve)

export {
	count,
	countIf,
	diff,
	max,
	mean,
	median,
	min,
	percentile,
	standardDeviation,
	sum,
	sumIf,
}