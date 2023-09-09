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
