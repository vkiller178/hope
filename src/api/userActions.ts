import { Controller, Post, Body, CookieParams } from 'routing-controllers'
import { ActionModel } from '../db/models'
import { UserActionType } from '../db/models/action'
import { decodeToken } from '../middlewares/jwt'
import { bundleWithCode } from '../utils/errorbundle'

@Controller()
export default class UserActions {
  @Post('/open/userAction')
  async base(@Body() body, @CookieParams() { token }) {
    const { type, payload } = body

    const action = new ActionModel({ type })
    const { data: uid } = decodeToken(token)
    let res = 'success'

    if (UserActionType.click || UserActionType.like) {
      const { pid } = payload
      action.target = pid
      action.uid = uid || null
      await action._save()

      return res
    }

    bundleWithCode('没有查到对应的用户操作')
  }
}
