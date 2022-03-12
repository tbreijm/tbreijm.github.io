import {Change, MutableContext} from '../datagraph'
import {ModelProperties, ModelType} from '../modelgraph'
import {Action} from './index'

type Template<T extends ModelProperties> = {
	type: ModelType<T>
	properties: T
}

export const action = <T extends ModelProperties>(generator: () => Template<T>): Action => (
	change: Change,
	context: MutableContext,
): void => {
	const {type, properties} = generator()
	context.write.create(type, properties)
}