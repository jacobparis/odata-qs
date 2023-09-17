import { deserialize } from "./deserialize"
import { splitTree } from "./tree"
import { getMap } from "./map"
import { isLogical } from "./operators"

/**
 * @template T extends Record<string, unknown>
 *
 * @param {string} query
 * @param {Array<T>} [keys]
 */
export function parse(query, keys) {
  if (!query) return {}

  const deserialized = deserialize(query)

  const operator = isLogical(deserialized.operator)
    ? deserialized.operator
    : "and"

  const tree = splitTree(deserialized, operator)

  const map = getMap(tree, keys)

  return map
}
