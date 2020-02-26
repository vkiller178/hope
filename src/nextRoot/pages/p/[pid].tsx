import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { get } from '../../js/request'
import showdown from 'showdown'
import { Box } from '@material-ui/core'

interface Post {
  title: string
  content: string
}

const converter = new showdown.Converter()
converter.setFlavor('github')

const PostView = ({ post }) => {
  useEffect(() => {}, [])
  const router = useRouter()
  const { pid } = router.query
  return (
    <div>
      sdddd{pid}
      {post.title}
      <Box dangerouslySetInnerHTML={{ __html: post.content }}></Box>
    </div>
  )
}

PostView.getInitialProps = async ctx => {
  const { pid } = ctx.query
  const post = await get<Post>(`$/open/post/${pid}`)
  post.content = converter.makeHtml(post.content)
  return { post }
}

export default PostView
