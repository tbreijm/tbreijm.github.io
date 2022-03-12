import {equal} from '../Equals'
import {JSONObject} from '../Input'
import { not } from '../math'

export default class RelationshipStore {
	constructor(private readonly edges: Set<number> = new Set()) {}

	all(): number[] {
		return [...this.edges]
	}

	any(): boolean {
		return this.edges.size > 0
	}

	empty(): boolean {
		return this.edges.size === 0
	}

	end(edgeId: number): boolean {
		return this.edges.delete(edgeId)
	}

	endAll(edgeIds: number[]): boolean {
		return edgeIds.every((_) => this.end(_))
	}

	equals(store: RelationshipStore): boolean {
		return equal(this.edges, store.edges)
	}

	has(edgeId: number): boolean {
		return this.edges.has(edgeId)
	}

	missing(edgeId: number): boolean {
		return not(this.has(edgeId))
	}

	start(edgeId: number): boolean {
		if (this.missing(edgeId)) {
			this.edges.add(edgeId)
			return true
		}

		return false
	}

	serialise(): JSONObject {
		return {
			edges: [...this.edges],
		}
	}

	static deserialise(data: any): RelationshipStore {
		return new RelationshipStore(new Set(data.edges))
	}
}
