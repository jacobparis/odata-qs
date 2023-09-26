import { test, expect } from "vitest"
import { deserializeValue } from "../index.js"

test("returns null for empty input", () => {
  expect(deserializeValue("")).toBeNull()
})

test("returns number for numeric input", () => {
  expect(deserializeValue("4")).toEqual(4)
  expect(deserializeValue("-4")).toEqual(-4)
})

test("returns string for string input", () => {
  expect(deserializeValue("'John'")).toEqual("John")
})

test("returns boolean for boolean input", () => {
  expect(deserializeValue("true")).toEqual(true)
  expect(deserializeValue("false")).toEqual(false)
})

test("returns date for date input", () => {
  expect(deserializeValue("2021-01-01")).toEqual(new Date("2021-01-01"))
})
