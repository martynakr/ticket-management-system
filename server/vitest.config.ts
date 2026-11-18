import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.ts'],
    // The first run downloads the MongoDB binary (~100 MB).
    hookTimeout: 120_000,
    // .env isn't loaded in tests.
    env: {
      JWT_SECRET: 'test-secret',
    },
  },
})
