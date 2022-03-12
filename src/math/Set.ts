export const clone = <T>(set: Set<T>): Set<T> => new Set<T>([...set])

export const diff = <T>(set1: Set<T>, set2: Set<T>): Set<T> =>
	new Set<T>([...set1].filter((_) => !set2.has(_)))

export const insert = <T>(set: Set<T>, item: T): Set<T> =>
	set.has(item) ? set : new Set<T>([item, ...set])

export const intersection = <T>(set1: Set<T>, set2: Set<T>): Set<T> =>
	new Set<T>([...set1].filter((_) => set2.has(_)))

export const remove = <T>(set: Set<T>, item: T): Set<T> =>
	set.has(item) ? new Set<T>([...set].filter((_) => _ !== item)) : set

export const replace = <T>(set: Set<T>, item: T, newItem: T): Set<T> =>
	set.has(item)
		? new Set([...[...set].filter((_) => _ !== item), newItem])
		: set

export const union = <T>(set1: Set<T>, set2: Set<T>): Set<T> =>
	new Set<T>([...set1, ...set2])
