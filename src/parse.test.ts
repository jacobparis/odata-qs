import { describe, test, expect } from "vitest"
import { parse } from "./parse.js"

describe("parses examples", () => {
  test(`Name eq 'Jacob' and Age eq 30`, (test) => {
    const tree = parse(test.task.name)
    expect(tree).toEqual({
      Age: {
        eq: {
          operator: "eq",
          subject: "Age",
          values: [30],
        },
      },
      Name: {
        eq: {
          operator: "eq",
          subject: "Name",
          values: ["Jacob"],
        },
      },
    })
  })

  test(`Name eq 'Jacob' or Name eq 'John'`, (test) => {
    const tree = parse(test.task.name)
    expect(tree).toEqual({
      Name: {
        eq: {
          operator: "eq",
          subject: "Name",
          values: ["Jacob", "John"],
        },
      },
    })
  })

  test(`Name eq 'a' or Name eq 'b' or Name eq 'c' or Name eq 'd'`, (test) => {
    const tree = parse(test.task.name)
    expect(tree).toEqual({
      Name: {
        eq: {
          operator: "eq",
          subject: "Name",
          values: ["a", "b", "c", "d"],
        },
      },
    })
  })
})
