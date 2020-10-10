import { Controller, Get } from 'routing-controllers'

@Controller('/common')
export default class Common {
  @Get('/env')
  async publicEnv() {
    const publicEnvPrefix = ['GH']

    let res = {}
    for (const key in process.env) {
      if (Object.prototype.hasOwnProperty.call(process.env, key)) {
        const element = process.env[key]
        if (publicEnvPrefix.some((pre) => key.indexOf(pre) === 0)) {
          res[key] = element
        }
      }
    }
    return res
  }
}
