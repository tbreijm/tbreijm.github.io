import {equal} from '../Equals'
import {ModelProperties, ModelType} from './index'

export default class Model<T extends ModelProperties> {
	readonly id: string
	readonly properties: T
	readonly type: ModelType<T>

	constructor(id: string, properties: T, type: new (...args: any[]) => T) {
		this.id = id
		this.properties = {
			...properties,
		}
		this.type = type
	}

	static equals(model1: Model<any>, model2: Model<any>): boolean {
		return (
			model1.id === model2.id &&
			equal(model1.properties, model2.properties) &&
			model1.type === model2.type
		)
	}
}
