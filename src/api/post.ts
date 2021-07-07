import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  QueryParams,
  Ctx,
} from 'routing-controllers'
import { PostModel, TagModal } from '../db/models'
import { bundleWithCode } from '../utils/errorbundle'
import { updateLine } from '../sitemap'

async function handlerPost(key: string, val: any) {
  if (key === 'tags') {
    let arrar = []
    if (Array.isArray(val)) {
      for (const name of val) {
        let tag = await TagModal.findOne({ where: { name } })
        if (!tag) {
          tag = new TagModal()
          tag.getData({
            name,
            visible: true,
          })
          await tag._save()
        }
        arrar.push(tag)
      }
    }

    return arrar
  }

  return val
}

@Controller()
export default class PostController {
  @Post('/post')
  async create(@Body() body, @Ctx() ctx) {
    let p = new PostModel()
    await p.getData(body, handlerPost)
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
      relations: ['tags'],
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

    await p.getData(body, handlerPost)

    await p._save()

    return 'success'
  }

  @Get('/open/feed')
  async getFeedPost(@QueryParams() query) {
    return await PostModel.getFeed(query)
  }
  @Get('/open/post/:id')
  async getPost(@Param('id') id) {
    let p = await PostModel.findOne({
      where: { id, visible: true },
      relations: ['uid'],
    })
    if (!p) bundleWithCode('文章不存在，或者不可见')

    return p
  }
}
