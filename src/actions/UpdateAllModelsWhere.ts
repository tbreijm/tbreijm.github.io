import {Change, Context, ModelOrId, MutableContext} from '../datagraph'
import {ModelProperties, ModelType} from '../modelgraph'
import {Action} from './index'

export const action = <T extends ModelProperties>(type: ModelType<T>, condition: (id: ModelOrId<T>, context: Context) => boolean, update: (properties: T) => Partial<T>): Action => (
    change: Change,
    context: MutableContext,
): void => {
    const updatable = context.read.allModels(type).filter(_ => condition(_, context))
    
    for (const model of updatable) {
        context.write.update(model, update(model.properties))
    }
}