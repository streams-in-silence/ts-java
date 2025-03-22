import eslint from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['**/coverage', '**/dist'],
  },
  {
    files: ['src/**/*.ts'],
    ignores: ['*.d.ts'],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': ts,
      ts,
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...ts.configs['eslint-recommended'].rules,
      ...ts.configs['recommended'].rules,
      'no-dupe-class-members': 'off', // handled by @typescript-eslint/no-dupe-class-members
      '@typescript-eslint/no-dupe-class-members': 'error',
      'no-console': ['error'],
    },
  },
];
