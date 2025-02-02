import eslint from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['*.ts'],
    ignores: ['*.d.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./packages/*/tsconfig.json', './tsconfig.json'],
      },
    },
    plugins: {
      '@typescript-eslint': ts,
      ts,
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...ts.configs['eslint-recommended'].rules,
      ...ts.configs['recommended'].rules,
      'no-console': ['error'],
    },
  },
];
