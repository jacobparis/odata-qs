/**
 * @typedef {Object} Expression
 * @property {Expression | string} subject
 * @property {Operator} operator
 * @property {Expression | ReturnType<typeof deserializeValue>} value

 * @typedef {Object} GroupedExpression
 * @property {string} subject
 * @property {ComparisonOperator} operator
 * @property {Exclude<ReturnType<typeof deserializeValue>, Expression>[]} values
 *
 * @typedef {'and' | 'or'} LogicalOperator
 * @typedef {'eq' | 'gt' | 'lt' | 'ge' | 'le' | 'ne'} ComparisonOperator
 * @typedef {LogicalOperator | ComparisonOperator} Operator
 */

/**
 * @param {string | null} [input]
 */
export function deserialize(input) {
  if (!input) return null

  /** @type {Map<string, Expression>} */
  const substitutions = new Map()

  return parseFragment(input)

  /**
   * @param {string} input
   * @returns {Expression}
   */
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

/**
 * Deserializes a string value to its corresponding JavaScript type.
 *
 * @param {string} value - The value to deserialize.
 */
export function deserializeValue(value) {
  if (value.startsWith("'") && value.endsWith("'")) {
    return value.substring(1, value.length - 1)
  }

  // support integers, negative numbers
  if (/^-?\d+$/.test(value)) {
    return Number(value)
  }

  // support booleans
  if (value === "true") {
    return true
  }

  if (value === "false") {
    return false
  }

  // support ISO 8601 date
  const match = value.match(/^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})$/)
  if (match && match.groups) {
    const { year, month, day } = match.groups
    const date = new Date(`${year}-${month}-${day}`)
    return date
  }

  return null
}

/**
 * @template {string} T
 * @param {ReadonlyArray<Expression>} expressions
 * @param {Array<T>} [keys]
 */
export function getMap(expressions, keys) {
  /**
   * @param {string | number | symbol} value
   * @returns {value is T}
   */
  function isKey(value) {
    if (typeof value !== "string") return false
    if (!keys) return true
    return keys.includes(value)
  }

  return expressions
    .map((expression) => {
      if (isLogical(expression.operator)) {
        const expressions = splitTree(expression, expression.operator)

        const uniqueSubjects = new Set(expressions.map((e) => e.subject))
        if (uniqueSubjects.size !== 1) {
          throw new Error("Cannot map logical operator with multiple subjects")
        }

        const uniqueOperators = new Set(expressions.map((e) => e.operator))
        if (uniqueOperators.size !== 1) {
          throw new Error("Cannot map logical operator with multiple operators")
        }

        return {
          subject: expression.subject.subject,
          operator: expression.subject.operator,
          values: expressions.map((e) => e.value),
        }
      }

      return {
        subject: expression.subject,
        operator: expression.operator,
        values: [expression.value],
      }
    })
    .reduce((acc, cur) => {
      /** @type {T} */
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
          values: [...cur.values],
        }
      }

      // TODO: This could probably be optimized
      acc[subject][cur.operator].values = Array.from(
        new Set(acc[subject][cur.operator].values.concat(cur.values))
      )

      return acc
    }, /** @type {Partial<Record<T, Partial<Record<ComparisonOperator, GroupedExpression>>>>} */ ({}))
}

/**
 * Returns an array of all the values in the map.
 *
 * @param {Partial<Record<string, Partial<Record<ComparisonOperator, GroupedExpression>>>>} tree - The tree of comparison operators.
 */
export function getValuesFromMap(tree) {
  return Object.values(tree).reduce((acc, cur) => {
    return acc.concat(Object.values(cur))
  }, /** @type {GroupedExpression[]} */ ([]))
}

/**
 * Ungroups a grouped expression into an array of expressions.
 *
 * @param {Array<GroupedExpression>} groups - The grouped expression to ungroup.
 * @param {LogicalOperator} [operator] - The logical operator to use when joining the expressions.
 */
export function ungroupValues(groups, operator = "or") {
  return groups.filter(group => group.values.some(value => 
    value !== null && value !== undefined && value !== ''
  )).map((group) => {
    const expressions = group.values.map((value) => ({
      subject: group.subject,
      operator: group.operator,
      value,
    }))

    return joinTree(expressions, operator)
  })
}
const logicalOperators = ["and", "or"]
const comparisonOperators = ["eq", "gt", "ge", "lt", "le", "ne"]

/**
 *
 * @param {string} op
 * @returns {op is LogicalOperator}
 */
export function isLogical(op) {
  return logicalOperators.includes(op)
}

/**
 *
 * @param {string} op
 * @returns {op is ComparisonOperator}
 */
export function isComparison(op) {
  return comparisonOperators.includes(op)
}

/**
 *
 * @param {string} op
 * @returns {op is Operator}
 */
export function isOperator(op) {
  return isLogical(op) || isComparison(op)
}

/**
 * @template T extends Record<string, unknown>
 *
 * @param {string | null} query
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

/**
 *
 * @param {Array<GroupedExpression>} groupedValues
 * @param {Object} options
 * @param {LogicalOperator} [options.operator]
 * @param {LogicalOperator} [options.subOperator]
 */
export function stringify(groupedValues, options = {}) {
  const ungrouped = ungroupValues(groupedValues, options.subOperator || "or")
  const joined = joinTree(ungrouped, options.operator || "and")
  return joined ? serialize(joined) : null
}

/**
 *
 * @param {Expression} expression
 * @returns {string}
 */
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

  /**
   *
   * @param {Expression} expression
   * @returns {string}
   */
  function cleanSerialize(expression) {
    return isLogical(expression.operator)
      ? `(${serialize(expression)})`
      : serialize(expression)
  }
}
/**
 * @param {Expression | null} expression
 * @param {LogicalOperator} operator
 * @returns {Expression[]}
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
 * @param {Expression[]} expressions
 * @param {LogicalOperator} operator
 * @returns {Expression | null}
 */
export function joinTree(expressions, operator) {
  if (expressions.length === 0) {
    return null
  }

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
