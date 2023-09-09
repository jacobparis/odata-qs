import { isComparison } from "./operators.js"
import { deserializeValue } from "./deserializeValue.js"

export function parse(input) {
  if (!input) return null

  const substitutions = new Map()

  return parseFragment(input)

  function parseFragment(input) {
    const matchSub = input.match(/^Sub_(\d+)$/)
    if (matchSub) {
      const matchingSub = substitutions.get(input)
      if (!matchingSub) {
        throw new Error("Symbol not found")
      }

      return matchingSub
    }

    if (input.includes("(")) {
      let filter = input
      while (filter.includes("(")) {
        let i = 0
        let leftParenIndex = 0
        let isInsideQuotes = false

        for (i = 0; i <= filter.length; i++) {
          if (i === filter.length) {
            throw new Error("Unmatched parens")
          }

          const cursor = filter[i]
          if (cursor === "'") {
            isInsideQuotes = !isInsideQuotes
            continue
          }

          if (isInsideQuotes) {
            continue
          }

          if (cursor === "(") {
            leftParenIndex = i
            continue
          }

          if (cursor === ")") {
            const filterSubstring = filter.substring(leftParenIndex + 1, i)
            const key = `Sub_${substitutions.size}`
            substitutions.set(key, parseFragment(filterSubstring))
            // Replace the filterSubstring with the Symbol
            filter = [
              filter.substring(0, leftParenIndex),
              key.toString(),
              filter.substring(i + 1),
            ].join("")
            break
          }
        }
      }

      return parseFragment(filter)
    }

    const matchAnd = input.match(/^(?<left>.*?) and (?<right>.*)$/)
    if (matchAnd) {
      const groups = matchAnd.groups

      return {
        subject: parseFragment(groups.left),
        operator: "and",
        value: parseFragment(groups.right),
      }
    }

    const matchOr = input.match(/^(?<left>.*?) or (?<right>.*)$/)
    if (matchOr) {
      const groups = matchOr.groups

      return {
        subject: parseFragment(groups.left),
        operator: "or",
        value: parseFragment(groups.right),
      }
    }

    const matchOp = input.match(
      /(?<subject>\w*) (?<operator>eq|gt|lt|ge|le|ne) (?<value>datetimeoffset'(.*)'|'(.*)'|[0-9]*)/
    )
    if (matchOp) {
      const groups = matchOp.groups
      const operator = groups.operator
      if (!isComparison(operator)) {
        throw new Error(`Invalid operator: ${operator}`)
      }

      return {
        subject: groups.subject,
        operator: operator,
        value: deserializeValue(groups.value),
      }
    }

    throw new Error(`Invalid filter string: ${input}`)
  }
}
