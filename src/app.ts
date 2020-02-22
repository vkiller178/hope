import Koa from 'koa'
import { resolve } from 'path'
import { useKoaServer } from 'routing-controllers'
import { createNextMiddleware } from './next'
import connection from './db'

import { config as lodenv } from 'dotenv'

lodenv()

export const dev = process.env.NODE_ENV !== 'production'

const port = 3000
;(async () => {
  await connection()

  const nextMiddleware = await createNextMiddleware()
  const koaApp = new Koa()

  koaApp.use(nextMiddleware)

  koaApp.listen(port)
})()
