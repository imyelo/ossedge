# syntax=docker/dockerfile:1.0

## app

FROM node:18

WORKDIR /app/

COPY ./lib /app/
CMD ["node", "."]
