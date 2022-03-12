import {Subject} from 'rxjs'
import {Change, Context, MutableContext, Reader, Writer} from '../datagraph'
import {ModelGraph} from '../modelgraph'
import {Manifest} from '../modelgraph/Manifest'

export default class DataGraph {
	readonly read: Reader
	readonly write: Writer

	readonly context: Context
	readonly mutable: MutableContext

	readonly changes = new Subject<Change>()

	constructor(
		readonly manifest: Manifest,
		private readonly graph: ModelGraph = new ModelGraph(),
	) {
		this.read = new Reader(graph)
		this.write = new Writer(manifest, graph, this.changes)

		this.context = {
			read: this.read,
		}

		this.mutable = {
			read: this.read,
			write: this.write,
		}
	}

	modelGraph(): ModelGraph {
		return this.graph.copy(this.manifest)
	}
}
