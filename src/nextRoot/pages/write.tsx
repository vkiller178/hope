import React, { useEffect, useState } from 'react'
import useAuth from '../js/hooks/useAuth'
import {
  Typography,
  Link,
  makeStyles,
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
  Container,
} from '@material-ui/core'
import { useRouter } from 'next/router'
import useFormValidator, { normalize } from '../js/hooks/useFormValidateor'
import { post as httpPost, get } from '../js/request'

import Header from '../components/Header'
import { useMixedWindowSize } from '.'
import { Editor } from '../components/Editor'

const useWriteStyle = makeStyles((theme) => ({
  writeRoot: {
    height: '100%',
    '& > .editor': {
      height: '100%',
    },
  },
}))

interface Post {
  id?: string
  content?: string
  hide?: boolean
  title?: string
  tags?: Array<string>
}

const Write: React.FC = () => {
  const classes = useWriteStyle()
  const { isLogged } = useAuth()
  const [open, setOpen] = useState(false)
  const [allFields, { checkForm, form, setForm }] = useFormValidator({
    title: {
      rule: [{ validator: (v) => !!v, msg: '请填写标题' }],
    },
    hide: {
      defaultVal: false,
    },
    tags: {},
  })
  const { height } = useMixedWindowSize()
  const theme = useTheme()

  const onSavePostSetting = async () => {
    if (checkForm()) {
      let res: any
      if (form.id) {
        res = await httpPost(`/post/${form.id}`, form)
      } else {
        res = await httpPost('/post', form)
        setForm((_) => ({
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
    setForm((_) => ({ ..._, content: v }))
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
      get<any>(`/post/${pid}`).then((res) => {
        setForm((_form) => ({
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
    <>
      <Header />
      {isLogged ? (
        <Container maxWidth={false} className={classes.writeRoot}>
          <Editor
            value={form.content}
            onMore={() => setOpen(true)}
            onSave={autoSave}
            className="editor"
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
        </Container>
      ) : (
        <Typography variant="subtitle2">
          请<Link href="/login">登录</Link>
        </Typography>
      )}
    </>
  )
}

export default Write
