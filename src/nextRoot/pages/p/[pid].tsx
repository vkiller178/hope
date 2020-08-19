import React, { useEffect, useContext } from 'react'
import { get } from '../../js/request'
import clsx from 'clsx'
import converter from '../../../utils/markdownConvert'
import Menu from '../../components/menu'
import { menus } from '../../js/const'
import { PageContent } from '../../components/common/page'
import { AppContext } from '../_app'
import { NextPage } from 'next'
import { EditFilled } from '@ant-design/icons'

interface Post {
  id: number
  title: string
  content: string
  uid: {
    username: string
    id: number
  }
}

const PostView: NextPage<{ post: Post }> = ({ post }) => {
  useEffect(() => {}, [])
  const { userInfo } = useContext(AppContext)
  const isMine = post.uid.id === userInfo.id
  return (
    <>
      <Menu menus={menus} />
      <PageContent className={clsx('markdown-body')}>
        <h1>
          {isMine && (
            <a href={`/write?pid=${post.id}`}>
              <EditFilled />
            </a>
          )}
          {post.title}
        </h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </PageContent>
    </>
  )
}

export async function getServerSideProps(ctx) {
  console.time('fetch post')

  const { pid } = ctx.query
  const post = await get<Post>(`$/open/post/${pid}`)
  post.content = converter.makeHtml(post.content)
  console.timeEnd('fetch post')

  return { props: { post } }
}

export default PostView
