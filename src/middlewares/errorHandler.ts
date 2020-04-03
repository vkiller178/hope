import Router from 'koa-router'
import { KoaMiddlewareInterface, Middleware } from 'routing-controllers'
import { exportBundleMessage } from '../utils/errorbundle'

@Middleware({ type: 'after' })
export class ResponseHandler implements KoaMiddlewareInterface {
  async use(ctx: Router.IRouterContext, next: (err?: any) => Promise<any>) {
    if (!ctx._matchedRoute) {
      ctx.status = 404
    }
    if (ctx.body && ctx.body.code === undefined) {
      ctx.body = {
        code: 200,
        message: 'success',
        data: !!ctx.body ? ctx.body : {},
      }
    }
    await next()
  }
}

@Middleware({ type: 'before' })
export class ErrorHandler implements KoaMiddlewareInterface {
  async use(ctx: Router.IRouterContext, next: (err?: any) => Promise<any>) {
    /**
     * 如果返回 400 以上的状态码，客户端 axios 会进入 catch 状态
     * 所以只要服务有响应则使用 200 的状态码，具体的业务错误使用code返回
     */
    ctx.status = 200
    try {
      await next()
    } catch (e) {
      const a = exportBundleMessage(e.message)
      ctx.body = {
        code: a.code,
        msg: a.message,
      }
    }
  }
}
