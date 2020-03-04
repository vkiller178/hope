import React, { useEffect, useRef, useState, CSSProperties } from 'react'
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
  useTheme,
} from '@material-ui/core'
import { MoreHoriz, Close as CloseIcon } from '@material-ui/icons'
import Stackedit from '../js/stackedit'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import useFormValidator, { normalize } from '../js/hooks/useFormValidateor'
import { post as httpPost, get } from '../js/request'

import dynamic from 'next/dynamic'
import Head from 'next/head'
import Header from '../components/Header'
import { useMixedWindowSize } from '.'

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
  const { height } = useMixedWindowSize()
  const theme = useTheme()

  const editorHeight = height - Number(theme.mixins.toolbar.minHeight)

  const onSavePostSetting = async () => {
    if (checkForm()) {
      let res: any
      if (form.id) {
        res = await httpPost(`/post/${form.id}`, form)
      } else {
        res = await httpPost('/post', form)
        setForm(_ => ({
          ..._,
          id: res.id,
          title: res.title,
          tags: res.tags,
          hide: res.hide,
        }))
      }

      if (res) {
        setOpen(false)
      }
    }
  }

  const autoSave = async (v: string, saveCallback: any) => {
    setForm(_ => ({ ..._, content: v }))
    if (!form.id) {
      setOpen(true)
      saveCallback('需要其他信息才能够保存')
      return false
    }

    await httpPost(`/post/${form.id}`, { content: v })

    saveCallback('保存成功')
  }

  const router = useRouter()

  useEffect(() => {
    const { pid } = router.query
    if (pid && typeof pid === 'string') {
      get<any>(`/post/${pid}`).then(res => {
        setForm(_form => ({
          ..._form,
          id: +pid,
          title: res.title,
          tags: res.tags,
          hide: res.hide,
          content: res.content,
        }))
      })
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
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css"
        />
      </Head>
      <Header />
      {isLogged ? (
        <>
          <NewEditor
            initValue={form.content}
            onMore={() => setOpen(true)}
            onChange={autoSave}
            style={{ height: editorHeight }}
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

// 分钟
const autoSaveTime = 0.2

const useEditorStyle = makeStyles(theme => ({
  editor: {
    visibility: 'hidden',
  },
  ActionButton: {
    position: 'fixed',
    right: 30,
    bottom: 30,
  },
  root: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    '& .CodeMirror': {
      zIndex: 0,
      paddingBottom: '30px',
      border: 'none',
      flexGrow: 1,
    },
    '& .editor-statusbar': {
      position: 'fixed',
      bottom: 0,
      backgroundColor: '#007acc',
      color: '#fff',
      padding: '2px 10px',
      width: '100%',
    },
  },
}))

const editorOptions = {
  autofocus: true,
}

const NewEditor: React.FC<{
  initValue?: string
  onChange?: (val: string, saveCallback: () => void) => void
  onMore?: () => void
  style?: CSSProperties
}> = props => {
  const classes = useEditorStyle()
  const editorRef = useRef<any>()
  const timerRef = useRef<any>()
  const saveCallback = useRef<any>()
  const initValueRef = useRef('')
  const [snackbar, setSnackbar] = useState<{ open: boolean; content?: any }>({
    open: false,
  })

  const [content, setContent] = useState('')
  saveCallback.current = () => {
    const _val = editorRef.current ? editorRef.current.value() : ''
    if (_val && _val !== content) {
      setContent(_val)
    }
  }

  useEffect(() => {
    function saveCallback(content: string = '') {
      setSnackbar(_ => ({ ..._, content }))

      setTimeout(() => {
        setSnackbar(_ => ({ ..._, open: false }))
      }, 300)
    }
    if (content && props.onChange) {
      setSnackbar(_ => ({ content: '正在保存', open: true }))
      props.onChange(content, saveCallback)
    }
  }, [content])

  useEffect(() => {
    const wrapper = document.querySelector('#c-editor')
    import('simplemde').then(({ default: SimpleMDE }) => {
      editorRef.current = new SimpleMDE({ element: wrapper, ...editorOptions })
      editorRef.current.value(initValueRef.current || '')
    })

    timerRef.current = setInterval(() => {
      saveCallback.current && saveCallback.current()
    }, autoSaveTime * 60 * 1000)

    return () => {
      clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (props.initValue) {
      editorRef.current
        ? !editorRef.current.value() && editorRef.current.value(props.initValue)
        : (initValueRef.current = props.initValue)
    }

    console.log(window.innerHeight)
  }, [props.initValue])

  return (
    <div className={classes.root}>
      <textarea className={classes.editor} id="c-editor" />

      <Fab
        onClick={() => props.onMore && props.onMore()}
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
  )
}
export default Write
