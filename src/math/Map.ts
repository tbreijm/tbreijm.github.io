export const clean = <T, U>(map: Map<T, U>, func: (u: U) => boolean): Map<T, U> =>
	[...map.keys()].reduce(
		(result, key) =>
			func(map.get(key)!) ? result : insert(result, key, map.get(key)!),
		new Map(),
	)

export const clone = <T, U>(map: Map<T, U>): Map<T, U> => union(map)

export const insert = <T, U>(map: Map<T, U>, key: T, value: U): Map<T, U> => {
	map.set(key, value)
	return map
}

export const remove = <T, U>(map: Map<T, U>, key: T): Map<T, U> => {
	map.delete(key)
	return map
}

export const union = <T, U>(...maps: Map<T, U>[]): Map<T, U> => {
	const result = new Map<T, U>()

	for (const map of maps) {
		for (const entry of map.entries()) {
			result.set(entry[0], entry[1])
		}
	}

	return result
}
