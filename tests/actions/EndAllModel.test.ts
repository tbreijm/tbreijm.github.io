import chai, {expect} from 'chai'

import {describe} from 'mocha'
import * as sinon from 'sinon'
import sinonChai from 'sinon-chai'
import {endAllModel} from '../../src/actions'
import {ChangeType, DataGraph} from '../../src/datagraph'
import {Simple} from '../modelgraph/Model.values'
import {dualConnected2Graph} from '../modelgraph/ModelGraph.values'
import {manifest} from '../modelgraph/Models.values'
import {TestA, TestB} from '../modelgraph/Relationship.values'

chai.use(sinonChai)

describe('End All Model Action', () => {
	it('should end all relationships for the model of the correct type in the ended relationship', () => {
		const context = new DataGraph(manifest, dualConnected2Graph()).mutable
		const writeStub = sinon.stub(context.write, 'endAll')

		const change = {
			type: ChangeType.END,
			data: { type: TestA, modelIds: ['cpx-1', 'smp-1'], relationshipId: 1 },
		}

		endAllModel(Simple, [TestB])(change, context)

		expect(writeStub).to.have.been.calledOnceWithExactly('smp-1', [TestB])

		writeStub.restore()
	})
})