import React, { useState, useEffect, useRef } from 'react'
import { get } from '../js/request'
import PostCard from '../components/post-card'

import Menu from '../components/menu'
import { menus } from '../js/const'
import { PageContent } from '../components/common/page'
import TagList from '../components/tag-list'
import EmptyDes from '../components/emptyDes'
import { TagModal, PostModel } from '../../db/models'
import { getQuery, setQuery } from '../js/utils'
import { Empty, Pagination } from 'antd'

const Index: React.FC = () => {
  const [posts, setPosts] = useState<[PostModel[], number]>([[], 0])
  const [tags, setTags] = useState([])
  const [pageConfig, setPageConfig] = useState({
    skip: 0,
    take: 10,
  })
  const [activeTags, setActiveTags] = useState([])
  const mountedRef = useRef(false)

  async function getTags() {
    const tags = await get<TagModal[]>('/open/tag')
    setTags(tags)
  }

  const getFeed = async () => {
    const { skip, take } = pageConfig
    const tags = activeTags.join(',')
    const feeds = await get<[Array<PostModel>, number]>('/open/feed', {
      skip,
      take,
      tags,
    })

    // let time = 1
    // while (time < 5) {
    //   feeds[0] = feeds[0].concat(feeds[0])
    //   time++
    // }

    setPosts(feeds)
  }

  async function onSelect(tag: TagModal) {
    const index = activeTags.findIndex((_tag) => tag.id === +_tag)

    if (index > -1) {
      activeTags.splice(index, 1)
    } else {
      activeTags.push(tag.id.toString())
    }
    setQuery({
      tags: activeTags.join(','),
    })
    _setActiveTags([...activeTags])
  }

  async function onPageChange(page: number, pageSize: number) {
    setQuery({
      page: page,
    })
    setPageConfig({ skip: (page - 1) * pageSize, take: pageSize })
  }

  function _setActiveTags(tags: string[]) {
    setActiveTags(tags)
  }

  useEffect(() => {
    if (!mountedRef.current) return
    getFeed()
  }, [activeTags, pageConfig])

  useEffect(() => {
    getTags()
    _setActiveTags(
      getQuery('tags')
        .split(',')
        .filter((tag) => typeof tag === 'string' && !!tag)
    )

    setPageConfig((_) => ({
      ..._,
      skip: ((getQuery('page') || 1) - 1) * _.take,
    }))

    mountedRef.current = true
  }, [])

  return (
    <>
      <Menu menus={menus} />
      <PageContent className="flex flex-col">
        <TagList
          tags={tags}
          onReload={getTags}
          onSelect={onSelect}
          currentTags={activeTags}
        />

        <div className="flex flex-col flex-1">
          {posts[0].length > 0 ? (
            <>
              <div className="flex-1">
                {posts[0].map((post) => (
                  <PostCard key={post.id} p={post} />
                ))}
              </div>
              <Pagination
                pageSize={pageConfig.take}
                total={posts[1]}
                onChange={onPageChange}
                current={pageConfig.skip / pageConfig.take + 1}
              />
            </>
          ) : (
            <Empty description={<EmptyDes total={posts[1]} />} />
          )}
        </div>
      </PageContent>
    </>
  )
}
export default Index
