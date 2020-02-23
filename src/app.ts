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
export const apiPrefix = '/api/v1'

const port = 3000
;(async () => {
  await connection()

  const nextMiddleware = await createNextMiddleware()
  const koaApp = new Koa()

  useKoaServer(koaApp, {
    controllers: Object.values(controllers),
    // 确保解析页面的行为在API之前
    middlewares: [nextMiddleware, ...Object.values(middlewares)],
    routePrefix: apiPrefix,
    defaults: { paramOptions: { required: true } },
    defaultErrorHandler: false,
  })

  koaApp.listen(port)
})()
