import { deserialize } from "./deserialize"
import { splitTree } from "./tree"
import { getMap } from "./map"

/**
 * @template T extends Record<string, unknown>
 *
 * @param {string} query
 * @param {import("odata-qs").LogicalOperator} operator
 * @param {Array<T>} [keys]
 */
export function parse(query, operator, keys) {
  if (!query) return {}

  const deserialized = deserialize(query)
  const tree = splitTree(deserialized, operator)
  const map = getMap(tree, keys)

  return map
}
