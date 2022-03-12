import {Attribute, ModelProperties, ModelStore} from '../../src/modelgraph'

export class Simple implements ModelProperties {
	[key: string]: Attribute
}
export class Complex implements ModelProperties {
	[key: string]: Attribute
	constructor(readonly value: string) {}
}
export class Optional implements ModelProperties {
	[key: string]: Attribute
	constructor(readonly value?: number) {}
}

export const emptyStore = (): ModelStore<Simple> => new ModelStore('smp', Simple)
export const emptyComplexStore = (): ModelStore<Complex> => new ModelStore('cpx', Complex)