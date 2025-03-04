# `@ts-java/optional`

A pure Typescript implementation of the Java 8 `Optional` class.

## Features

- full Typescript support
- provides methods that handle presence/absence of a value (`orElse`, `ifPresent`, etc.)
- basic implementation of the `equals` and `toString` methods

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

## Usage

### import

```typescript
import { Optional } from '@ts-java/optional';

// or with require
const { Optional } = require('ts-java/optional');
```

### Creating a new Optional

#### `Optional.empty<T>`

This creates an empty Optional, meaning that no value is present for it.

```typescript
// not providing a generic type will result in Optional<null>.
const optional = Optional.empty();

// you can also provide a generic to satisfy your types
const otherOptional = Optional.empty<string>();

// this will also work if you define a type for the variable
const stringOptional: Optional<string> = Optional.empty();
```

#### `Optional.of<T>`

Use the `of` method to create a new Optional with the specified value.

```typescript
Optional.of('foo'); // Optional<string>
Optional.of(10); // Optional<number>
Optional.of(false); // Optional<boolean>
Optional.of({ foo: 'bar' }); // Optional<{foo: string}>
Optional.of(null); // throws a NullPointerException
Optional.of(undefined); // throws a NullPointerException
```

#### `Optional.ofNullable<T>`

If you do not know if your value might be nullable or not, you can use the `ofNullable` method to avoid a `NullPointerException`. If the value is `null`, it will return an empty Optional.

```typescript
Optional.ofNullable('foo'); // Optional<string | null>
Optional.ofNullable(10); // Optional<number | null>
Optional.ofNullable(false); // Optional<boolean | null>
Optional.ofNullable({ foo: 'bar' }); // Optional<{foo: string} | null>
Optional.ofNullable(null); // Optional<null>;
Optional.ofNullable(undefined); // Optional<undefined | null>
```

### Getting the value of an Optional

#### `get`

> The preferred alternative to this method is [orElseThrow](#orElseThrow), which was introduced only later in Java 10 (compared to `get`, which was available since Java 8).
>
> The `get` method was kept in this package for the sake of completeness.

Returns the value of the Optional. If no value is present (`null`), it will throw a `NoSuchElementException`.

```typescript
Optional.of('foo').get(); // returns "foo";

Optional.ofNullable<string>(null).get(); // throws a NoSuchElementException
```

#### `orElseThrow()`

Returns the value of the Optional. If no value is present (`null`), it will throw a `NoSuchElementException`.

```typescript
Optional.of('foo').orElseThrow(); // returns "foo";

Optional.ofNullable<string>(null).orElseThrow(); // throws a NoSuchElementException
```

In the Java counterpart, an overload of this method is available where it is possible to provide a custom `exceptionSupplier`. You can also do this with this package.

```typescript
Optional.of('foo').orElseThrow(() => new Error('Oops')); // returns "foo";
Optional.ofNullable<string>(null).orElseThrow(() => new Error('Oops')); // throws the Error
```

### Handling the absence of a value

To prevent an exception being thrown by the `get` methods, you should first check for the presence of the value. It will also exclude `null` from being a potential value (i.e. when using `ofNullable`).

```typescript
const optional = Optional.ofNullable<string>('foo'); // Optional<string | null>
if (optional.isPresent()) {
  optional.orElseThrow().toUpperCase(); // optional will be Optional<string>
}
```

Alternatively, you can use one of the following methods to take care of empty values.

#### `orElse`

```typescript
Optional.of('foo').orElse('bar'); // returns "foo";
Optional.ofNullable<string>(null).orElse('bar'); // returns "bar"
```

#### `orElseGet`

```typescript
function getOther(): string {
  return 'bar';
}

Optional.of('foo').orElseGet(getOther); // returns "foo";
Optional.ofNullable<string>(null).orElseGet(getOther); // calls getOther() and returns "bar"
```

### Transforming the Optional

If you already have an Optional, you can use the following methods to transform/filter it

#### map

Applies the provided mapping function and wraps the transformed value in a new Optional. This does not modify the original value.

```typescript
const optional = Optional.of(2);

const squared = optional.map((value) => value * value); // returns a new Optional with value=4
```

#### flatMap

Similar to `map` with the difference that it does not wrap the transformed value in a new Optional. This is because the mapping function must already return an Optional.

```typescript
const optional = Optional.of(2);

const squared = optional.flatMap((value) => Optional.of(value * value)); // returns a new Optional with value=4
```

#### filter

Apply a filter on the value of the optional. If the value is present and passes the provided filter check, a new Optional with the value is returned. Otherwise, an empty Optional will be returned.

```typescript
Optional.of(1).filter((value) => value === 1); // returns a new Optional<number> with value 1
Optional.of(1).filter((value) => value > 1); // returns an empty Optional<number>
Optional.ofNullable<number>(null).filter((value) => value === 1); // returns an empty Optional<number>
```

### Other utility methods

#### `isPresent`

This indicates if the Optional has a value. Also acts as typeguard and eliminates `null` as potential value.

```typescript
const optional = Optional.ofNullable<string>(null); // Optional<string | null>
if (optional.isPresent()) {
  optional.orElseThrow(); // will not throw an error
}
```

#### `isEmpty`

Indicates that the value of the Optional is absent. Unlike `isPresent`, this does not act as a typeguard.

```typescript
const optional = Optional.ofNullable<string>(null); // Optional<string | null>
if (optional.isEmpty()) {
  optional.orElseThrow(); // will definitely throw an error
}
```

#### `ifPresent`

This will call the provided function only if a value is present.

```typescript
Optional.of('foo').ifPresent((value) => console.log(value)); // logs 'foo'
Optional.ofNullable<string>().ifPresent((value) => console.log(value)); // won't be called
```

#### `ifPresentOrElse`

This will call the provided function with the value, if it is present.
If the value is absent, it will call the other function instead.

```typescript
const action = (value) => console.log(value);
const emptyAction = () => console.log('bar');

Optional.of('foo').ifPresentOrElse(action, emptyAction); // logs 'foo'
Optional.ofNullable<string>().ifPresentOrElse(action, emptyAction); // logs 'bar'
```

#### `equals`

Can be used to check if the value of one `Optional` is the same of another.

```typescript
Optional.of(1).equals(Optional.of(1)); // true
Optional.of(1).equals(Optional.of(2)); // false

// also works with objects
Optional.of({ foo: 'bar' }).equals(Optional.of({ foo: 'bar' })); // true
```

> To keep this package as small as possible, it does not rely on any external library for checking equality. A very crude comparison of key-value between objects is used for this implementation - so use with caution when comparing object-values.

#### `toString`

```typescript
Optional.of('foo').toString(); // returns Optional['foo']
Optional.ofNullable(null).toString(); // returns Optional[null]
```

## Links

- Project homepage: [
  @ts-java/optional](https://github.com/streams-in-silence/ts-java/tree/main/packages/optional)
- Repository: [GitHub](https://github.com/streams-in-silence/ts-java)
- Issue tracker: [GitHub](https://github.com/streams-in-silence/ts-java/issues)
- Java Documentation: [Optional](https://docs.oracle.com/javase/8/docs/api/java/util/Optional.html)

## Contributing

Pull requests are welcome.

- Fork the repository
- Create your feature branch: `git checkout -b feature/your-feature`
- Make your changes
  - Make sure to follow the code style of the project (Prettier and ESLint are configured)
  - Make sure to add tests for your changes (Vitest is used for testing)
- Push to the branch
- Create a new Pull Request

If you have any suggestions, bug reports or questions, feel free to open an issue on GitHub.

### Development

To start developing, clone the repository and install the dependencies using pnpm.

```bash
pnpm install
```

### Testing

To run the tests, use the `test` script

```bash
pnpm test
```

Or to run the tests in watch mode

```bash
pnpm test:watch
```

### Check the types

To check that the types are correct, use the `type-check` script

```bash
pnpm typecheck
```

## License

This project is licensed under the Unlicense - see the [UNLICENSE](UNLICENSE.md) file for details.
