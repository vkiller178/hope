import React, { useEffect, useRef, useState } from 'react'
import useAuth from '../js/hooks/useAuth'
import {
  Typography,
  Link,
  makeStyles,
  Fab,
  Snackbar,
  IconButton,
  CircularProgress,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from '@material-ui/core'
import { MoreHoriz, Close as CloseIcon } from '@material-ui/icons'
import Stackedit from '../js/stackedit'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import useFormValidator, { normalize } from '../js/hooks/useFormValidateor'
import { post as httpPost, get } from '../js/request'

interface Post {
  id?: string
  content?: string
  hide?: boolean
  title?: string
  tags?: Array<string>
}
const Write: React.FC = () => {
  const { isLogged } = useAuth()
  const [open, setOpen] = useState(false)
  const [allFields, { checkForm, form, setForm }] = useFormValidator({
    title: {
      rule: [{ validator: v => !!v, msg: '请填写标题' }],
    },
    hide: {
      defaultVal: false,
    },
    tags: {},
  })
  const onSavePostSetting = async () => {
    if (checkForm()) {
      let res: any
      if (form.id) {
        res = await httpPost(`/post/${form.id}`, form)
      } else {
        res = await httpPost('/post', form)
      }

      if (res) {
        setOpen(false)
        setForm(_ => ({ ..._, id: res.id }))
      }
    }
  }

  const autoSave = async () => {
    if (!form.id) {
      setOpen(true)
      return false
    }
    return await httpPost(`/post/${form.id}`, { content: form.content })
  }

  const router = useRouter()

  useEffect(() => {
    const { pid } = router.query
    if (pid && typeof pid === 'string') {
      //edit post

      get<any>(`/post/${pid}`).then(res => {
        setForm(_form => ({ ..._form, id: pid, ...res }))
      })
    } else {
      // new post
      // pid 不是在组件didMounted之后就存在的
      // setOpen(true)
    }
  }, [router.query.pid])

  const Form = (
    <form>
      <Grid container direction="column" spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="标题"
            variant="standard"
            InputLabelProps={{ shrink: true }}
            {...normalize(allFields.title)}
          />
        </Grid>
        <Grid item xs={12}>
          <FormLabel>是否隐藏</FormLabel>
          <RadioGroup {...normalize(allFields.hide)}>
            <FormControlLabel value="1" control={<Radio />} label="是" />
            <FormControlLabel value="0" control={<Radio />} label="否" />
          </RadioGroup>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="标签（用空格分割）"
            variant="standard"
            InputLabelProps={{ shrink: true }}
            {...normalize(allFields.tags)}
          />
        </Grid>
      </Grid>
    </form>
  )

  return (
    <div>
      {isLogged ? (
        <>
          <Editor
            value={form.content}
            onChange={val => setForm(_form => ({ ..._form, content: val }))}
            onSave={autoSave}
            onMore={() => setOpen(true)}
          />
          <Dialog maxWidth="sm" open={open} onClose={() => setOpen(false)}>
            <DialogTitle>文章设置</DialogTitle>
            <DialogContent>{Form}</DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)} color="primary">
                取消
              </Button>
              <Button onClick={onSavePostSetting} color="primary" autoFocus>
                提交
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <Typography variant="subtitle2">
          请<Link href="/login">登录</Link>
        </Typography>
      )}
    </div>
  )
}

const useEditorStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  ActionButton: {
    position: 'fixed',
    right: 30,
    bottom: 30,
  },
  otherWrapper: {},
}))

// 分钟
const autoSaveTime = 0.2

const Editor: React.FC<{
  onMore: any
  onChange: any
  onSave: () => Promise<any>
  value: string
}> = props => {
  const classes = useEditorStyles()
  const [content, setContent] = useState<string>(props.value || '')
  const [snackbar, setSnackbar] = useState<{ open: boolean; content?: any }>({
    open: false,
  })
  const [time, setTime] = useState<{ stm?: number; ctm?: number }>({})
  const onFileChange = file => {
    const newContent = file.content.text
    if (newContent === props.value) return
    setContent(newContent)
    props.onChange(newContent)
    setTime(oldTm => ({ ...oldTm, ctm: window.performance.now() }))
  }
  const autoSave = useRef<any>()
  autoSave.current = () => {
    if (!content || time.stm > time.ctm) return
    props.onSave().then(flag => {
      if (flag) setTime(_ => ({ ..._, stm: window.performance.now() }))
      setSnackbar(_snack => ({
        ..._snack,
        content: <Typography>保存{flag ? '成功' : '失败'}</Typography>,
      }))

      setTimeout(() => {
        setSnackbar(_snack => ({
          ..._snack,
          open: false,
        }))
      }, 500)
    })
    setSnackbar({
      ...snackbar,
      open: true,
      content: (
        <Grid spacing={1} alignItems="center" direction="row" container>
          <Grid item>
            <CircularProgress size={16} color="primary" />
          </Grid>
          <Grid item>
            <Typography>正在保存</Typography>
          </Grid>
        </Grid>
      ),
    })
  }

  const timerRef = useRef<any>()
  const editorRef = useRef<any>()

  useEffect(() => {
    const stackedit = new Stackedit()
    editorRef.current = stackedit
    const el = document.querySelector('#my-editor')
    // Open the iframe
    stackedit.openFile({
      name: 'Filename', // with an optional filename
      content: {
        text: content, // and the Markdown content.
      },
      wrapper: el,
    })
    stackedit.on('fileChange', onFileChange)
    timerRef.current = setInterval(() => {
      autoSave.current && autoSave.current()
    }, autoSaveTime * 60 * 1000)
    return () => {
      stackedit.off('fileChange', onFileChange)
      clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (props.value !== content) {
      setContent(() => props.value)
      editorRef.current.openFile({
        content: {
          text: props.value,
        },
      })
    }
  }, [props.value])
  return (
    <>
      <div className={classes.root} id="my-editor" />
      <div className={clsx(classes.otherWrapper)}>
        <Fab
          onClick={props.onMore}
          size="small"
          color="primary"
          className={classes.ActionButton}
        >
          <MoreHoriz />
        </Fab>
        <Snackbar
          open={snackbar.open}
          anchorOrigin={{
            horizontal: 'left',
            vertical: 'bottom',
          }}
          message={snackbar.content}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="secondary"
              onClick={() => setSnackbar({ ...snackbar, open: false })}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </div>
    </>
  )
}
export default Write
