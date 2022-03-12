import { Model, ModelProperties } from '../modelgraph'

export type ModelOrId<T extends ModelProperties> = Model<T> | string | undefined;
export type ModelOrIds<T extends ModelProperties> =
  | ModelOrId<T>
  | ModelOrId<T>[];

export const sanitise = (modelOrId: ModelOrId<any>): string | undefined => {
	if (modelOrId === undefined) {
		return undefined
	}

	if (typeof modelOrId === 'object' && 'id' in modelOrId) {
		return modelOrId.id
	}

	return modelOrId
}

export const sanitiseAll = (modelOrIds: ModelOrIds<any>): string[] => {
	if (Array.isArray(modelOrIds)) {
		return modelOrIds
			.map((modelOrId) => sanitise(modelOrId))
			.filter((modelId) => modelId !== undefined)
			.map((modelId) => modelId!)
	}

	return sanitiseAll([modelOrIds])
}

export const server = (modelOrId: ModelOrId<any>): number | undefined => {
	const id = sanitise(modelOrId)

	if (id === undefined) {
		return undefined
	}

	const parts = id.split('-')

	if (parts.length === 2) {
		return parseInt(parts[1], 10)
	}

	return undefined
}