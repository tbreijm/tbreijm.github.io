import {Node} from '.'
import {HyperGraph} from './HyperGraph'

export type Edge = {
  readonly id: number;
  readonly nodes: Set<Node>;
};

export type EdgeId = Edge | number;

export const simplify = (edge: EdgeId): number =>
	typeof edge === 'object' ? edge.id : edge

export const expand = (graph: HyperGraph, edge: EdgeId): Edge =>
	typeof edge === 'object' ? edge : graph.edges.get(edge)!
