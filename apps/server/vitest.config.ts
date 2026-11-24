import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

// Local secrets live in the git-ignored test-env.ts (see test-env.example.ts).
// Without it (e.g. CI), fall back to environment variables.
const defaultTestEnv: Record<string, string> = {
  NODE_ENV: 'test',
  REDIS_URL: process.env.REDIS_URL ?? 'redis://localhost:6379/1',
  TBQN_BASE_URL: process.env.TBQN_BASE_URL ?? ''
}

async function loadTestEnv (): Promise<Record<string, string>> {
  const localEnvPath = join(__dirname, 'test-env.ts')
  if (!existsSync(localEnvPath)) return defaultTestEnv
  const { default: testSecrets } = await import(pathToFileURL(localEnvPath).href)
  return { ...defaultTestEnv, ...testSecrets }
}

export default defineConfig(async () => ({
  plugins: [tsconfigPaths()],
  // Point Vite to load .env files from a specific directory if needed:
  // envDir: './',
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts', 'test/**/*.{test,spec}.ts'],
    clearMocks: true,
    env: await loadTestEnv()
  }
}))
