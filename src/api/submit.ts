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
import { bundleWithCode } from '../utils/errorbundle'
import { createToken, decodeToken } from '../middlewares/jwt'
import { Context } from 'koa'
import { SuubmitModel } from '../db/models'

@Controller('/fake')
export default class User {
  @Post('/site-order/create')
  async createUser(@Body() body) {
    console.log(body)

    const submit = new SuubmitModel()

    const last = await SuubmitModel.findOne({
      where: { username: body.username },
    })

    if (!last) {
      for (const key in body) {
        if (body.hasOwnProperty(key)) {
          const element = body[key]
          submit[key] = element
        }
      }

      await submit.save()
    }

    return {
      orderNumber: '202040383625072450Q',
      ctorder: 'bFVOZHk3U2hzdDc5eEZ2aXNxK3J3Umx1b3luVk9MeUhlNHVuT3IveVBtZz0=',
      originPrice: 0,
      coupon: 0,
      coins: 0,
      actualPayment: '0.00',
    }
  }
}
