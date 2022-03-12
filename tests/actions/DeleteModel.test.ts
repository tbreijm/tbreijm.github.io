import chai, {expect} from 'chai'

import {describe} from 'mocha'
import * as sinon from 'sinon'
import sinonChai from 'sinon-chai'
import {deleteModel} from '../../src/actions'
import {ChangeType, DataGraph} from '../../src/datagraph'
import {Simple} from '../modelgraph/Model.values'
import {connected2Graph} from '../modelgraph/ModelGraph.values'
import {manifest} from '../modelgraph/Models.values'
import {TestA} from '../modelgraph/Relationship.values'

chai.use(sinonChai)

describe('Delete Model Action', () => {
	it('should delete the model of the correct type in the ended relationship', () => {
		const context = new DataGraph(manifest, connected2Graph()).mutable
		const writeStub = sinon.stub(context.write, 'delete')

		const change = {
			type: ChangeType.END,
			data: { type: TestA, modelIds: ['cpx-1', 'smp-1'], relationshipId: 1 },
		}

		deleteModel(Simple)(change, context)

		expect(writeStub).to.have.been.calledOnceWithExactly('smp-1')

		writeStub.restore()
	})
})