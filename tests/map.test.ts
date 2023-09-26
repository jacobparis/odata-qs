import { describe, test, expect } from "vitest"
import { deserialize, getMap, getValuesFromMap, splitTree } from "../index.js"

describe("parses examples", () => {
  test(`Name eq 'Jacob' and Age eq 30`, (test) => {
    const tree = deserialize(test.task.name)
    const split = splitTree(tree, "and")
    expect(getValuesFromMap(getMap(split))).toEqual([
      {
        subject: "Name",
        operator: "eq",
        values: ["Jacob"],
      },
      {
        subject: "Age",
        operator: "eq",
        values: [30],
      },
    ])
  })

  test(`Name eq 'Jacob' or Name eq 'John'`, (test) => {
    const tree = deserialize(test.task.name)
    const split = splitTree(tree, "or")
    expect(getValuesFromMap(getMap(split))).toEqual([
      {
        subject: "Name",
        operator: "eq",
        values: ["Jacob", "John"],
      },
    ])
  })

  test(`Name eq 'Jacob' and Age eq 30 and Age eq 40`, (test) => {
    const tree = deserialize(test.task.name)
    const split = splitTree(tree, "and")
    expect(getValuesFromMap(getMap(split))).toEqual([
      {
        subject: "Name",
        operator: "eq",
        values: ["Jacob"],
      },
      {
        subject: "Age",
        operator: "eq",
        values: [30, 40],
      },
    ])
  })

  test(`Name eq 'Jacob' and (Age eq 30 or Age eq 40)`, (test) => {
    const tree = deserialize(test.task.name)
    const split = splitTree(tree, "and")
    expect(getValuesFromMap(getMap(split))).toEqual([
      {
        subject: "Name",
        operator: "eq",
        values: ["Jacob"],
      },
      {
        subject: "Age",
        operator: "eq",
        values: [30, 40],
      },
    ])
  })
})
