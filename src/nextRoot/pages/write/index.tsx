import Menu from '../../components/menu'
import { menus } from '../../js/const'
import { PageContent } from '../../components/common/page'
import styled from 'styled-components'
import { useState, useEffect, useRef, SyntheticEvent } from 'react'
import { get, post } from '../../js/request'
import TitleArea, { SavingStatus } from './titleArea'
import { githubUploader } from '@rxh/imager'

const LOCAL_CACHE_KEY_NEW_PAPER = 'cache-paper-new'
const LOCAL_CACHE_KEY_OLD_PAPER = 'cache-paper-old'

const notEmptyPaper = (p) => p !== '{}'

interface Paper {
  title?: string
  content?: string
  [key: string]: any
}

const WriteContent = styled(PageContent)`
  display: flex;
  flex-direction: column;
  input,
  textarea {
    border: none;
    outline: none;
    max-width: 100%;
  }
  .title {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding-bottom: 20px;
    .input-title {
      font-size: 20px;
      flex-shrink: 0;
      flex: 1;
    }
  }

  .input-content {
    margin-top: 20px;
    flex: 1;
  }
`

const WriteView = ({ pid }) => {
  const [paper, setPaper] = useState<Paper>({})
  const timerCallback = useRef(() => {})
  const status = useRef({ fetched: false, pid })
  const textAreaRef = useRef<any>()
  const [saving, setSaving] = useState(SavingStatus.miss)

  let localKey = LOCAL_CACHE_KEY_OLD_PAPER + `_${status.current.pid}`

  const onPaperChange = (prop: string, { target }) => {
    setPaper((p) => ({ ...p, [prop]: target.value }))
  }
  const setItem = (key: string, value: string) => {
    setSaving(SavingStatus.saving)
    localStorage.setItem(key, value)
    setTimeout(() => {
      setSaving(SavingStatus.success)
      setTimeout(() => {
        setSaving(SavingStatus.miss)
      }, 200)
    }, 500)
  }

  const onSaving = async () => {
    if (status.current.pid) {
      await post(`!/post/${status.current.pid}`, paper)
      // 删除
      localStorage.removeItem(localKey)
    } else {
      const { id } = await post(`!/post`, paper)
      status.current.pid = id
      // 删除
      localStorage.removeItem(LOCAL_CACHE_KEY_NEW_PAPER)
    }
  }

  timerCallback.current = async () => {
    const cur = JSON.stringify(paper)

    if (status.current.pid) {
      // 读取本地存储的文章，注意，修改并提交之后会删除本地存储！
      const cached = localStorage.getItem(localKey)

      if (!!cached && !notEmptyPaper(cur)) {
        setPaper(JSON.parse(cached))
        return
      }

      if (!cached && !status.current.fetched) {
        // 针对于已存在的文章
        const { title, content } = await get(`/post/${status.current.pid}`)
        status.current.fetched = true
        setPaper((_) => ({ title, content }))
        return
      }
      if (notEmptyPaper(cur) && cur !== cached) {
        setItem(localKey, cur)
      }
    } else {
      // 针对于新文章
      const cached = localStorage.getItem(LOCAL_CACHE_KEY_NEW_PAPER)

      if (!cached || (notEmptyPaper(cur) && cur !== cached)) {
        // 本地草稿存储
        setItem(LOCAL_CACHE_KEY_NEW_PAPER, cur)
        return
      }
      if (!!cached && !notEmptyPaper(cur)) {
        // 首次，读取本地草稿
        setPaper(JSON.parse(cached))
        return
      }
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      timerCallback.current()
    }, 2000)

    // 第一次执行
    timerCallback.current()

    // 获取环境变量
    get('/common/env').then(({ GH_REPO, GH_TOKEN, GH_USER }) => {
      githubUploader.setConfig({
        repo: GH_REPO,
        token: GH_TOKEN,
        user: GH_USER,
      })
    })

    return () => {
      clearInterval(timer)
    }
  }, [])

  const onPaste = (e: SyntheticEvent) => {
    e.stopPropagation()
    e.preventDefault()
    //@ts-ignore
    let dataTransform = e.clipboardData || e.nativeEvent.dataTransfer

    if (!dataTransform) return

    const file = dataTransform.files[0]

    if (file) {
      githubUploader.upload([file]).then((urls) => {
        if (urls.length > 0) {
          urls.forEach((url) => {
            if (url) {
              const textAreaPosition = textAreaRef.current.selectionStart
              paper.content =
                paper.content.slice(0, textAreaPosition) +
                `![](${url})` +
                paper.content.slice(textAreaPosition)
            }
          })
        }
      })
    }
  }

  return (
    <>
      <Menu menus={menus} />

      <WriteContent>
        <div className="title">
          <input
            className="input-title"
            value={paper.title}
            onChange={onPaperChange.bind(null, 'title')}
            placeholder="请输入文章标题～"
            type="text"
          />
          <TitleArea status={saving} onSubmit={onSaving} />
        </div>

        <textarea
          className="input-content"
          placeholder="开始码字吧，支持markdown，但不支持事实转换～"
          value={paper.content}
          onChange={onPaperChange.bind(null, 'content')}
          onPaste={onPaste}
          onDrop={onPaste}
          ref={textAreaRef}
        />
      </WriteContent>
    </>
  )
}

WriteView.getInitialProps = (ctx) => ({ pid: ctx.query.pid })

export default WriteView
