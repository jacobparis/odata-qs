import { describe, test, expect } from "vitest"
import { GroupedExpression, ungroupValues } from "../index.js"

describe("parses examples", () => {
  test(`Name eq 'Jacob'`, () => {
    const groupedValues: Array<GroupedExpression> = [
      {
        subject: "Name",
        operator: "eq",
        values: ["Jacob"],
      },
    ]

    expect(ungroupValues(groupedValues, "and")).toEqual([
      {
        subject: "Name",
        operator: "eq",
        value: "Jacob",
      },
    ])
  })

  test(`Name eq 'Jacob' and Age eq 30`, () => {
    const groupedValues: Array<GroupedExpression> = [
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
    ]

    expect(ungroupValues(groupedValues, "and")).toEqual([
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

  test(`Name eq 'Jacob' and Name eq 'John'`, () => {
    const groupedValues: Array<GroupedExpression> = [
      {
        subject: "Name",
        operator: "eq",
        values: ["Jacob", "John"],
      },
    ]

    expect(ungroupValues(groupedValues, "and")).toEqual([
      {
        subject: {
          subject: "Name",
          operator: "eq",
          value: "Jacob",
        },
        operator: "and",
        value: {
          subject: "Name",
          operator: "eq",
          value: "John",
        },
      },
    ])
  })

  test(`Name eq 'Jacob' or Name eq 'John'`, () => {
    const groupedValues: Array<GroupedExpression> = [
      {
        subject: "Name",
        operator: "eq",
        values: ["Jacob", "John"],
      },
    ]

    expect(ungroupValues(groupedValues, "or")).toEqual([
      {
        subject: {
          subject: "Name",
          operator: "eq",
          value: "Jacob",
        },
        operator: "or",
        value: {
          subject: "Name",
          operator: "eq",
          value: "John",
        },
      },
    ])
  })

  test(`Name eq 'Jacob' or Name eq 'John' or Name eq 'Jingleheimer'`, () => {
    const groupedValues: Array<GroupedExpression> = [
      {
        subject: "Name",
        operator: "eq",
        values: ["Jacob", "John", "Jingleheimer"],
      },
    ]

    expect(ungroupValues(groupedValues, "or")).toEqual([
      {
        subject: {
          subject: "Name",
          operator: "eq",
          value: "Jacob",
        },
        operator: "or",
        value: {
          subject: {
            subject: "Name",
            operator: "eq",
            value: "John",
          },
          operator: "or",
          value: {
            subject: "Name",
            operator: "eq",
            value: "Jingleheimer",
          },
        },
      },
    ])
  })

  test(`Name eq 'Jacob' and (Age eq 30 or Age eq 40)`, () => {
    const groupedValues: Array<GroupedExpression> = [
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
    ]

    expect(ungroupValues(groupedValues, "or")).toEqual([
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
})
