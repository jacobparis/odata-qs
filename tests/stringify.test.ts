import { describe, expect, test } from "vitest";
import { type GroupedExpression, stringify } from "../index.js";

describe("stringify examples", () => {
  test("null", () => {
    const groupedValues: Array<GroupedExpression> = [
      {
        subject: "Name",
        operator: "eq",
        values: [""],
      },
    ];

    expect(stringify(groupedValues)).toEqual(null);
  })
  test("Name eq 'Jacob' or Name eq 'John'", () => {
		const groupedValues: Array<GroupedExpression> = [
			{
				subject: "Name",
				operator: "eq",
				values: ["Jacob", "John"],
			},
			{
				subject: "Age",
				operator: "eq",
				values: [""],
			},
			
		];

		expect(stringify(groupedValues)).toEqual("Name eq 'Jacob' or Name eq 'John'");
	});

	test("Name eq 'Jacob' and Eyes eq 'Blue'", () => {
		const groupedValues: Array<GroupedExpression> = [
			{
				subject: "Name",
				operator: "eq",
				values: ["Jacob", "John"],
			},
			{
				subject: "Age",
				operator: "eq",
				values: [""],
			},
			{
				subject: "Eyes",
				operator: "eq",
				values: ["Blue"],
			},
		];

		expect(stringify(groupedValues)).toEqual("(Name eq 'Jacob' or Name eq 'John') and Eyes eq 'Blue'");
	});
});
