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
