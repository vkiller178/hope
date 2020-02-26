import { resolve } from 'path'
import { dev, apiPrefix } from '../app'
import { parse } from 'url'

import next from 'next'
import { Context } from 'koa'
import conf from '../nextRoot/next.config'

export async function createNextMiddleware() {
  //TODO: compiling阶段非常慢
  const nextApp = next({ dir: resolve(__dirname, '../nextRoot'), dev, conf })
  await nextApp.prepare()

  const handler = await nextApp.getRequestHandler()

  return async (ctx: Context, next) => {
    if (!~ctx.originalUrl.indexOf(apiPrefix)) {
      return await handler(ctx.req, ctx.res, parse(ctx.originalUrl, true))
    }
    await next()
  }
}
