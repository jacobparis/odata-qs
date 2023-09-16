const logicalOperators = ["and", "or"]
const comparisonOperators = ["eq", "gt", "ge", "lt", "le", "ne"]

/**
 *
 * @param {string} op
 * @returns {op is import("odata-qs").LogicalOperator}
 */
export function isLogical(op) {
  return logicalOperators.includes(op)
}

/**
 *
 * @param {string} op
 * @returns {op is import("odata-qs").ComparisonOperator}
 */
export function isComparison(op) {
  return comparisonOperators.includes(op)
}

/**
 *
 * @param {string} op
 * @returns {op is import("odata-qs").Operator}
 */
export function isOperator(op) {
  return isLogical(op) || isComparison(op)
}
