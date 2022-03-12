import {Change, MutableContext} from '../datagraph'
import {ModelProperties, ModelType} from '../modelgraph'
import {Action} from './index'

export const action = <T extends ModelProperties>(type: ModelType<T>): Action =>
	(change: Change, context: MutableContext,): void => {
		context.write.delete(
			change.data.modelIds.filter((_: string) =>
				context.read.belongsTo(type, _),
			)[0],
		)
	}