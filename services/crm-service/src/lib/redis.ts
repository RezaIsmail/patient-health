import Redis from 'ioredis'

const REDIS_URL = process.env.REDIS_URL ?? 'redis://localhost:6379'

function createClient(role: 'pub' | 'sub'): Redis {
  const client = new Redis(REDIS_URL, {
    lazyConnect: true,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy: (times) => {
      if (times > 20) return null
      return Math.min(times * 100, 3000)
    },
  })

  client.on('connect', () => console.info(`[redis:crm:${role}] connected`))
  client.on('error', (err: Error) => console.error(`[redis:crm:${role}] error: ${err.message}`))

  return client
}

export const redisPub = createClient('pub')
export const redisSub = createClient('sub')

export async function connectRedis(): Promise<void> {
  await Promise.all([redisPub.connect(), redisSub.connect()])
}

export async function disconnectRedis(): Promise<void> {
  redisPub.disconnect()
  redisSub.disconnect()
}
