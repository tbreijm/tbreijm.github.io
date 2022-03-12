import {Diff} from '../../src/datagraph'

export const emptyDiff = (): Diff => ({
	models: {
		types: {
			mine: new Set(),
			their: new Set()
		},
		entities: new Map()
	},
	relationships: {
		types: {
			mine: new Set(),
			their: new Set()
		},
		entities: new Map()
	}
})