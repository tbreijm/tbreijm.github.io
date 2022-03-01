export type JSONObject = Record<string, unknown>
export type JSONArray = JSONObject[]

export type HyperGraphData = {
	nodes: number[],
	edges: JSONArray,
	index: [number, number[]][],
}