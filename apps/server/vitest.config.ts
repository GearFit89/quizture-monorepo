import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import testSecrets from './test-env'

export default defineConfig({
  plugins: [tsconfigPaths()],
  // Point Vite to load .env files from a specific directory if needed:
  // envDir: './',
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts', 'test/**/*.{test,spec}.ts'],
    clearMocks: true,
    // Define test environment variables directly here:
    env: testSecrets
  },
})
