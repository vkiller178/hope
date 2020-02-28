import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Ctx,
  CookieParam,
  CookieParams,
  Params,
  BodyParam,
} from 'routing-controllers'
import { UserModel } from '../db/models'
import { bundleWithCode } from '../utils/errorbundle'
import { createToken, decodeToken } from '../middlewares/jwt'
import { Context } from 'koa'

@Controller()
export default class User {
  @Get('/user/:id')
  async allUser(@Param('id') id) {
    return await UserModel.findOne(id)
  }
  @Get('/user')
  async getSelf(@CookieParams() { token }) {
    const { data } = decodeToken(token)
    return {
      id: +data,
      username: (await UserModel.findOne({ where: { id: data } })).username,
    }
  }
  @Post('/open/registry')
  async createUser(@Body() body) {
    if (!body.username) bundleWithCode('username为必填项目')
    if (!body.password) bundleWithCode('password为必填项目')

    let u: UserModel

    if (
      (
        await UserModel.find({
          where: { username: body.username, password: body.password },
        })
      ).length > 0
    ) {
      bundleWithCode('用户名已存在')
    }

    u = new UserModel()
    for (const key in body) {
      u[key] = body[key]
    }
    await u.save()
    return u
  }

  @Post('/open/login')
  async login(@Body() body, @Ctx() ctx: Context) {
    const u = await UserModel.findOne({ where: { username: body.username } })
    if (!u) bundleWithCode('用户未找到')

    ctx.cookies.set('token', createToken(u.id), {
      sameSite: true,
    })
    return 'success'
  }
}
