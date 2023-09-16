import { describe, test, expect } from "vitest"
import { deserialize } from "./deserialize.js"
import { serialize } from "./serialize.js"

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
})
