import { makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import { SyntheticEvent, useState, useEffect } from 'react'

const useInputAreaStyle = makeStyles(() => ({
  inputAreaRoot: {
    minWidth: 100,
    minHeight: 100,
    '& > textarea': {
      border: 'none',
      height: '100%',
      width: '100%',
      resize: 'none',
      outline: 'none',
      padding: 20,
    },
  },
}))

type InputAreaProps = React.HTMLAttributes<HTMLDivElement> & {
  onEdit: (val: string) => void
  initValue?: string
}

const InputArea: React.FC<InputAreaProps> = (props) => {
  const classes = useInputAreaStyle()
  const [inputValue, setInputValue] = useState('')

  function onChange(e: SyntheticEvent) {
    //@ts-ignore
    const value = e.currentTarget.value
    setInputValue(value)
    props.onEdit(value)
  }

  useEffect(() => {
    //先比较再赋值
    if (props.initValue && inputValue !== props.initValue)
      setInputValue(props.initValue)
  }, [props.initValue])

  return (
    <div className={clsx(classes.inputAreaRoot, props.className)}>
      <textarea onChange={onChange} value={inputValue} />
    </div>
  )
}

export default InputArea
