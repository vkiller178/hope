import { Controller, Get, Ctx } from 'routing-controllers'
import url from 'url'
import { Context } from 'koa'
import request from 'request'

@Controller('/open')
export default class Proxy {
  /**
   * TODO: https://github.com/niklasvh/html2canvas-proxy-nodejs/blob/master/server.js
   * 完善
   */
  @Get('/proxy')
  async html2canvasProxy(@Ctx() ctx: Context) {
    return ctx.req.pipe(
      request(ctx.query.url.replace('https', 'http')).on('error', (err) => {
        throw new Error(err)
      })
    )
  }
}
