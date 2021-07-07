import { Controller, Get, Param, Ctx, Body, Post } from 'routing-controllers'
import { ResumeModel, TagModal } from '../db/models'
import { bundleWithCode } from '../utils/errorbundle'
@Controller()
export default class User {
  @Get('/open/tag')
  async getTags(@Ctx() ctx) {
    let where = {}
    if (!ctx.session.uid) {
      where = { visible: true }
    }
    return await TagModal.find({
      where,
    })
  }
  @Post('/tag/:id')
  async modifyTag(@Param('id') id: string, @Body() data: any) {
    const tag = await TagModal.findOne({ where: { id } })
    if (!tag) bundleWithCode('找不到标签')
    await tag.getData(data)
    await tag._save()
    return tag
  }
}
