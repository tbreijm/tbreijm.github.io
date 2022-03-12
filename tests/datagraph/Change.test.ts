import { expect } from 'chai'
import { describe } from 'mocha'
import {
	pathChanges,
	ChangeType,
	collectionChanges,
	modelChanges,
	relationshipChanges
} from '../../src/datagraph/Change'

describe('Change', () => {
	describe('collectionChanges', () => {
		it('should return true for clone', () => {
			expect(collectionChanges({type: ChangeType.CLONE, data: {}})).to.be.true
		})

		it('should return true for create', () => {
			expect(collectionChanges({type: ChangeType.CREATE, data: {}})).to.be.true
		})

		it('should return true for delete', () => {
			expect(collectionChanges({type: ChangeType.DELETE, data: {}})).to.be.true
		})

		it('should return false for end', () => {
			expect(collectionChanges({type: ChangeType.END, data: {}})).to.be.false
		})

		it('should return true for insert', () => {
			expect(collectionChanges({type: ChangeType.INSERT, data: {}})).to.be.true
		})

		it('should return false for start', () => {
			expect(collectionChanges({type: ChangeType.START, data: {}})).to.be.false
		})

		it('should return false for update', () => {
			expect(collectionChanges({type: ChangeType.UPDATE, data: {}})).to.be.false
		})
	})

	describe('modelChanges', () => {
		it('should return true for clone', () => {
			expect(modelChanges({type: ChangeType.CLONE, data: {}})).to.be.true
		})

		it('should return true for create', () => {
			expect(modelChanges({type: ChangeType.CREATE, data: {}})).to.be.true
		})

		it('should return true for delete', () => {
			expect(modelChanges({type: ChangeType.DELETE, data: {}})).to.be.true
		})

		it('should return false for end', () => {
			expect(modelChanges({type: ChangeType.END, data: {}})).to.be.false
		})

		it('should return true for insert', () => {
			expect(modelChanges({type: ChangeType.INSERT, data: {}})).to.be.true
		})

		it('should return false for start', () => {
			expect(modelChanges({type: ChangeType.START, data: {}})).to.be.false
		})

		it('should return true for update', () => {
			expect(modelChanges({type: ChangeType.UPDATE, data: {}})).to.be.true
		})
	})

	describe('pathChanges', () => {
		it('should return true for clone', () => {
			expect(pathChanges({type: ChangeType.CLONE, data: {}})).to.be.true
		})

		it('should return false for create', () => {
			expect(pathChanges({type: ChangeType.CREATE, data: {}})).to.be.false
		})

		it('should return true for delete', () => {
			expect(pathChanges({type: ChangeType.DELETE, data: {}})).to.be.true
		})

		it('should return true for end', () => {
			expect(pathChanges({type: ChangeType.END, data: {}})).to.be.true
		})

		it('should return false for insert', () => {
			expect(pathChanges({type: ChangeType.INSERT, data: {}})).to.be.false
		})

		it('should return true for start', () => {
			expect(pathChanges({type: ChangeType.START, data: {}})).to.be.true
		})

		it('should return false for update', () => {
			expect(pathChanges({type: ChangeType.UPDATE, data: {}})).to.be.false
		})
	})

	describe('relationshipChanges', () => {
		it('should return true for clone', () => {
			expect(relationshipChanges({type: ChangeType.CLONE, data: {}})).to.be.false
		})

		it('should return false for create', () => {
			expect(relationshipChanges({type: ChangeType.CREATE, data: {}})).to.be.false
		})

		it('should return true for delete', () => {
			expect(relationshipChanges({type: ChangeType.DELETE, data: {}})).to.be.false
		})

		it('should return true for end', () => {
			expect(relationshipChanges({type: ChangeType.END, data: {}})).to.be.true
		})

		it('should return false for insert', () => {
			expect(relationshipChanges({type: ChangeType.INSERT, data: {}})).to.be.false
		})

		it('should return true for start', () => {
			expect(relationshipChanges({type: ChangeType.START, data: {}})).to.be.true
		})

		it('should return false for update', () => {
			expect(relationshipChanges({type: ChangeType.UPDATE, data: {}})).to.be.false
		})
	})
})