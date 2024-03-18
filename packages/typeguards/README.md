# Typeguards

Bring easier type checks to your TypeScript project with `typeguards`. This library provides many utility functions that are simple wrappers around easy JavaScript built-in checks.

All this library does is wrap repetitive checks into simple little functions so you don't have to. Under the hood it looks like this:

```typescript
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}
```

## Installation

Use your favorite package manager to add to typeguards your project.

npm:

```bash
npm install typeguards
```

## Usage

```ts
import { isString } from '@sis/typeguards';

function getOptionalString(): string | undefined {}

const maybeString = getOptionalString();

if (isString(maybeString)) {
  // definitely a string here
  maybeString.toLowerCase();
}
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[The Unlicense](https://choosealicense.com/licenses/unlicense/)
