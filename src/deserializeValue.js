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
