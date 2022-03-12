import {Expansion} from './index'

const series = (lookBack: number): Expansion => array => {
	if (lookBack === 0) return array.map(_ => [_])
	if (lookBack >= array.length-1) return [array]

	return array.slice(0, -(lookBack)).map((_, index) => array.slice(index, index+lookBack+1))
}

export {
	series
}