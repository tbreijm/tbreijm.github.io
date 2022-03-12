const not = (value: boolean) => !value

const arrayEqual = <T>(array1: T[], array2: T[]): boolean =>
	array1.length === array2.length && array1.every((_, index) => equal(_, array2[index]))

const setEqual = <T>(set1: Set<T>, set2: Set<T>): boolean =>
	arrayEqual([...set1].sort(), [...set2].sort())

const mapEqual = <T, U>(map1: Map<T, U>, map2: Map<T, U>): boolean => {
	const mapKeys1 = [...map1.keys()].sort()
	const mapKeys2 = [...map2.keys()].sort()

	return arrayEqual(mapKeys1, mapKeys2) && mapKeys1.every((_) => equal(map1.get(_), map2.get(_)))
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
const equals = (a: any, b: any): boolean => {
	if (a === b) return true

	if (a && b && typeof a === 'object' && typeof b === 'object') {
		if (not(a.constructor === b.constructor)) {
			return false
		}

		if (a instanceof Set && b instanceof Set) {
			return setEqual(a, b)
		}

		if (a instanceof Map && b instanceof Map) {
			return mapEqual(a, b)
		}

		if (Array.isArray(a) && Array.isArray(b)) {
			return arrayEqual(a, b)
		}

		if (a.constructor === RegExp) {
			return a.source === b.source && a.flags === b.flags
		}

		if (not(a.valueOf === Object.prototype.valueOf)) {
			return a.valueOf() === b.valueOf()
		}

		if (not(a.toString === Object.prototype.toString)) {
			return a.toString() === b.toString()
		}

		const aKeys = Object.keys(a).sort()
		const bKeys = Object.keys(b).sort()

		if (arrayEqual(aKeys, bKeys)) {
			return aKeys.every(_ => equal(a[_], b[_]))
		} else {
			return false
		}
	}

	// true if both NaN, false otherwise
	return (a!==a && b!==b)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const equal = (...entities: any[]): boolean => {
	if (entities.length <= 1) return true
	const [head, ...tail] = entities
	return tail.every(_ => equals(head, _))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const notEqual = (...entities: any[]): boolean => !equal(...entities)