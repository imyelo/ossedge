import test from 'ava'
import { toNodeListener } from 'h3'
import supertest from 'supertest'
import { app } from '../src/app.js'

const listener = toNodeListener(app)

test('reply 204 for favicon', async t => {
  const request = supertest(listener)
  const response = await request.get('/favicon.ico')
  t.is(response.status, 204)
})

test('reply 200 for /uploads/test.png', async t => {
  const request = supertest(listener)
  const response = await request.get('/uploads/test.png')
  t.is(response.status, 200)
})

test('reply 404 for /not-found', async t => {
  const request = supertest(listener)
  const response = await request.get('/not-found')
  t.is(response.status, 404)
})
