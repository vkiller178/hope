import React from 'react'
import { CardProps } from './types'
import { post } from '../../js/request'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import PostInfo from '../common/post-info'
import dayjs from 'dayjs'

const CardWrapper = styled('div')`
  display: inline-block;
  width: 100%;
  padding: 16px 0;
  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
  h1 {
    font-size: 18px;
    font-weight: 600;
  }

  .markdown-body {
    text-align: justify;
  }

  .handle-bar {
    display: flex;
    align-items: center;

    & > span {
      color: blueviolet;
      cursor: pointer;
      user-select: none;
      display: block;
      padding-right: 8px;
    }
  }
`

const PostCard: React.FC<CardProps> = ({ p, ...props }) => {
  const router = useRouter()

  function viewPage() {
    post('open/userAction', {
      type: 'click',
      payload: {
        pid: p.id,
      },
    })

    router.push(`/p/${p.id}`)
  }

  const postInfoValues = [
    p.uid.username,
    dayjs(p.createTime).format('YYYY-MM-DD'),
    p.click,
  ]

  return (
    <CardWrapper {...props}>
      <h1>{p.title}</h1>
      <p
        dangerouslySetInnerHTML={{ __html: p.brief }}
        className="markdown-body"
      />
      <div className="handle-bar">
        <span onClick={viewPage}>阅读更多</span>
        <PostInfo values={postInfoValues} />
      </div>
    </CardWrapper>
  )
}

export default PostCard
