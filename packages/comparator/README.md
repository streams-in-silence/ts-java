# @ts-java/comparator

A pure Typescript implementation of the Java `Comparator` functional interface.

This package provides an abstract class that can be extended to create a custom `Comparator` implementation as well as a set of static methods that will create an instance of a `Comparator`

## Features

- Easily sort arrays of `string`, `number`, `boolean` and `Date` elements
- Predefined `CASE_INSENSITIVE_ORDER` comparator for comparing `strings` in lexographical order, ignoring case differences
- Allow your classes or objects to be sorted by implementing the `Comparable<T>` interface
- Chain multiple sorting criteria to get a more refined sorting result
- Define where you want `null` values to be placed in the sorted array
- Create your own `Comparator` implementation to re-use the same sorting logic across multiple places

## Installation

Install the package using your package manager of choice.

### npm

```bash
npm install -S @ts-java/comparator
```

### yarn

```bash
yarn add @ts-java/comparator
```

### pnpm

```bash
pnpm add @ts-java/comparator
```

## Examples

The most basic usage is to use one of the two static methods to create a new instance of a `Comparator`.

### `Comparator.naturalOrder`

Use the `naturalOrder` method to sort an array of `Comparable` elements in their natural order.

> `number`, `string`, `boolean` and `Date` are considered `Comparable` elements by default.
>
> Additionally, any class or object that implements the `Comparable<T>` interface can be sorted using the `naturalOrder` method.

#### Sort an array of numbers

Number elements are sorted in ascending order.

```typescript
import { Comparator } from '@ts-java/comparator';

const numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];

numbers.sort(Comparator.naturalOrder().compare);

console.log(numbers); // [1, 1, 2, 3, 3, 4, 5, 5, 5, 6, 9]
```

#### Sort an array of strings

String elements are sorted lexicographically using the `String.prototype.localeCompare` method.

```typescript
import { Comparator } from '@ts-java/comparator';

const strings = ['foo', 'bar', 'baz', 'qux', 'quux'];

strings.sort(Comparator.naturalOrder().compare);

console.log(strings); // ['bar', 'baz', 'foo', 'quux', 'qux']
```

#### Sort an array of booleans

The `naturalOrder` method will sort `true` values before `false` values.

```typescript
import { Comparator } from '@ts-java/comparator';

const booleans = [true, false, true, false, true];

booleans.sort(Comparator.naturalOrder().compare);

console.log(booleans); // [true, true, true, false, false]
```

#### Sort an array of Dates

Date elements are sorted chronologically in ascending order.

```typescript
import { Comparator } from '@ts-java/comparator';

const dates = [
  new Date('2025-01-01'),
  new Date('2025-01-05'),
  new Date('2025-01-03'),
  new Date('2025-01-02'),
  new Date('2025-01-04'),
];

dates.sort(Comparator.naturalOrder().compare);

console.log(dates);
// [
//   new Date('2025-01-01'),
//   new Date('2025-01-02'),
//   new Date('2025-01-03'),
//   new Date('2025-01-04'),
//   new Date('2025-01-05'),
// ]
```

### Comparing objects

In your typical application, you will not only have arrays of primitive values, but also arrays of objects or classes. This package provides multiple ways to sort these kinds of arrays.

#### Implement the `Comparable<T>` interface

If you have control over the class or the object you want to sort, you can implement the `Comparable<T>` interface and provide your own implementation of the `compareTo` method. This way, you can again use `Comparator.naturalOrder` to sort the array.

```typescript
import type { Comparable } from '@ts-java/comparator';
import { Comparator } from '@ts-java/comparator';

class Person implements Comparable<Person> {
  public name: string;
  public age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  public compareTo(other: Person): number {
    return this.name.localeCompare(other.name);
  }
}

const people = [
  new Person('John', 20),
  new Person('Alice', 25),
  new Person('Bob', 30),
];

people.sort(Comparator.naturalOrder().compare);

console.log(people);
// [
//   new Person('Alice', 25),
//   new Person('Bob', 30),
//   new Person('John', 20),
// ]
```

#### `Comparator.comparing`

If you don't have control over the class or object you want to sort, you can use the static `Comparator.comparing` method to create a `Comparator` that uses a
key extractor function to get the `Comparable` value of an object and sorts the array based on that value in natural order.

```typescript
import { Comparator } from '@ts-java/comparator';

type Person = { name: string; age: number };

const people = [
  { name: 'John', age: 20 },
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
];

// Sort the array of people by their name in natural order
people.sort(Comparator.comparing((person) => person.name).compare);

console.log(people);
// [
//   { name: 'Alice', age: 25 },
//   { name: 'Bob', age: 30 },
//   { name: 'John', age: 20 }
// ]
```

### Creating a custom `Comparator` implementation

If you need more control over the sorting process or want to re-use the same sorting logic in multiple places, you can create a custom `Comparator` implementation by extending the `Comparator` class.

```typescript
import { Comparator } from '@ts-java/comparator';

type Person = { name: string; age: number };

class PersonComparator extends Comparator<Person> {
  public override compare(a: Person, b: Person): number {
    return a.name.localeCompare(b.name);
  }
}

const people = [
  { name: 'John', age: 25 },
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
];

people.sort(new PersonComparator().compare);

console.log(people);
// [
//   { name: 'Alice', age: 25 },
//   { name: 'Bob', age: 30 },
//   { name: 'John', age: 20 }
// ]
```

### Reversing the order

#### `Comparator.reverseOrder`

This will create a `Comparator` that will sort the elements in the reverse order of the natural order.

```typescript
import { Comparator } from '@ts-java/comparator';

const numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];

numbers.sort(Comparator.reverseOrder().compare);

console.log(numbers); // [9, 6, 5, 5, 5, 4, 3, 3, 2, 1, 1]
```

#### Use the `reversed` method of a `Comparator` instance

If you already have an instance of a `Comparator`, you can use the `reversed` method to create a new `Comparator` that will sort the elements in the reverse order of the original `Comparator`.

```typescript
import { Comparator } from '@ts-java/comparator';

type Person = { name: string; age: number };

class PersonComparator extends Comparator<Person> {
  public override compare(a: Person, b: Person): number {
    return a.name.localeCompare(b.name);
  }
}

const people = [
  { name: 'John', age: 25 },
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
];
const personComparator = new PersonComparator();

people.sort(personComparator.reversed().compare);

console.log(people);
// [
//   { name: 'John', age: 25 },
//   { name: 'Bob', age: 30 },
//   { name: 'Alice', age: 20 }
// ]
```

### Comparing by multiple properties

Sometimes, sorting an array of objects by just a single property is not enough as some objects might have the same value for that property. In such cases, you can use the `thenComparing` method to pass a second `Comparator` that will be used to sort the elements that have the same value for the first property.

```typescript
import { Comparator } from '@ts-java/comparator';

type Person = { name: string; age: number };

const people = [
  { name: 'John', age: 25 },
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
];

people.sort(
  Comparator
    // sort by age
    .comparing((person) => person.age)
    // then sort by name
    .thenComparing(Comparator.comparing((person) => person.name)).compare
);

console.log(people);
// [
//   { name: 'Alice', age: 25 },
//   { name: 'John', age: 25 },
//   { name: 'Bob', age: 30 }
// ]
```

### Handling `null` and `undefined` values

Due to the nature of JavaScript, `undefined` values will always be sorted after any other value and not passed into the compare function. (for more information see [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#description))

If your array contains `null` values and you use the `Comparator.naturalOrder` method, it will throw an error. To handle `null` values, you can wrap a `Comparator` instance with the `Comparator.nullsFirst` or `Comparator.nullsLast` method.

```typescript
import { Comparator } from '@ts-java/comparator';

const numbers = [3, 1, null, 4, 1, 5, 9, 2, 6, 5, 3, 5];
// null first
numbers.sort(Comparator.nullsFirst(Comparator.naturalOrder()).compare);

console.log(numbers); // [null, 1, 1, 2, 3, 3, 4, 5, 5, 5, 6, 9]

// or null last
numbers.sort(Comparator.nullsLast(Comparator.naturalOrder()).compare);

console.log(numbers); // [1, 1, 2, 3, 3, 4, 5, 5, 5, 6, 9, null]
```

## Links

- Project homepage: [
  @ts-java/comparator](https://github.com/streams-in-silence/ts-java/tree/main/packages/comparator)
- Repository: [GitHub](https://github.com/streams-in-silence/ts-java)
- Issue tracker: [GitHub](https://github.com/streams-in-silence/ts-java/issues)
- Java Documentation: [Comparator](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Comparator.html)

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

Alternatively, you can also clone this repository into a devcontainer which will automatically run `pnpm install` so you can get started even faster.

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
