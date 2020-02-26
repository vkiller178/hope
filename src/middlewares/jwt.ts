import { KoaMiddlewareInterface, Middleware } from 'routing-controllers'
import jwt from 'koa-jwt'
import jsonwebtoken from 'jsonwebtoken'
import { apiPrefix } from '../app'

const jwtMiddleware = jwt({
  secret: process.env.JWT_SECRET,
  cookie: 'token',
}).unless({
  path: [/open/],
})

const expHours = 24

/**
 *
 * @param secretInfo 需要加密的信息，可以被解析出来
 */
export const createToken = (secretInfo: any): string => {
  return jsonwebtoken.sign(
    {
      data: secretInfo,
      // 过期时间为一个小时
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * expHours,
    },
    process.env.JWT_SECRET
  )
}

export const decodeToken = (
  token: string
): { data: any; exp: number; iat: number } => {
  return jsonwebtoken.decode(token)
}

export default jwtMiddleware
