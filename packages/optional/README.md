# `@ts-java/optional`

A pure Typescript implementation of Java's `Optional` class.

## Features

-

## Installation

Install the package using your package manager of choice.

### npm

```bash
npm install -S @ts-java/optional
```

### yarn

```bash
yarn add @ts-java/optional
```

### pnpm

```bash
pnpm add @ts-java/optional
```

## Examples

### import

```typescript
import { Optional } from '@ts-java/optional';

// or require
const { Optional } = require('ts-java/optional');
```

### `Optional.empty<T>`

This will create an empty Optional, meaning that no value is present for it.

```typescript
// not providing a generic type will result in Optional<null>.
const optional = Optional.empty();

// you can also provide a generic to satisfy your types
const otherOptional = Optional.empty<string>();

// this will also work if you define a type for the variable
const stringOptional: Optional<string> = Optional.empty();
```

### `Optional.of<T>`

Use the `of` method to create a new Optional with the specified value.

```typescript
Optional.of('foo'); // Optional<string>
Optional.of(10); // Optional<number>
Optional.of(false); // Optional<boolean>
Optional.of({ foo: 'bar' }); // Optional<{foo: string}>
Optional.of(null); // throws a NullPointerException
Optional.of(undefined); // throws a NullPointerException
```

### `Optional.ofNullable<T>`

If you do not know if your value might be nullable or not, you can use the `ofNullable` method to avoid a `NullPointerException`. If the value is `null`, it will return an empty Optional.

```typescript
Optional.ofNullable('foo'); // Optional<string | null>
Optional.ofNullable(10); // Optional<number | null>
Optional.ofNullable(false); // Optional<boolean | null>
Optional.ofNullable({ foo: 'bar' }); // Optional<{foo: string} | null>
Optional.ofNullable(null); // Optional<null>;
Optional.ofNullable(undefined); // Optional<undefined | null>
```

### `get`

Returns the value of the Optional. If the value is for any reason `null`, it will throw a `NoSuchElementException`.

```typescript
Optional.of('foo').get(); // returns "foo";

Optional.ofNullable<string>(null).get(); // throws a NoSuchElementException
```

### `isPresent`

To prevent an exception being thrown by the `get` method, you should first check for the presence of the value. It will also exclude `null` from being a potential value (i.e. when using `ofNullable`).

```typescript
const optional = Optional.ofNullable<string>('foo'); // Optional<string | null>
if (optional.isPresent()) {
  optional.get().toUpperCase(); // optional will be Optional<string>
}
```

### `ifPresent`

You can invoke a function with the value of the `Optional` if the value is present. Otherwise, it won't be called.

```typescript
Optional.of('foo').ifPresent((value) => console.log(value)); // logs "foo"
Optional.ofNullable<string>().ifPresent((value) => console.log(value)); // won't be called
```

### `equals`

> To keep this package as small as possible, it does not rely on any external library for checking equality. A very crude comparison of key-value between objects is used for this implementation - so use with caution when comparing object-values.

Can be used to check if the value of one `Optional` is the same of another.

```typescript
Optional.of(1).equals(Optional.of(1)); // true
Optional.of(1).equals(Optional.of(2)); // false

// also works with objects
Optional.of({ foo: 'bar' }).equals(Optional.of({ foo: 'bar' })); // true
```

### `filter`

Apply a filter on the value of the optional. If the value is present and passes the provided filter check, a new Optional with the value is returned. Otherwise, an empty Optional will be returned.

```typescript
Optional.of(1).filter((value) => value === 1); // returns a new Optional<number> with value 1
Optional.of(1).filter((value) => value > 1); // returns an empty Optional<number>
Optional.ofNullable<number>(null).filter((value) => value === 1); // returns an empty Optional<number>
```

## License

This project is licensed under the Unlicense - see the [LICENSE](UNLICENSE.md) file for details.
