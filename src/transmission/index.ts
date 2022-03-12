import {Context} from '../datagraph'
import {Attribute} from '../modelgraph'

export type Transmissible = Attribute | Record<string, unknown>

export type Transmission<T extends Transmissible> = {
	send: (data: T) => void
	serialise: (context: Context) => T
}