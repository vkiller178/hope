import { Controller, Get, Param } from 'routing-controllers'

@Controller('/open')
export default class Proxy {
  @Get('/proxy')
  async allUser(@Param('id') id) {
    return 'hello world'
  }
}
