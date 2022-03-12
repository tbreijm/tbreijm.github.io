import {expect} from 'chai'
import {describe} from 'mocha'
import {relationshipStarted} from '../../src/conditions/Conditions'
import {ChangeType, DataGraph} from '../../src/datagraph'
import {connected2Graph} from '../modelgraph/ModelGraph.values'
import {manifest} from '../modelgraph/Models.values'
import {TestA, TestB} from '../modelgraph/Relationship.values'

describe('Relationship Started Condition', () => {
	it('should return false if the change is not the correct type', () => {
		const context = new DataGraph(manifest, connected2Graph()).context

		const change = {
			type: ChangeType.CLONE,
			data: { newModelId: 'cpx-1' },
		}
		expect(relationshipStarted(TestA)(change, context)).to.be.false
	})
	it('should return false if the change model is not the correct type', () => {
		const context = new DataGraph(manifest, connected2Graph()).context

		const change = {
			type: ChangeType.START,
			data: { type: TestB },
		}
		expect(relationshipStarted(TestA)(change, context)).to.be.false
	})
	it('should return true when the conditions are met', () => {
		const context = new DataGraph(manifest, connected2Graph()).context

		const change = {
			type: ChangeType.START,
			data: { type: TestA },
		}
		expect(relationshipStarted(TestA)(change, context)).to.be.true
	})
})