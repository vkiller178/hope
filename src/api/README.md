```ts
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

@Controller('/demo')
export default class User {
  @Get('/')
  async allUser(@Param('id') id) {
    return 'hello world'
  }
}
```
