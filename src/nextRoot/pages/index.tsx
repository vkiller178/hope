import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { get } from '../js/request'
import { Container, Grid, Typography, Box } from '@material-ui/core'
import { useRouter } from 'next/router'

interface Post {
  id: number
  title: string
  tags: string
  content: string
  uid: {
    username: string
  }
}

const PostCard: React.FC<Post> = p => {
  const router = useRouter()
  return (
    <Box onClick={() => router.push(`/p/${p.id}`)}>
      <Grid container alignItems="flex-start" direction="column">
        <Grid item xs={12}>
          <Typography variant="h4">{p.title}</Typography>
        </Grid>
        <Grid container direction="row" xs={12}>
          <Typography variant="subtitle1">{p.uid.username}</Typography>
        </Grid>
      </Grid>
    </Box>
  )
}
const Index: React.FC = () => {
  const [posts, setPosts] = useState<Array<Post>>([])

  const getFeed = async () => {
    const feeds = await get<Array<Post>>('/open/feed')

    if (feeds.length > 0) {
      setPosts(_ => _.concat(feeds))
    }
  }

  useEffect(() => {
    getFeed()
  }, [])
  return (
    <div>
      <Header />
      <Container maxWidth="lg">
        {posts.map(p => (
          <PostCard {...p} key={p.id} />
        ))}
      </Container>
    </div>
  )
}
export default Index
