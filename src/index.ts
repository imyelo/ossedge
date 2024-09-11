import { createServer } from 'node:http'
import { toNodeListener } from 'h3'
import { app } from './app.js'
import { APP_PORT } from './env.js'

createServer(toNodeListener(app)).listen(APP_PORT, () => {
  console.log(`Server is running on port ${APP_PORT}`)
})
