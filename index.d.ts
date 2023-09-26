/**
 * @typedef {Object} Expression
 * @property {Expression | string} subject
 * @property {Operator} operator
 * @property {Expression | ReturnType<typeof deserializeValue>} value

 * @typedef {Object} GroupedExpression
 * @property {string} subject
 * @property {ComparisonOperator} operator
 * @property {Exclude<ReturnType<typeof deserializeValue>, Expression>[]} values
 *
 * @typedef {'and' | 'or'} LogicalOperator
 * @typedef {'eq' | 'gt' | 'lt' | 'ge' | 'le' | 'ne'} ComparisonOperator
 * @typedef {LogicalOperator | ComparisonOperator} Operator
 */
/**
 * @param {string | null} [input]
 */
export function deserialize(input?: string | null): Expression;
/**
 * Deserializes a string value to its corresponding JavaScript type.
 *
 * @param {string} value - The value to deserialize.
 */
export function deserializeValue(value: string): string | number | boolean | Date;
/**
 * @template {string} T
 * @param {ReadonlyArray<Expression>} expressions
 * @param {Array<T>} [keys]
 */
export function getMap<T extends string>(expressions: ReadonlyArray<Expression>, keys?: T[]): Partial<Record<T, Partial<Record<ComparisonOperator, GroupedExpression>>>>;
/**
 * Returns an array of all the values in the map.
 *
 * @param {Partial<Record<string, Partial<Record<ComparisonOperator, GroupedExpression>>>>} tree - The tree of comparison operators.
 */
export function getValuesFromMap(tree: Partial<Record<string, Partial<Record<ComparisonOperator, GroupedExpression>>>>): GroupedExpression[];
/**
 * Ungroups a grouped expression into an array of expressions.
 *
 * @param {Array<GroupedExpression>} groups - The grouped expression to ungroup.
 * @param {LogicalOperator} [operator] - The logical operator to use when joining the expressions.
 */
export function ungroupValues(groups: Array<GroupedExpression>, operator?: LogicalOperator): Expression[];
/**
 *
 * @param {string} op
 * @returns {op is LogicalOperator}
 */
export function isLogical(op: string): op is LogicalOperator;
/**
 *
 * @param {string} op
 * @returns {op is ComparisonOperator}
 */
export function isComparison(op: string): op is ComparisonOperator;
/**
 *
 * @param {string} op
 * @returns {op is Operator}
 */
export function isOperator(op: string): op is Operator;
/**
 * @template T extends Record<string, unknown>
 *
 * @param {string | null} query
 * @param {Array<T>} [keys]
 */
export function parse<T>(query: string | null, keys?: T[]): Partial<Record<string, Partial<Record<ComparisonOperator, GroupedExpression>>>>;
/**
 *
 * @param {Array<GroupedExpression>} groupedValues
 * @param {Object} options
 * @param {LogicalOperator} [options.operator]
 * @param {LogicalOperator} [options.subOperator]
 */
export function stringify(groupedValues: Array<GroupedExpression>, options?: {
    operator?: LogicalOperator;
    subOperator?: LogicalOperator;
}): string;
/**
 *
 * @param {Expression} expression
 * @returns {string}
 */
export function serialize(expression: Expression): string;
/**
 * @param {Expression | null} expression
 * @param {LogicalOperator} operator
 * @returns {Expression[]}
 */
export function splitTree(expression: Expression | null, operator: LogicalOperator): Expression[];
/**
 * @param {Expression[]} expressions
 * @param {LogicalOperator} operator
 * @returns {Expression}
 */
export function joinTree(expressions: Expression[], operator: LogicalOperator): Expression;
export type Expression = {
    subject: Expression | string;
    operator: Operator;
    value: Expression | ReturnType<typeof deserializeValue>;
};
export type GroupedExpression = {
    subject: string;
    operator: ComparisonOperator;
    values: Exclude<ReturnType<typeof deserializeValue>, Expression>[];
};
export type LogicalOperator = 'and' | 'or';
export type ComparisonOperator = 'eq' | 'gt' | 'lt' | 'ge' | 'le' | 'ne';
export type Operator = LogicalOperator | ComparisonOperator;
//# sourceMappingURL=index.d.ts.map