import Koa from 'koa'
import 'reflect-metadata'
import { useKoaServer } from 'routing-controllers'

import { config as lodenv } from 'dotenv'
//优先于业务代码加载
lodenv()
import * as controllers from './api'
import * as middlewares from './middlewares'
import jwtMiddleware from './middlewares/jwt'

import connection from './db'

export const dev = process.env.NODE_ENV !== 'production'
export const apiPrefix = '/api/v1'

const port = 3000
;(async () => {
  await connection()

  const koaApp = new Koa()

  koaApp.use(jwtMiddleware)

  useKoaServer(koaApp, {
    controllers: Object.values(controllers),
    middlewares: [...Object.values(middlewares)],
    routePrefix: apiPrefix,
    defaults: { paramOptions: { required: true } },
    defaultErrorHandler: false,
  })

  koaApp.listen(port)
  console.log('app listening  at 3000')
})()
