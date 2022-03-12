import {Change, ChangeType} from '../datagraph'
import {RelationshipKey, RelationshipType} from '../modelgraph'
import {Condition} from './Conditions'

export const condition = <R extends RelationshipKey>(type: RelationshipType<R>): Condition => (
	change: Change,
) => change.type === ChangeType.START && change.data.type === type