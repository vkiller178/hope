import Koa from 'koa'
import 'reflect-metadata'
import { useKoaServer } from 'routing-controllers'
import { config as lodenv } from 'dotenv'

import * as controllers from './api'
import * as middlewares from './middlewares'
import { createNextMiddleware } from './middlewares/next'

import connection from './db'

lodenv()

export const dev = process.env.NODE_ENV !== 'production'

const port = 3000
;(async () => {
  await connection()

  const nextMiddleware = await createNextMiddleware()
  const koaApp = new Koa()

  useKoaServer(koaApp, {
    controllers: Object.values(controllers),
    middlewares: Object.values(middlewares),
    routePrefix: '/api/v1',
    defaults: { paramOptions: { required: true } },
    defaultErrorHandler: false,
  })

  koaApp.use(nextMiddleware)

  koaApp.listen(port)
})()
