import { dev, apiPrefix } from '../app'
import { parse } from 'url'
import { resolve } from 'path'

import next from 'next'
import { Context } from 'koa'

const conf = {
  typescript: {
    ignoreDevErrors: true,
    ignoreBuildErrors: true,
  },

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config
    config.plugins.push(
      new webpack.DefinePlugin({
        window: 'window',
      })
    )

    return config
  },
}

export async function createNextMiddleware() {
  //TODO: compiling阶段非常慢
  const nextApp = next({
    dir: resolve(__dirname, '../nextRoot'),
    conf,
    dev,
  })
  await nextApp.prepare()

  const handler = await nextApp.getRequestHandler()

  return async (ctx: Context, next) => {
    if (!~ctx.originalUrl.indexOf(apiPrefix)) {
      return await handler(ctx.req, ctx.res, parse(ctx.originalUrl, true))
    }
    await next()
  }
}
