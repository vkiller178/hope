import React from 'react'
import { Post } from './types'
import { post } from '../../js/request'
import styled from 'styled-components'
import { useRouter } from 'next/router'

const CardWrapper = styled.div``

const PostCard: React.FC<Post> = (p) => {
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

  return <CardWrapper onClick={viewPage}>{p.title}</CardWrapper>
}

export default PostCard
