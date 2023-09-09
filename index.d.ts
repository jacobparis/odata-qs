declare module "odata-qs" {
  // deserializeValue.js
  export function deserializeValue(
    value: string
  ): string | number | boolean | Date

  // groupValues.js
  export function groupValues(tree: any): any
  export function ungroupValues(group: any): any

  // map.js
  export function getMap<T extends Record<string, unknown>>(
    expressions: ReadonlyArray<Expression>,
    keys?: Array<keyof T>
  ): Record<
    keyof T,
    Partial<Record<"eq" | "gt" | "ge" | "lt" | "le" | "ne", GroupedExpression>>
  >

  // operators.js
  export type LogicalOperator = "and" | "or"
  export type ComparisonOperators = "eq" | "gt" | "ge" | "lt" | "le" | "ne"
  export type Operator = LogicalOperator | ComparisonOperators
  export function isLogical(op: string): op is LogicalOperator
  export function isComparison(op: string): op is ComparisonOperators
  export function isOperator(op: string): op is Operator

  // parse.js
  export type Expression = {
    subject: Expression | string
    operator: Operator
    value: Expression | ReturnType<typeof deserializeValue>
  }
  export type GroupedExpression = {
    subject: string
    operator: ComparisonOperators
    values: Exclude<ReturnType<typeof deserializeValue>, Expression>[]
  }
  export function parse(input?: string | null): Expression

  // serialize.js
  export function serialize(expression: Expression): string

  // tree.js
  export function splitTree(
    expression: Expression | null,
    operator: LogicalOperator
  ): Expression[]
  export function joinTree(
    expressions: Expression[],
    operator: LogicalOperator
  ): Expression
}
