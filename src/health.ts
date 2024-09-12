import { type App, defineEventHandler } from 'h3'
import { logger } from './log.js'

export const useHealth = (app: App) => {
  app.use(
    '/readyz',
    defineEventHandler(() => {
      logger.info({ path: '/readyz' }, 'Readyz request')
      return 'OK'
    })
  )
}
