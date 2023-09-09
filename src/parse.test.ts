import { describe, test, expect } from "vitest"
import { parse } from "./parse.js"

test("returns null for empty input", () => {
  expect(parse("")).toBeNull()
})

test("throws error for invalid input", () => {
  expect(() => parse("invalid input")).toThrow()
  expect(() => parse("eq")).toThrow()
  expect(() => parse("Jacob")).toThrow()
})

test.each(["eq", "ne", "gt", "ge", "lt", "le"])(
  "supports %s operator",
  (operator) => {
    const result = parse(`Age ${operator} 30`)
    expect(result?.operator).toEqual(operator)
  }
)

test("fails when logical operators are used as comparison", () => {
  expect(() => parse("Age and 30")).toThrow()
  expect(() => parse("Age or 30")).toThrow()
})

describe("parses examples", () => {
  test(`Age eq 30`, (test) => {
    expect(parse(test.task.name)).toEqual({
      subject: "Age",
      operator: "eq",
      value: 30,
    })
  })

  test(`Name eq 'Jacob'`, (test) => {
    expect(parse(test.task.name)).toEqual({
      subject: "Name",
      operator: "eq",
      value: "Jacob",
    })
  })

  test(`Name eq 'Jacob' and Age eq 30`, (test) => {
    expect(parse(test.task.name)).toEqual({
      subject: {
        subject: "Name",
        operator: "eq",
        value: "Jacob",
      },
      operator: "and",
      value: {
        subject: "Age",
        operator: "eq",
        value: 30,
      },
    })
  })

  test(`Name eq 'Jacob' or Age eq 30`, (test) => {
    expect(parse(test.task.name)).toEqual({
      subject: {
        subject: "Name",
        operator: "eq",
        value: "Jacob",
      },
      operator: "or",
      value: {
        subject: "Age",
        operator: "eq",
        value: 30,
      },
    })
  })

  test(`Name eq 'Jacob' and (Age eq 30 or Age eq 40)`, (test) => {
    expect(parse(test.task.name)).toEqual({
      subject: {
        subject: "Name",
        operator: "eq",
        value: "Jacob",
      },
      operator: "and",
      value: {
        subject: {
          subject: "Age",
          operator: "eq",
          value: 30,
        },
        operator: "or",
        value: {
          subject: "Age",
          operator: "eq",
          value: 40,
        },
      },
    })
  })
})
