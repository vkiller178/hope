import Axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios'
import qs from 'qs'

interface BaseResponse {
  data: any
  code: number
  msg?: string
}

enum ToastLevel {
  'all' = '@',
  'error' = '!',
}

const instance = Axios.create({
  withCredentials: true,
  baseURL: '/api/v1',
})

/**
 * 这个后置的处理有应对了几个场景：
 * 1 正常（httpStatus 200 , 业务code 20000） 则返回业务的数据
 * 2 业务不正常，控制台打印警告，（于此同时可以做一些公共的处理），并且返回undefined给上层调用者的fullfiled回调中
 * 3 服务异常（包含 500 以上的错误）控制台打印一个错误，并且返回undefined给上层调用者的fullfiled回调中
 *
 * 目的，任何情况下都不会触发上层调用者的reject回调（但是上层要判断返回值是否为undefined）
 * 统一处理返回的数据，弹窗、日志、等等
 */
instance.interceptors.response.use(
  ({ data, status, config }: AxiosResponse<BaseResponse>) => {
    if (status === 200) {
      if (data.code === 1) {
        if (config.headers['X-QUITE'] === ToastLevel.all) {
          // 成功提示
        }
        return data.data
      } else {
        // 业务问题
        console.warn(`httpClient:${data.msg}`)
        if (config.headers['X-QUITE'] === ToastLevel.all) {
          // 失败提示
        }
      }
    }
    return
  },
  ({ response, config, message }: AxiosError) => {
    if (response && response.status === 401) {
      // 清除登陆状态
      return
    }
    // 服务出错。500以上错误，不返回reject，仍然不会触发上层的reject
    console.error(`httpClient:${message}`)
    if (config.headers['X-QUITE']) {
      // 异常提示
    }
    return
  }
)

instance.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['token'] = token
  }
  if (config.url) {
    const mark = config.url.slice(0, 1)
    for (const key in ToastLevel) {
      //@ts-ignore
      if (ToastLevel[key] === mark) {
        //@ts-ignore
        config.headers['X-QUITE'] = ToastLevel[key]
        config.url = config.url.slice(1)
      }
    }
  }
  return config
})

export const post = <T>(path: string, data: Object = {}) => {
  return instance.post<T, T>(path, data)
}

export const get = <T>(path: string, data: Object = {}) => {
  let query = qs.stringify(data)
  if (query) {
    path += `?${query}`
  }
  return instance.get<T, T>(path)
}
