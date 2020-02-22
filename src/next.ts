import { resolve } from 'path'
import { dev } from './app'
import { parse } from 'url'

import next from 'next'
import { Context } from 'koa'

export async function createNextMiddleware() {
  const nextApp = next({ dir: resolve(__dirname, '.'), dev })
  await nextApp.prepare()

  const handler = await nextApp.getRequestHandler()

  return async (ctx: Context, next) => {
    if (!~ctx.originalUrl.indexOf('api')) {
      await handler(ctx.req, ctx.res, parse(ctx.originalUrl, true))
    }
    await next()
  }
}
