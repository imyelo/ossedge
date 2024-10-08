# syntax=docker/dockerfile:1.0

FROM node:18 AS builder

WORKDIR /app/

COPY package.json yarn.lock ./
COPY tsconfig.json tsconfig.esm.json ./
COPY .env .env.production ./
COPY src ./src

RUN yarn install
RUN yarn build:standalone

FROM node:18

WORKDIR /app/

COPY --from=builder /app/dist/ ./

CMD ["node", "."]
