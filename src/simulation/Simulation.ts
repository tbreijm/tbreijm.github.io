import {Action} from '../actions'
import {Condition} from '../conditions/Conditions'
import {Context, DataGraph, MutableContext} from '../datagraph'
import {Transmission} from '../transmission'

export type Simulation = {
	initialState: DataGraph
	progression: (context: MutableContext) => void
	applications: {condition: Condition, action: Action}[]
	transmissions: Transmission<any>[]
	termination: (context: Context) => boolean
}