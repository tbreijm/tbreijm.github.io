import {expect} from 'chai'
import {describe} from 'mocha'
import {and, modelCloned, modelCreated, or} from '../../src/conditions/Conditions'
import {ChangeType, DataGraph} from '../../src/datagraph'
import {Complex, Simple} from '../modelgraph/Model.values'
import {connected2Graph} from '../modelgraph/ModelGraph.values'
import {manifest} from '../modelgraph/Models.values'

describe('Conditions', () => {
	describe('or', () => {
		it('should return false when no conditions are provided', () => {
			const context = new DataGraph(manifest, connected2Graph()).context
			const change = {
				type: ChangeType.CLONE,
				data: { newModelId: 'cpx-1' },
			}
			expect(or()(change, context)).to.be.false
		})
		it('should return false when the conditions are not met', () => {
			const context = new DataGraph(manifest, connected2Graph()).context
			const change = {
				type: ChangeType.CLONE,
				data: { newModelId: 'cpx-1' },
			}
			expect(or(modelCreated(Complex), modelCloned(Simple))(change, context)).to.be.false
		})
		it('should return true when the conditions are met', () => {
			const context = new DataGraph(manifest, connected2Graph()).context
			const change = {
				type: ChangeType.CLONE,
				data: { newModelId: 'cpx-1' },
			}
			expect(or(modelCreated(Complex), modelCloned(Complex))(change, context)).to.be.true
		})
	})
	describe('and', () => {
		it('should return true when no conditions are provided', () => {
			const context = new DataGraph(manifest, connected2Graph()).context
			const change = {
				type: ChangeType.CLONE,
				data: { newModelId: 'cpx-1' },
			}
			expect(and()(change, context)).to.be.true
		})
		it('should return false when the conditions are not met', () => {
			const context = new DataGraph(manifest, connected2Graph()).context
			const change = {
				type: ChangeType.CLONE,
				data: { newModelId: 'cpx-1' },
			}
			expect(and(modelCreated(Complex), modelCloned(Simple))(change, context)).to.be.false
		})
		it('should return true when the conditions are met', () => {
			const context = new DataGraph(manifest, connected2Graph()).context
			const change = {
				type: ChangeType.CLONE,
				data: { newModelId: 'cpx-1' },
			}
			expect(and(modelCloned(Complex), modelCloned(Complex))(change, context)).to.be.true
		})
	})
})