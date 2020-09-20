import Router from 'koa-router'
import { KoaMiddlewareInterface, Middleware } from 'routing-controllers'
import { exportBundleMessage } from '../utils/errorbundle'
import { Context } from 'koa'

import koaWebpack from 'koa-webpack'

@Middleware({ type: 'before' })
export class KoaWebpack implements KoaMiddlewareInterface {
  async use(ctx: Context, next: (err?: any) => Promise<any>) {
    await koaWebpack()(ctx, next)
  }
}
