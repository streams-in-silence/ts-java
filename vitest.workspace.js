import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  './packages/common/vitest.config.ts',
  './packages/comparator/vitest.config.ts',
  './packages/optional/vitest.config.ts',
  './packages/typeguards/vitest.config.ts',
  './packages/utils/vitest.config.ts',
]);
