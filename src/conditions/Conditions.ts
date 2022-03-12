import {Change, Context} from '../datagraph'
import {condition as modelCloned} from './ModelCloned'
import {condition as modelCreated} from './ModelCreated'
import {condition as modelDeleted} from './ModelDeleted'
import {condition as modelInserted} from './ModelInserted'
import {condition as modelUpdated} from './ModelUpdated'
import {condition as relationshipEnded} from './RelationshipEnded'
import {condition as relationshipStarted} from './RelationshipStarted'

export type Condition = (change: Change, context: Context) => boolean;

export {
	modelCloned,
	modelCreated,
	modelDeleted,
	modelInserted,
	modelUpdated,
	relationshipEnded,
	relationshipStarted,
}

export function or(...conditions: Condition[]): Condition {
	return (change: Change, context: Context) =>
		conditions.some((_) => _(change, context))
}

export function and(...conditions: Condition[]): Condition {
	return (change: Change, context: Context) =>
		conditions.every((_) => _(change, context))
}
