import chai, {expect} from 'chai'
import {describe} from 'mocha'
import sinonChai from 'sinon-chai'
import {DataGraph} from '../../src/datagraph'
import {manifest} from '../modelgraph/Models.values'

chai.use(sinonChai)

describe('DataGraph', () => {
	it('should be constructed', () => {
		const graph = new DataGraph(manifest)
		expect(graph.read).to.be.not.undefined
		expect(graph.write).to.be.not.undefined

		expect(graph.context).to.be.not.undefined
		expect(graph.mutable).to.be.not.undefined
	})
})