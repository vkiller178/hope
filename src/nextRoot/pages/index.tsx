import React from 'react'
import { get } from '../js/request'
import PostCard, { Post } from '../components/post-card'

import VirtualScroll from '../components/virtual-scroll'
import Menu from '../components/menu'
import { menus } from '../js/const'
import { PageContent } from '../components/common/page'
import styled from 'styled-components'

const getFeed = async (posts) => {
  const feeds = await get<Array<Post>>('/open/feed', {
    skip: posts.length,
    take: 10,
  })

  return feeds
}

const IndexPageContent = styled(PageContent)`
  display: flex;
`

const Index: React.FC = () => {
  return (
    <>
      <Menu menus={menus} />
      <IndexPageContent>
        <VirtualScroll
          fetchMethod={(posts) => getFeed(posts)}
          renderItem={(item: any, props) => <PostCard {...props} p={item} />}
          scrollBinderEleQuery="#__next"
        />
      </IndexPageContent>
    </>
  )
}
export default Index
