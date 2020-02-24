import { useState, useEffect, useRef } from 'react'

interface formData {
  [key: string]: {
    rule?: Array<RuleObj>
  }
}
interface RuleObj {
  validator: (val: any) => boolean
  msg: string
}

interface Props {
  onChange?: any
  value?: any
  error?: boolean
  helperText?: string
}

interface validatorResponse {
  [key: string]: Props
}
/**
 * 返回true表示验证通过
 */
type checkForm = (fieldName?: string, val?: any) => boolean
type validator = (
  opts: formData
) => [
  validatorResponse,
  {
    // hasError: boolean
    checkForm: checkForm

    form: any
  }
]

interface matchResponse {
  error: boolean
  helperText: string
}

const matchRules = (rule: Array<RuleObj>, fieldValue: any): matchResponse => {
  let response = { error: false, helperText: '' }
  if (!Array.isArray(rule)) return response
  rule.some(ru => {
    const validateResult = ru.validator(fieldValue)
    const errMsg = validateResult ? '' : ru.msg
    response.error = !validateResult
    response.helperText = errMsg
    return !validateResult
  })
  return response
}

export const normalize = (o: Props) => {
  let _o: Props = {
    error: false,
    helperText: '',
    onChange: () => {},
    value: '',
  }

  for (const key in _o) {
    _o[key] = o[key]
  }

  return _o
}

const useFormValidator: validator = opts => {
  const [form, setForm] = useState({})
  const res: validatorResponse = {}
  const [init, setInit] = useState({})
  const formRule = useRef<Array<[string, (v: any) => matchResponse]>>([])

  function checkForm(fieldName?: string, val?: any) {
    let hasError: boolean = false

    if (typeof fieldName === 'string') {
      const [_, rule] = hasRule(fieldName)
      const matcher = rule(val)
      if (matcher.error) hasError = true
      setInit({ ...init, [fieldName]: true })
    } else {
      for (const key in res) {
        if (res.hasOwnProperty(key)) {
          setInit(_init => ({ ..._init, [key]: true }))

          // check
          const [_, rule] = hasRule(key)
          if (rule) {
            const { error } = rule(res[key].value)
            if (error) {
              hasError = true
            }
          }
        }
      }
    }

    return !hasError
  }

  const hasRule = (key: string) => formRule.current.find(v => v[0] === key)

  for (const key of Object.keys(opts)) {
    if (opts[key].rule && !hasRule(key)) {
      // push rule
      formRule.current = formRule.current.concat([
        [key, v => matchRules(opts[key].rule, v)],
      ])
    }

    const o: Props = {}
    Object.defineProperties(o, {
      onChange: {
        get() {
          return (e: any) => {
            const v = e.target.value

            // if (hasRule) checkForm(key, v)

            /**
             * @see: https://reactjs.org/docs/events.html#event-pooling
             * 如果以setForm(() => ({ ...form, [key]: e.target.value }))
             * 进行设置的话，多次输入后可能会拿到缓存中的event事件
             */
            setForm({ ...form, [key]: v })
          }
        },
      },
      value: {
        get() {
          return form[key] || ''
        },
      },
      error: {
        get() {
          if (opts[key].rule && init[key]) {
            const { error } = matchRules(opts[key].rule, this.value)

            return error
          }
          return false
        },
      },
      helperText: {
        get() {
          if (opts[key].rule && init[key]) {
            const { helperText } = matchRules(opts[key].rule, this.value)
            return helperText
          }
          return ''
        },
      },
    })
    res[key] = o
  }

  return [
    res,
    {
      checkForm,
      form,
    },
  ]
}

export default useFormValidator
