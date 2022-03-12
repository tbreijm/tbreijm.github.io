import chai, {expect} from 'chai'
import {describe} from 'mocha'
import sinonChai from 'sinon-chai'
import {Relationships} from '../../src/modelgraph'
import {manifest} from './Models.values'
import {
	emptyRelationships,
	TestA,
	testARelationships,
	testBRelationships1,
	testBRelationships2,
	testRelationships
} from './Relationship.values'

chai.use(sinonChai)

describe('Relationships', () => {
	describe('all', () => {
		it('should return an empty array when no relationships have been registered', () => {
			expect(emptyRelationships().all(TestA)).to.deep.equal([])
		})

		it('should return an array of edge ids', () => {
			const relationships = emptyRelationships()
			relationships.start(TestA, 1)
			expect(relationships.all(TestA)).to.deep.equal([1])
		})
	})

	describe('end', () => {
		it('should return false when no relationships have been started', () => {
			expect(emptyRelationships().end(1)).to.be.false
		})

		it('should return true when a relationship has been started', () => {
			const relationships = emptyRelationships()
			relationships.start(TestA, 1)
			expect(relationships.end(1)).to.be.true
		})
	})

	describe('endAll', () => {
		it('should return false when no relationships have been registered', () => {
			expect(emptyRelationships().endAll([1,2])).to.be.false
		})
	})

	describe('equals', () => {
		it('should return true for two empty relationships', () => {
			const relationships1 = emptyRelationships()
			const relationships2 = emptyRelationships()
			expect(relationships1.equals(relationships2)).to.be.true
		})

		it('should return false when two relationships do not have the same types 1', () => {
			const relationships1 = emptyRelationships()
			const relationships2 = testARelationships()
			expect(relationships1.equals(relationships2)).to.be.false
		})

		it('should return false when two relationships do not have the same types 2', () => {
			const relationships1 = testARelationships()
			const relationships2 = testBRelationships1()
			expect(relationships1.equals(relationships2)).to.be.false
		})

		it('should return false when two relationships do not have the same types 3', () => {
			const relationships1 = testRelationships()
			const relationships2 = testARelationships()
			expect(relationships1.equals(relationships2)).to.be.false
		})

		it('should return false when two relationships do not have the same types 4', () => {
			const relationships1 = testRelationships()
			const relationships2 = testBRelationships2()
			expect(relationships1.equals(relationships2)).to.be.false
		})

		it('should return false when the types are equal but the stores are not', () => {
			const relationships1 = testBRelationships1()
			const relationships2 = testBRelationships2()
			expect(relationships1.equals(relationships2)).to.be.false
		})

		it('should return true for the same relationships', () => {
			const relationships1 = testRelationships()
			const relationships2 = testRelationships()
			expect(relationships1.equals(relationships2)).to.be.true
		})

		it('should return true deserialised serialised clone', () => {
			const relationships1 = testRelationships()
			const relationships2 = Relationships.deserialise(testRelationships().serialise(manifest), manifest)
			expect(relationships1.equals(relationships2)).to.be.true
		})
	})

	describe('has', () => {
		it('should return false when no relationships have been registered', () => {
			expect(emptyRelationships().has(TestA)).to.be.false
		})
	})

	describe('missing', () => {
		it('should return true when no relationships have been registered', () => {
			expect(emptyRelationships().missing(TestA)).to.be.true
		})
	})

	describe('start', () => {
		it('should return true when a relationship has been started', () => {
			const relationships = emptyRelationships()
			expect(relationships.start(TestA, 1)).to.be.true
		})

		it('should return false when a relationship has already been started', () => {
			const relationships = emptyRelationships()
			relationships.start(TestA, 1)
			expect(relationships.start(TestA, 1)).to.be.false
		})
	})

	describe('type', () => {
		it('should return undefined when the relationship id is undefined', () => {
			expect(emptyRelationships().type(undefined)).to.be.undefined
		})

		it('should return undefined when no relationships have been started', () => {
			expect(emptyRelationships().type(1)).to.be.undefined
		})

		it('should return the correct type for a valid relationship id', () => {
			const relationships = emptyRelationships()
			relationships.start(TestA, 1)
			expect(relationships.type(1)).to.deep.equal(TestA)
		})
	})

	describe('serialise', () => {
		it('should serialise an empty relationships', () => {
			const expected = {'types':[], 'stores':[]}
			expect(emptyRelationships().serialise(manifest)).to.deep.equal(expected)
		})

		it('should serialise a relationships', () => {
			const expected = {'types':[[1, 'TestA']], 'stores':[['TestA', {'edges':[1]}]]}
			const relationships = emptyRelationships()
			relationships.start(TestA, 1)
			expect(relationships.serialise(manifest)).to.deep.equal(expected)
		})
	})

	describe('deserialise', () => {
		it('should deserialise an empty relationships', () => {
			const data = {'types':[], 'stores':[]}
			expect(Relationships.deserialise(data, manifest)).to.deep.equal(emptyRelationships())
		})

		it('should serialise a relationships', () => {
			const data = {'types':[[1, 'TestA']], 'stores':[['TestA', {'edges':[1]}]]}
			const relationships = emptyRelationships()
			relationships.start(TestA, 1)
			expect(Relationships.deserialise(data, manifest)).to.deep.equal(relationships)
		})
	})
})