import dotenvFlow from 'dotenv-flow'
import path from 'path'

dotenvFlow.config()

export const APP_PORT = +process.env.APP_PORT
export const APP_LOG_LEVEL = process.env.APP_LOG_LEVEL || 'info'
export const APP_LOG_FILE = process.env.APP_LOG_FILE ? path.resolve(process.cwd(), process.env.APP_LOG_FILE) : false
export const { APP_OSS_REGION, APP_OSS_ACCESS_KEY_ID, APP_OSS_ACCESS_KEY_SECRET, APP_OSS_BUCKET_NAME } = process.env
export const APP_CACHE_DIR = path.resolve(process.cwd(), process.env.APP_CACHE_DIR)
export const APP_CACHE_TTL = +process.env.APP_CACHE_TTL
export const APP_CACHE_MAX_ITEMS = +process.env.APP_CACHE_MAX_ITEMS
