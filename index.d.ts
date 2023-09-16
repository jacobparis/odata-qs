declare module "odata-qs" {
  // deserialize.js
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
  export function deserialize(input?: string | null): Expression

  // deserializeValue.js
  export function deserializeValue(
    value: string
  ): string | number | boolean | Date

  // groupValues.js
  export function groupValues<T extends string>(
    tree: Partial<
      Record<T, Partial<Record<ComparisonOperators, GroupedExpression>>>
    >
  ): GroupedExpression[]
  export function ungroupValues(group: GroupedExpression): {
    subject: string
    operator: ComparisonOperators
    value: string | number | boolean | Date
  }[]

  // map.js
  export function getMap<T extends string>(
    expressions: ReadonlyArray<Expression>,
    keys?: Array<T>
  ): Partial<Record<T, Partial<Record<ComparisonOperators, GroupedExpression>>>>

  // operators.js
  export type LogicalOperator = "and" | "or"
  export type ComparisonOperators = "eq" | "gt" | "ge" | "lt" | "le" | "ne"
  export type Operator = LogicalOperator | ComparisonOperators
  export function isLogical(op: string): op is LogicalOperator
  export function isComparison(op: string): op is ComparisonOperators
  export function isOperator(op: string): op is Operator

  // parse.js
  export function parse<T extends string>(
    input: string | null,
    operator: LogicalOperator,
    keys?: Array<T>
  ): Partial<Record<T, Partial<Record<ComparisonOperators, GroupedExpression>>>>

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
