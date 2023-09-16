import { describe, test, expect } from "vitest"
import { deserialize } from "./deserialize.js"
import { splitTree } from "./tree.js"

describe("parses examples", () => {
  test(`Name eq 'Jacob' and Age eq 30`, (test) => {
    const tree = deserialize(test.task.name)
    expect(splitTree(tree, "and")).toEqual([
      {
        subject: "Name",
        operator: "eq",
        value: "Jacob",
      },
      {
        subject: "Age",
        operator: "eq",
        value: 30,
      },
    ])
  })

  test(`Name eq 'Jacob' or Name eq 'John'`, (test) => {
    const tree = deserialize(test.task.name)
    expect(splitTree(tree, "or")).toEqual([
      {
        subject: "Name",
        operator: "eq",
        value: "Jacob",
      },
      {
        subject: "Name",
        operator: "eq",
        value: "John",
      },
    ])
  })

  test(`Name eq 'Jacob' and (Age eq 30 or Age eq 40)`, (test) => {
    const tree = deserialize(test.task.name)
    expect(splitTree(tree, "and")).toEqual([
      {
        subject: "Name",
        operator: "eq",
        value: "Jacob",
      },
      {
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
    ])
  })

  test(`Name eq 'a' or Name eq 'b' or Name eq 'c' or Name eq 'd'`, (test) => {
    const tree = deserialize(test.task.name)
    expect(splitTree(tree, "or")).toEqual([
      {
        subject: "Name",
        operator: "eq",
        value: "a",
      },
      {
        subject: "Name",
        operator: "eq",
        value: "b",
      },
      {
        subject: "Name",
        operator: "eq",
        value: "c",
      },
      {
        subject: "Name",
        operator: "eq",
        value: "d",
      },
    ])
  })
})
