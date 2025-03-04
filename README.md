# `@ts-java`

This is the root of the monorepo. It contains a collection of packages that provide pure Typescript implementations of Java classes and interfaces.

## Public Packages

- `@ts-java/comparator`: A pure Typescript implementation of the Java `Comparator` interface. For more information [see here](packages/comparator/README.md)
- `@ts-java/optional`: A pure Typescript implementation of the Java `Optional` class. For more information [see here](packages/optional/README.md)

## Private Packages

> These packages are not published to npm.

- `@ts-java/common`: A private package that contains common code shared by all packages.
- `@ts-java/config`: A private package that contains shared configuration (i.e. eslint, tsconfig) for the monorepo.

## Suggestions

If you have a suggestion for another Java class or interface that you would like to see implemented and usable in Typescript, please open an issue and let me know. I would be happy to consider and take on the challenge.

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
