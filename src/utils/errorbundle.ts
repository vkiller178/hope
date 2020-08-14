interface bundleWithCodeOpts {
  name?: string
  message: string
  code?: ErrorCodeMap
}

export enum ErrorCodeMap {
  BASE = 200000,
  UNTRACKED = 200001,
}
export const bundleWithCode = (opt: bundleWithCodeOpts | string) => {
  if (typeof opt === 'string') {
    opt = {
      message: opt,
    }
  }
  // TODO: 将错误日志记录起来
  let _opt = { code: ErrorCodeMap.BASE, ...opt }
  throw new Error(JSON.stringify(_opt))
}

export const exportBundleMessage = (msg: string): bundleWithCodeOpts => {
  let result: bundleWithCodeOpts

  try {
    result = JSON.parse(msg)
  } catch (error) {
    result = {
      message: msg,
    }
  }

  const { code, message } = result

  return {
    code: code || ErrorCodeMap.UNTRACKED,
    message,
  }
}
