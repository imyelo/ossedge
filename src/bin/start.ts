#!/usr/bin/env node

import { createServer } from 'node:http'
import { toNodeListener } from 'h3'
import { app } from '../app.js'
import { APP_PORT } from '../env.js'
import { logger } from '../log.js'

createServer(toNodeListener(app)).listen(APP_PORT, () => {
  logger.info(`Server is running on port ${APP_PORT}`)
})
