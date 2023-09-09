export function groupValues(tree) {
  return Object.values(tree).reduce((acc, cur) => {
    return acc.concat(Object.values(cur))
  }, [])
}

export function ungroupValues(group) {
  return group.values.map((value) => {
    return {
      subject: group.subject,
      operator: group.operator,
      value,
    }
  })
}
