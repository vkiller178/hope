import { dev, apiPrefix } from '../app'
import { resolve } from 'path'
import next from 'next'
import { Context } from 'koa'
import { time, timeLog } from 'console'
import { UrlWithParsedQuery } from 'url'

const conf = {
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        window: 'window',
      })
    )

    return config
  },
}

export async function createNextMiddleware() {
  const nextApp = next({
    dir: resolve(__dirname, '../nextRoot'),
    //@ts-ignore
    conf,
    dev,
  })
  time('next prepare')

  await nextApp.prepare()

  timeLog('next prepare')

  const handler = await nextApp.getRequestHandler()

  return async (ctx: Context, next) => {
    if (!~ctx.originalUrl.indexOf(apiPrefix)) {
      const url = new URL(ctx.originalUrl, ctx.origin)
      console.time(url.pathname)
      const result = await handler(
        ctx.req,
        ctx.res,
        url.pathname as unknown as UrlWithParsedQuery
      )
      console.timeEnd(url.pathname)
      return result
    }
    await next()
  }
}
