import {expect} from 'chai'
import {describe} from 'mocha'
import {modelDeleted} from '../../src/conditions/Conditions'
import {ChangeType, DataGraph} from '../../src/datagraph'
import {Complex, Simple} from '../modelgraph/Model.values'
import {connected2Graph} from '../modelgraph/ModelGraph.values'
import {manifest} from '../modelgraph/Models.values'

describe('Model Deleted Condition', () => {
	it('should return false if the change is not the correct type', () => {
		const context = new DataGraph(manifest, connected2Graph()).context

		const change = {
			type: ChangeType.CLONE,
			data: { newModelId: 'cpx-1' },
		}
		expect(modelDeleted(Complex)(change, context)).to.be.false
	})
	it('should return false if the change model is not the correct type', () => {
		const context = new DataGraph(manifest, connected2Graph()).context

		const change = {
			type: ChangeType.DELETE,
			data: { type: Simple, modelId: 'smp-1', properties: {} },
		}
		expect(modelDeleted(Complex)(change, context)).to.be.false
	})
	it('should return true when the conditions are met', () => {
		const context = new DataGraph(manifest, connected2Graph()).context

		const change = {
			type: ChangeType.DELETE,
			data: { type: Complex, modelId: 'cpx-1', properties: {value: 'A'} }
		}
		expect(modelDeleted(Complex)(change, context)).to.be.true
	})
})