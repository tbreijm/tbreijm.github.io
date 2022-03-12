import {Change, ChangeType, Context} from '../datagraph'
import {ModelProperties, ModelType} from '../modelgraph'
import {Condition} from './Conditions'

export const condition = <M extends ModelProperties>(type: ModelType<M>): Condition => (
	change: Change,
	context: Context,
) =>
	change.type === ChangeType.UPDATE &&
	context.read.belongsTo(type, change.data.modelId)