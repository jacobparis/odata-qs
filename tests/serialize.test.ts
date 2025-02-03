import { describe, test, expect } from "vitest"
import { deserialize, Expression, serialize } from "../index.js"

describe("parses examples", () => {
  test.each([
    `Name eq 'Jacob' and Age eq 30`,
    `Name eq 'Jacob' or Name eq 'John'`,
    `Name eq 'Jacob' and (Age eq 30 or Age eq 40)`,
    `Name eq 'Jacob' and ((Age eq 30 or Age eq 40) and (Name eq 'John' or Name eq 'Jacob'))`,
    `(Name eq 'Jacob' and Age eq 30) or ((Age eq 40 and Name eq 'John') or Name eq 'Jacob')`,
  ])("%s", (test) => {
    expect(serialize(deserialize(test)!)).toEqual(test)
  })

  test('empty value', () => {
    const expression: Expression = {
      subject: "Name",
      operator: "eq",
      value: '',
    }

    expect(serialize(expression)).toEqual(null)
  })
})
