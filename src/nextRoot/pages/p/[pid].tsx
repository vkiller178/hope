import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { get } from '../../js/request'
import Head from 'next/head'
import clsx from 'clsx'
import useAuth from '../../js/hooks/useAuth'
import time from 'dayjs'
import converter from '../../../utils/markdownConvert'
import Menu from '../../components/menu'
import { menus } from '../../js/const'
import styled from 'styled-components'
interface Post {
  title: string
  content: string
  uid: {
    username: string
  }
}

const PageContent = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  padding: 8px 20px;
`

const PostView = ({ post }) => {
  useEffect(() => {}, [])
  const router = useRouter()
  const { isMe } = useAuth()

  return (
    <>
      <Menu menus={menus} />
      <PageContent
        className={clsx('markdown-body')}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </>
  )
}

PostView.getInitialProps = async (ctx) => {
  const { pid } = ctx.query
  const post = await get<Post>(`$/open/post/${pid}`)
  post.content = converter.makeHtml(post.content)
  return { post }
}

export default PostView
