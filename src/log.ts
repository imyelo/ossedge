import pino from 'pino'
import { APP_LOG_FILE, APP_LOG_LEVEL } from './env.js'

export const logger = pino(
  {
    level: APP_LOG_LEVEL,
  },
  APP_LOG_FILE ? pino.destination(APP_LOG_FILE) : process.stdout
)
