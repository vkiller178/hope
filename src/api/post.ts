import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Ctx,
  CookieParam,
  CookieParams,
  QueryParams,
} from 'routing-controllers'
import { UserModel, PostModel } from '../db/models'
import { bundleWithCode } from '../utils/errorbundle'
import { createToken, decodeToken } from '../middlewares/jwt'
import { Context } from 'koa'
import { postHide } from '../db/models/post'

@Controller()
export default class PostController {
  @Post('/post')
  async create(@Body() body, @CookieParams() { token }) {
    let p = new PostModel()
    for (const key in body) {
      p[key] = body[key]
    }
    p.uid = decodeToken(token).data
    await p._save()
    return p
  }
  @Get('/post/:id')
  async getOne(@Param('id') id: string, @CookieParams() { token }) {
    let p = await PostModel.findOne({
      where: { id, uid: decodeToken(token).data },
    })
    if (!p) bundleWithCode('文章不存在，或者不属于你')

    return p
  }

  @Post('/post/:id')
  async modify(
    @Param('id') id: string,
    @CookieParams() { token },
    @Body() body
  ) {
    let p = await PostModel.findOne({
      where: { id, uid: decodeToken(token).data },
    })

    if (!p) bundleWithCode('文章不存在，或者不属于你')

    for (const key in body) {
      const element = body[key]
      p[key] = body[key]
    }

    await p._save()

    return 'success'
  }

  @Get('/open/feed')
  async getFeedPost(@QueryParams() { skip, take }) {
    return await PostModel.find({
      where: { hide: postHide.show },
      relations: ['uid'],
      skip,
      take,
    })
  }
  @Get('/open/post/:id')
  async getPost(@Param('id') id) {
    let p = await PostModel.findOne({
      where: { id, hide: postHide.show },
      relations: ['uid'],
    })
    if (!p) bundleWithCode('文章不存在，或者不可见')

    return p
  }
}
