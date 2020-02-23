import { Controller, Get, Param, Post, Body } from 'routing-controllers'
import { UserModel } from '../db/models'
import { bundleWithCode } from '../utils/errorbundle'

@Controller()
export default class User {
  @Get('/user/:id')
  async allUser(@Param('id') id) {
    return await UserModel.findOne(id)
  }
  @Post('/user')
  async createUser(@Body() body) {
    if (!body.username) bundleWithCode('username为必填项目')
    if (!body.password) bundleWithCode('password为必填项目')

    let u: UserModel

    if (
      (await UserModel.find({ where: { username: body.username } })).length > 0
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
}
