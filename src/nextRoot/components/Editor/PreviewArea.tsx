import { makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import converter from '../../../utils/markdownConvert'

const useInputAreaStyle = makeStyles(() => ({
  inputAreaRoot: {
    minWidth: 100,
    minHeight: 100,
    '& > div': {
      border: 'none',
      height: '100%',
      width: '100%',
      resize: 'none',
      outline: 'none',
      padding: 20,
    },
  },
}))

const PreviewArea: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { content?: string }
> = (props) => {
  const classes = useInputAreaStyle()

  const html = props.content ? converter.makeHtml(props.content) : ''
  return (
    <div className={clsx(classes.inputAreaRoot, props.className)}>
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
  )
}

export default PreviewArea
