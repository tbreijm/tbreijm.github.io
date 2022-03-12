import {Change, MutableContext} from '../datagraph'
import {ModelProperties, ModelType, RelationshipKey, RelationshipType} from '../modelgraph'
import {Action} from './index'

export const action = <T extends ModelProperties, U extends RelationshipKey>(
	type: ModelType<T>, relationships?: RelationshipType<U>[]
): Action =>
	(change: Change, context: MutableContext): void => {
		context.write.endAll(
			change.data.modelIds.filter((_: string) =>
				context.read.belongsTo(type, _),
			)[0],
			relationships,
		)
	}