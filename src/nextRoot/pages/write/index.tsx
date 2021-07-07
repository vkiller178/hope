import Menu from '../../components/menu'
import { menus } from '../../js/const'
import { PageContent } from '../../components/common/page'
import { useState, useEffect, useRef, SyntheticEvent } from 'react'
import { get, post } from '../../js/request'
import TitleArea, { SavingStatus } from '../../components/titleArea'
import { githubUploader } from '@rxh/imager'
import MoreConfig from '../../components/moreConfig'
import { BrowserEditor } from '../../components/browserEditor'
import { PostModel } from '../../../db/models'

const LOCAL_CACHE_KEY_NEW_PAPER = 'cache-paper-new'
const LOCAL_CACHE_KEY_OLD_PAPER = 'cache-paper-old'

const notEmptyPaper = (p) => p !== '{}'

interface Paper {
  title?: string
  content?: string
  [key: string]: any
}

const WriteView = ({ pid }) => {
  const [paper, setPaper] = useState<Paper>({})
  const timerCallback = useRef(() => {})
  const status = useRef({ fetched: false, pid })
  const [saving, setSaving] = useState(SavingStatus.miss)
  const readCacheRef = useRef(false)

  let localKey = LOCAL_CACHE_KEY_OLD_PAPER + `_${status.current.pid}`

  const onPaperChange = (newValues: any) => {
    setPaper((p) => ({ ...p, ...newValues }))
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
      } else if (!cached && !status.current.fetched) {
        // 针对于已存在的文章
        const paper: PostModel | { tags: string[] } = await get(
          `/post/${status.current.pid}`
        )
        if (paper.tags) paper.tags = paper.tags.map((tag) => tag.name)
        status.current.fetched = true
        setPaper(paper)
      } else if (notEmptyPaper(cur) && cur !== cached) {
        setItem(localKey, cur)
      }
    } else {
      // 针对于新文章
      const cached = localStorage.getItem(LOCAL_CACHE_KEY_NEW_PAPER)

      if (!cached || (notEmptyPaper(cur) && cur !== cached)) {
        // 本地草稿存储
        setItem(LOCAL_CACHE_KEY_NEW_PAPER, cur)
      } else if (!!cached && !notEmptyPaper(cur)) {
        // 首次，读取本地草稿
        setPaper(JSON.parse(cached))
      }
    }
    readCacheRef.current = true
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
    //@ts-ignore
    let dataTransform = e.clipboardData || e.nativeEvent.dataTransfer

    if (!dataTransform) return

    const file = dataTransform.files[0]

    if (file) {
      e.stopPropagation()
      e.preventDefault()
      githubUploader.upload([file]).then((urls) => {
        if (urls.length > 0) {
          urls.forEach((url) => {
            if (url) {
              // TODO 图片上传
              // const textAreaPosition = textAreaRef.current.selectionStart
              // paper.content =
              //   paper.content.slice(0, textAreaPosition) +
              //   `![](${url})` +
              //   paper.content.slice(textAreaPosition)
            }
          })
        }
      })
    }
  }

  return (
    <>
      <Menu menus={menus} />
      <PageContent className="flex flex-col justify-between">
        <div className="flex justify-between">
          <input
            className="text-xl"
            value={paper.title}
            onChange={(e) => {
              onPaperChange({ title: e.target.value })
            }}
            placeholder="请输入文章标题～"
            type="text"
          />
          <TitleArea status={saving} onSubmit={onSaving} />
        </div>

        {readCacheRef.current === true && (
          <BrowserEditor
            value={paper.content}
            onChange={(value) => onPaperChange({ content: value })}
          />
        )}

        <MoreConfig
          value={paper}
          className="self-end"
          onChange={(config) => onPaperChange(config)}
        />
      </PageContent>
    </>
  )
}

WriteView.getInitialProps = (ctx) => ({ pid: ctx.query.pid })

export default WriteView
