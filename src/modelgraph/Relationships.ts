import {equal} from '../Equals'
import {
	RelationshipKey,
	RelationshipStore,
	RelationshipType,
} from '../modelgraph/index'
import {not} from '../math'
import {Manifest} from './Manifest'

export default class Relationships {
	constructor(
		private readonly stores = new Map<RelationshipType<any>,
			RelationshipStore>(),
		private readonly types = new Map<number, RelationshipType<any>>(),
	) {
	}

	all<R extends RelationshipKey>(type: RelationshipType<R>): number[] {
		return this.missing(type) ? [] : this.stores.get(type)!.all()
	}

	end(edgeId: number): boolean {
		const type = this.types.get(edgeId)
		if (type === undefined) return false

		const store = this.stores.get(type)!
		const result = this.has(type) ? store.end(edgeId) : false

		if (result) this.types.delete(edgeId)
		if (store.empty()) this.stores.delete(type)

		return result
	}

	endAll(edgeIds: number[]): boolean {
		return edgeIds.every((_) => this.end(_))
	}

	equals(relationships: Relationships): boolean {
		const typesKeysThis = [...this.types.keys()]
		const storeKeysThis = [...this.stores.keys()]

		return (
			equal(typesKeysThis, [...relationships.types.keys()]) &&
			typesKeysThis.every(
				(_) => this.types.get(_) === relationships.types.get(_),
			) &&
			equal(storeKeysThis, [...relationships.stores.keys()]) &&
			storeKeysThis.every((_) =>
				this.stores.get(_)!.equals(relationships.stores.get(_)!),
			)
		)
	}

	has<R extends RelationshipKey>(type: RelationshipType<R>): boolean {
		return this.stores.has(type)
	}

	missing<R extends RelationshipKey>(type: RelationshipType<R>): boolean {
		return not(this.has(type))
	}

	start<R extends RelationshipKey>(type: RelationshipType<R>, edgeId: number): boolean {
		if (this.missing(type)) {
			this.stores.set(type, new RelationshipStore())
		}

		if (this.stores.get(type)!.start(edgeId)) {
			this.types.set(edgeId, type)
			return true
		}

		return false
	}

	type(edgeId: number | undefined): RelationshipType<any> | undefined {
		if (edgeId === undefined) return undefined
		return this.types.get(edgeId)
	}

	typeSet<R extends RelationshipKey>(): Set<RelationshipType<R>> {
		return new Set(this.stores.keys())
	}

	serialise(manifest: Manifest): unknown {
		return {
			types: [...this.types].map(([k, type]) => [
				k,
				manifest.relationshipName(type),
			]),
			stores: [...this.stores].map(([type, store]) => [
				manifest.relationshipName(type),
				store.serialise(),
			]),
		}
	}

	static deserialise(data: any, manifest: Manifest): Relationships {
		return new Relationships(
			new Map(
				data.stores.map((entry: any) => [
					manifest.relationshipType(entry[0]),
					RelationshipStore.deserialise(entry[1]),
				]),
			),
			new Map(
				data.types.map((entry: any) => [
					entry[0],
					manifest.relationshipType(entry[1]),
				]),
			),
		)
	}
}
