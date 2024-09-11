import OSS from 'ali-oss'
import { appendHeader, createApp, defineEventHandler, sendNoContent, setResponseStatus } from 'h3'
import { Readable } from 'stream'
import { APP_OSS_ACCESS_KEY_ID, APP_OSS_ACCESS_KEY_SECRET, APP_OSS_BUCKET_NAME, APP_OSS_REGION } from './env.js'

const oss = new OSS({
  region: APP_OSS_REGION,
  accessKeyId: APP_OSS_ACCESS_KEY_ID,
  accessKeySecret: APP_OSS_ACCESS_KEY_SECRET,
  bucket: APP_OSS_BUCKET_NAME,
})

export const app = createApp()

app.use(
  '/',
  defineEventHandler(async event => {
    try {
      const path = event.path === '/' ? 'index.html' : event.path.slice(1)

      if (path === 'favicon.ico') {
        return sendNoContent(event)
      }

      const result = await oss.get(path)

      appendHeader(event, 'Content-Type', result.res.headers['content-type'])
      appendHeader(event, 'Content-Length', result.res.headers['content-length'])
      appendHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable, no-transform')
      appendHeader(event, 'Expires', new Date(Date.now() + 31536000000).toUTCString())

      return Readable.from(result.content)
    } catch (error) {
      setResponseStatus(event, 404)
      return 'File not found'
    }
  })
)
