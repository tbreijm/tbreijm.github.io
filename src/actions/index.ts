import {Change, MutableContext} from '../datagraph'
import {action as createModel} from './CreateModel'
import {action as deleteModel} from './DeleteModel'
import {action as endAllModel} from './EndAllModel'

export type Action = (change: Change, context: MutableContext) => void

export {
	createModel,
	deleteModel,
	endAllModel,
}