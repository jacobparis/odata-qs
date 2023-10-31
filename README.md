# odata-qs

An OData compliant querystring parser and serializer

## Usage

```js
import { parse } from "odata-qs"

const query = parse(
  `(name eq 'Jacob' or name eq 'John') and age gt 18 and age lt 65`
)

{
  age: {
    gt: {
      operator: "gt",
      subject: "age",
      values: [18],
    },
    lt: {
      operator: "lt",
      subject: "age",
      values: [65],
    },
  },
  name: {
    eq: {
      operator: "eq",
      subject: "name",
      values: ["Jacob", "John"],
    },
  },
}
```

If you want a type-safe result, you can pass a second argument as an array of allowed subjects. If the query contains a subject that isn't in the array, it will throw an error at runtime, and during development you'll get full intellisense support.

```js
import { parse } from "odata-qs"
const filter = parse(
  `(name eq 'Jacob' or name eq 'John') and age gt 18 and age lt 65`,
  ["name", "age"]
)
filter.name // ✅
filter.age // ✅
filter.foo // Property 'foo' does not exist on type Record<'name' | 'age', …>
```

Serializing a filter expects a structured object with subject, operator, and value properties.

```ts
import { serialize } from "odata-qs"
serialize({
  subject: "name",
  operator: "eq",
  value: "Jacob",
}) // name eq 'Jacob'

serialize({
  subject: {
    subject: "name",
    operator: "eq",
    value: "Jacob",
  },
  operator: "or",
  value: {
    subject: "name",
    operator: "eq",
    value: "John",
  },
}) // name eq 'Jacob' or name eq 'John'
```
