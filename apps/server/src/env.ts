type NodeEnv = 'development' | 'test' | 'production'

interface Env {
  REDIS_URL: string;
  NODE_ENV: NodeEnv;
}

const ENV: Env = {
  REDIS_URL: process.env.REDIS_URL ?? '',
  NODE_ENV: (process.env.NODE_ENV as NodeEnv) ?? 'development',
}

export default ENV
