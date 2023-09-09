const logicalOperators = ["and", "or"]
const comparisonOperators = ["eq", "gt", "ge", "lt", "le", "ne"]

export function isLogical(op) {
  return logicalOperators.includes(op)
}

export function isComparison(op) {
  return comparisonOperators.includes(op)
}

export function isOperator(op) {
  return isLogical(op) || isComparison(op)
}
