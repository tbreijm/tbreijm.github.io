import {expect} from 'chai'
import {describe} from 'mocha'
import {modelCreated} from '../../src/conditions/Conditions'
import {ChangeType, DataGraph} from '../../src/datagraph'
import {Complex} from '../modelgraph/Model.values'
import {connected2Graph} from '../modelgraph/ModelGraph.values'
import {manifest} from '../modelgraph/Models.values'

describe('Model Created Condition', () => {
	it('should return false if the change is not the correct type', () => {
		const context = new DataGraph(manifest, connected2Graph()).context

		const change = {
			type: ChangeType.CLONE,
			data: { newModelId: 'cpx-1' },
		}
		expect(modelCreated(Complex)(change, context)).to.be.false
	})
	it('should return false if the change model is not the correct type', () => {
		const context = new DataGraph(manifest, connected2Graph()).context

		const change = {
			type: ChangeType.CREATE,
			data: { newModelId: 'smp-1' },
		}
		expect(modelCreated(Complex)(change, context)).to.be.false
	})
	it('should return true when the conditions are met', () => {
		const context = new DataGraph(manifest, connected2Graph()).context

		const change = {
			type: ChangeType.CREATE,
			data: { newModelId: 'cpx-1' },
		}
		expect(modelCreated(Complex)(change, context)).to.be.true
	})
})