import dotenvFlow from 'dotenv-flow'

dotenvFlow.config()

export const APP_PORT = +process.env.APP_PORT
export const { APP_OSS_REGION, APP_OSS_ACCESS_KEY_ID, APP_OSS_ACCESS_KEY_SECRET, APP_OSS_BUCKET_NAME } = process.env
