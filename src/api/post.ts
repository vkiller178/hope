import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  CookieParams,
  QueryParams,
  Ctx,
} from 'routing-controllers'
import { PostModel } from '../db/models'
import { bundleWithCode } from '../utils/errorbundle'
import { decodeToken } from '../middlewares/jwt'
import { postHide } from '../db/models/post'
import { updateLine } from '../sitemap'

@Controller()
export default class PostController {
  @Post('/post')
  async create(@Body() body, @Ctx() ctx) {
    let p = new PostModel()
    for (const key in body) {
      p[key] = body[key]
    }
    p.uid = ctx.session.uid
    await p._save()
    // update sitemap
    updateLine(`/p/${p.id}`)
    return p
  }
  @Get('/post/:id')
  async getOne(@Param('id') id: string, @Ctx() ctx) {
    let p = await PostModel.findOne({
      where: { id, uid: ctx.session.uid },
    })
    if (!p) bundleWithCode('文章不存在，或者不属于你')

    return p
  }

  @Post('/post/:id')
  async modify(@Param('id') id: string, @Body() body, @Ctx() ctx) {
    let p = await PostModel.findOne({
      where: { id, uid: ctx.session.uid },
    })

    if (!p) bundleWithCode('文章不存在，或者不属于你')

    for (const key in body) {
      p[key] = body[key]
    }

    await p._save()

    return 'success'
  }

  @Get('/open/feed')
  async getFeedPost(@QueryParams() { skip, take }) {
    return await PostModel.getFeed({ skip, take })
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
