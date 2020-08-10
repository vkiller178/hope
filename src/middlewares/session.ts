import session from 'koa-session'
import { KoaMiddlewareInterface, Middleware } from 'routing-controllers'
import { apiPrefix } from '../app'
import { bundleWithCode } from '../utils/errorbundle'

const CONFIG = {
  key: 'koa.sess' /** (string) cookie key (default is koa.sess) */,
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  autoCommit: true /** (boolean) automatically commit headers (default true) */,
  overwrite: true /** (boolean) can overwrite or not (default true) */,
  httpOnly: true /** (boolean) httpOnly or not (default true) */,
  signed: true /** (boolean) signed or not (default true) */,
  rolling: false /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */,
  renew: false /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/,
  secure: false /** (boolean) secure cookie*/,
  sameSite: null /** (string) session cookie sameSite options (default null, don't set it) */,
}

@Middleware({ type: 'before' })
export class Session implements KoaMiddlewareInterface {
  async use(ctx: any, next: (err?: any) => Promise<any>) {
    ctx.app.keys = ['some secret hurr']
    await session(CONFIG, ctx.app)(ctx, next)
  }
}

@Middleware({ type: 'before' })
export class CheckSession implements KoaMiddlewareInterface {
  async use(ctx: any, next: (err?: any) => Promise<any>) {
    const { uid } = ctx.session
    if (ctx.path.indexOf(`${apiPrefix}/open/`) !== 0) {
      // open开始的接口不做权限验证
      if (!uid) {
        ctx.status = 401
        bundleWithCode('需要先登陆！！')
      }
    }
    await next()
  }
}
