/**
 * @param {import('odata-qs').Expression | null} expression
 * @param {import('odata-qs').LogicalOperator} operator
 * @returns {import('odata-qs').Expression[]}
 */
export function splitTree(expression, operator) {
  if (!expression) return []
  if (expression.operator === operator) {
    return [
      ...splitTree(expression.subject, operator),
      ...splitTree(expression.value, operator),
    ]
  }
  return [expression]
}

/**
 * @param {import('odata-qs').Expression[]} expressions
 * @param {import('odata-qs').LogicalOperator} operator
 * @returns {import('odata-qs').Expression}
 */
export function joinTree(expressions, operator) {
  if (expressions.length === 1) {
    return expressions[0]
  }
  const [first, ...rest] = expressions
  return {
    subject: first,
    operator,
    value: joinTree(rest, operator),
  }
}
