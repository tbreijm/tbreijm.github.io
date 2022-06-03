import {Change, MutableContext} from '../datagraph'
import {ModelProperties, ModelType} from '../modelgraph'
import {Action} from './index'

export const action = <T extends ModelProperties>(type: ModelType<T>, update: (properties: T) => Partial<T>): Action => (
    change: Change,
    context: MutableContext,
): void => {
    for (const model of context.read.allModels(type)) {
        context.write.update(model, update(model.properties))
    }
}