import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    // Make describe, it, expect, beforeAll, etc. available without importing them.
    globals: true,
    include: ['tests/**/*.test.ts'],
    // Starting an in-memory MongoDB takes a moment, and the very first run
    // downloads the MongoDB binary (~100 MB), so allow setup hooks more time.
    hookTimeout: 120_000,
    // Env variables for tests. The real .env isn't loaded here.
    env: {
      JWT_SECRET: 'test-secret',
    },
  },
})


