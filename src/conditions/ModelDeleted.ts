import {Change, ChangeType} from '../datagraph'
import {ModelProperties, ModelType} from '../modelgraph'
import {Condition} from './Conditions'

export const condition = <M extends ModelProperties>(type: ModelType<M>): Condition => (
	change: Change,
) => change.type === ChangeType.DELETE && change.data.type === type