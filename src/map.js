import { isComparison } from "./operators.js"

function isString(value) {
  return typeof value === "string"
}

function isScalar(value) {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  )
}

export function getMap(expressions, keys) {
  function isKey(value) {
    if (typeof value !== "string") return false
    if (!keys) return true
    return keys.includes(value)
  }

  return expressions.reduce((acc, cur) => {
    if (!isString(cur.subject)) throw new Error("Invalid subject")
    if (!isComparison(cur.operator)) throw new Error("Invalid operator")
    if (!isScalar(cur.value)) {
      // TODO: Do dates go here?
      throw new Error("Invalid value")
    }

    const subject = cur.subject
    if (!isKey(subject)) {
      throw new Error(`Subject "${subject}" does not match ${keys}`)
    }

    if (!acc[subject]) {
      acc[subject] = {}
    }

    if (!acc[subject][cur.operator]) {
      acc[subject][cur.operator] = {
        subject: subject,
        operator: cur.operator,
        values: [cur.value],
      }
    }

    if (!acc[subject][cur.operator].values.includes(cur.value)) {
      acc[subject][cur.operator].values.push(cur.value)
    }

    return acc
  }, {})
}
