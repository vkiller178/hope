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
import { UserModel, ResumeModel } from '../db/models'
import { bundleWithCode } from '../utils/errorbundle'
import { createToken, decodeToken } from '../middlewares/jwt'
import { Context } from 'koa'

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
