import {RelationshipType} from '../modelgraph'
import {ModelOrIds, sanitiseAll} from './ModelOrId'

export enum ChangeType {
	CLONE = 'clone',
	CREATE = 'create',
	DELETE = 'delete',
	END = 'end',
	INSERT = 'insert',
	START = 'start',
	UPDATE = 'update',
}

export type Change = {
	type: ChangeType;
	data: { [key: string]: any };
};

export const collectionChanges = (change: Change): boolean => {
	switch (change.type) {
	case ChangeType.END:
		return false
	case ChangeType.START:
		return false
	case ChangeType.UPDATE:
		return false
	default:
		return true
	}
}

export const modelChanges = (change: Change): boolean => {
	switch (change.type) {
	case ChangeType.END:
		return false
	case ChangeType.START:
		return false
	default:
		return true
	}
}

const modelChanged = (modelId: string, change: Change) => {
	switch (change.type) {
	case ChangeType.CLONE:
	case ChangeType.CREATE:
	case ChangeType.INSERT:
		return change.data.newModelId === modelId
	case ChangeType.DELETE:
	case ChangeType.UPDATE:
		return change.data.modelId === modelId
	default:
		return false
	}
}

export const specificModelChanges = (modelId: string | undefined) => (change: Change): boolean => {
	if (modelId === undefined) return false
	return modelChanged(modelId, change)
}

export const specificModelsChanges = (modelIds: ModelOrIds<any>) => (change: Change): boolean => {
	return sanitiseAll(modelIds).some((_) => modelChanged(_, change))
}

export const pathChanges = (change: Change): boolean => {
	switch (change.type) {
	case ChangeType.CREATE:
		return false
	case ChangeType.INSERT:
		return false
	case ChangeType.UPDATE:
		return false
	default:
		return true
	}
}

export const relationshipChanges = (change: Change): boolean => {
	switch (change.type) {
	case ChangeType.END:
	case ChangeType.START:
		return true
	default:
		return false
	}
}

export const specificRelationshipChanges = (types: RelationshipType<any> | RelationshipType<any>[]) =>
	(change: Change): boolean => {
		switch (change.type) {
		case ChangeType.END:
		case ChangeType.START:
			return new Set(Array.isArray(types) ? types : [types]).has(change.data.type)
		default:
			return false
		}
	}