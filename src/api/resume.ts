import { Controller, Get, Param } from 'routing-controllers'
import { ResumeModel } from '../db/models'

@Controller()
export default class User {
  @Get('/open/resumeByUser/:uid')
  async resumeByUser(@Param('uid') uid) {
    return await ResumeModel.findOne({
      where: { user: uid },
      relations: ['user'],
    })
  }
}
