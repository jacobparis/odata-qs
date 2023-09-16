/**
 * @typedef {import("odata-qs").ComparisonOperators} ComparisonOperators
 * @typedef {import("odata-qs").GroupedExpression} GroupedExpression
 * @typedef {import("odata-qs").Expression} Expression
 *
 */

/**
 * Groups the values of a tree of comparison operators into an array of grouped expressions.
 *
 * @param {Partial<Record<string, Partial<Record<ComparisonOperators, GroupedExpression>>>>} tree - The tree of comparison operators.
 */
export function groupValues(tree) {
  return Object.values(tree).reduce((acc, cur) => {
    return acc.concat(Object.values(cur))
  }, /** @type {GroupedExpression[]} */ ([]))
}

/**
 * Ungroups a grouped expression into an array of expressions.
 *
 * @param {GroupedExpression} group - The grouped expression to ungroup.
 */
export function ungroupValues(group) {
  return group.values.map((value) => {
    return {
      subject: group.subject,
      operator: group.operator,
      value,
    }
  })
}
