import OSS from 'ali-oss'
import { caching } from 'cache-manager'
import { DiskStore } from 'cache-manager-fs-hash'
import fs from 'fs'
import { appendHeader, createApp, defineEventHandler, sendNoContent, setResponseStatus } from 'h3'
import { Readable } from 'stream'
import {
  APP_CACHE_DIR,
  APP_CACHE_MAX_ITEMS,
  APP_CACHE_TTL,
  APP_OSS_ACCESS_KEY_ID,
  APP_OSS_ACCESS_KEY_SECRET,
  APP_OSS_BUCKET_NAME,
  APP_OSS_REGION,
} from './env.js'
import { useHealth } from './health.js'
import { logger } from './log.js'

const oss = new OSS({
  region: APP_OSS_REGION,
  accessKeyId: APP_OSS_ACCESS_KEY_ID,
  accessKeySecret: APP_OSS_ACCESS_KEY_SECRET,
  bucket: APP_OSS_BUCKET_NAME,
})

export const app = createApp()
;(async () => {
  fs.mkdirSync(APP_CACHE_DIR, { recursive: true })

  const store = new DiskStore({
    path: APP_CACHE_DIR,
    max: APP_CACHE_MAX_ITEMS,
    ttl: APP_CACHE_TTL,
    subdirs: true,
    zip: false,
  })
  const fsCache = await caching(store)

  useHealth(app)

  app.use(
    '/',
    defineEventHandler(async event => {
      try {
        const filePath = event.path === '/' ? 'index.html' : event.path.slice(1)

        logger.info({ path: filePath }, 'Received request')

        if (filePath === 'favicon.ico') {
          logger.debug('Favicon request, sending no content')
          return sendNoContent(event)
        }

        const cached = await fsCache.get<{ content: Buffer; headers: Record<string, string> }>(filePath)
        if (cached) {
          logger.debug({ path: filePath }, 'Serving from cache')
          const { content, headers } = cached
          Object.entries(headers).forEach(([key, value]) => {
            appendHeader(event, key, value)
          })
          return Readable.from(content)
        }

        logger.debug({ path: filePath }, 'Fetching from OSS')
        const result = await oss.get(filePath)
        const headers = {
          'Content-Type': result.res.headers['content-type'],
          'Content-Length': result.res.headers['content-length'],
          'Cache-Control': 'public, max-age=31536000, immutable, no-transform',
          Expires: new Date(Date.now() + 31536000000).toUTCString(),
        }

        await fsCache.set(filePath, { content: result.content, headers })
        logger.debug({ path: filePath }, 'Cached file')

        Object.entries(headers).forEach(([key, value]) => {
          appendHeader(event, key, value)
        })
        return Readable.from(result.content)
      } catch (error) {
        logger.error({ error, path: event.path }, 'Error serving file')
        setResponseStatus(event, 404)
        return 'File not found'
      }
    })
  )
})()
