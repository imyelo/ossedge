# OSS Edge

> 🚀 Reverse proxy for OSS, a lightweight CDN alternative.

## Configuration

OSS Edge uses [dotenv-flow](https://github.com/kerimdzhanov/dotenv-flow) for environment variable configuration. You can configure it by either:

1. Creating a `.env.local` file (which is ignored by git)

   OR

2. Directly exporting environment variables in your shell

Here's an example of the configuration:

```bash
APP_PORT=3000
APP_LOG_LEVEL=info
APP_LOG_FILE=/tmp/ossedge.log
APP_OSS_REGION=your_oss_region
APP_OSS_ACCESS_KEY_ID=your_access_key_id
APP_OSS_ACCESS_KEY_SECRET=your_access_key_secret
APP_OSS_BUCKET_NAME=your_bucket_name
APP_CACHE_DIR=./.ossedge
APP_CACHE_TTL=3600
APP_CACHE_MAX_ITEMS=1000
```

### List of Environment Variables

- `APP_PORT`: The port number on which the server will run.
- `APP_LOG_LEVEL`: [The logging level](https://github.com/pinojs/pino/blob/main/docs/api.md#levels) (e.g., 'info', 'debug', 'error').
- `APP_LOG_FILE`: The path to the log file. If not set, logs will be output to stdout.
- `APP_OSS_REGION`: The region of your Alibaba Cloud OSS bucket.
- `APP_OSS_ACCESS_KEY_ID`: Your Alibaba Cloud access key ID.
- `APP_OSS_ACCESS_KEY_SECRET`: Your Alibaba Cloud access key secret.
- `APP_OSS_BUCKET_NAME`: The name of your OSS bucket.
- `APP_CACHE_DIR`: The directory where cached files will be stored.
- `APP_CACHE_TTL`: The time-to-live for cached items in seconds.
- `APP_CACHE_MAX_ITEMS`: The maximum number of items to store in the cache.

Make sure to keep your .env file secure and do not commit it to version control.

## Usage

### Docker

To run OSS Edge using Docker:

```bash
docker run --rm -p 3000:3000 -v ./.env.local:/app/.env ghcr.io/imyelo/oss-edge:latest
```

### Use as a CLI

```bash
npx oss-edge
```

### Use as a Node.js module

```bash
yarn add oss-edge
```

```javascript
import { createServer } from 'node:http'
import { toNodeListener } from 'h3'
import { app } from 'oss-edge'

createServer(toNodeListener(app)).listen(3000)
```

## License

Apache-2.0 &copy; [yelo](https://github.com/imyelo), 2024 - present
