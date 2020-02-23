import { resolve } from 'path'
import { dev, apiPrefix } from '../app'
import { parse } from 'url'

import next from 'next'
import { Context } from 'koa'
import { Middleware } from 'routing-controllers'

export async function createNextMiddleware() {
  const nextApp = next({ dir: resolve(__dirname, '../nextRoot'), dev })
  await nextApp.prepare()

  const handler = await nextApp.getRequestHandler()

  @Middleware({ type: 'before' })
  class NextMiddleware {
    async use(ctx: Context, next) {
      if (!~ctx.originalUrl.indexOf(apiPrefix)) {
        return await handler(ctx.req, ctx.res, parse(ctx.originalUrl, true))
      }
      await next()
    }
  }

  return NextMiddleware
}
