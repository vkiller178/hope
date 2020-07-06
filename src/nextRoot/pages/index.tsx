import React from 'react'
import { get } from '../js/request'
import PostCard, { Post } from '../components/post-card'

import VirtualScroll from '../components/virtual-scroll'
import Menu from '../components/menu'
import { menus } from '../js/const'

const getFeed = async (posts) => {
  const feeds = await get<Array<Post>>('/open/feed', {
    skip: posts.length,
    take: 10,
  })

  return feeds
}

const Index: React.FC = () => {
  return (
    <>
      <Menu menus={menus} />
      <VirtualScroll
        fetchMethod={(posts) => getFeed(posts)}
        renderItem={(item: any) => <PostCard {...item} />}
        scrollBinderEleQuery="#__next"
      />
    </>
  )
}
export default Index
