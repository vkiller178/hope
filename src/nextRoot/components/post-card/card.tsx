import React from 'react'
import { CardProps } from './types'
import { post } from '../../js/request'
import styled from 'styled-components'
import { useRouter } from 'next/router'

const CardWrapper = styled.div`
  display: inline-block;
  width: 100%;
  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
  h1 {
    font-size: 18px;
    font-weight: 600;
  }

  & > span {
    color: blueviolet;
    cursor: pointer;
    user-select: none;
    font-size: 12px;
    padding: 12px 0;
    display: block;
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

  return (
    <CardWrapper {...props}>
      <h1>{p.title}</h1>
      <p
        dangerouslySetInnerHTML={{ __html: p.brief }}
        className="markdown-body"
      />
      <span onClick={viewPage}>查看详情</span>
    </CardWrapper>
  )
}

export default PostCard
