import { isLogical } from "./operators.js"

export function serialize(expression) {
  const subject =
    typeof expression.subject === "string"
      ? expression.subject
      : cleanSerialize(expression.subject)

  if (!expression.value) {
    throw new Error("Invalid expression value")
  }

  if (typeof expression.value === "string") {
    return `${subject} ${expression.operator} '${expression.value}'`
  }

  if (typeof expression.value === "number") {
    return `${subject} ${expression.operator} ${expression.value}`
  }

  if (typeof expression.value === "boolean") {
    return `${subject} ${expression.operator} ${expression.value}`
  }

  if (expression.value instanceof Date) {
    return `${subject} ${
      expression.operator
    } '${expression.value.toISOString()}'`
  }

  return `${subject} ${expression.operator} ${cleanSerialize(expression.value)}`

  function cleanSerialize(expression) {
    return isLogical(expression.operator)
      ? `(${serialize(expression)})`
      : serialize(expression)
  }
}
