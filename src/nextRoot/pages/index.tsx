import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { get } from '../js/request'
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  IconButton,
  Button,
  makeStyles,
  Hidden,
} from '@material-ui/core'
import { useRouter } from 'next/router'
import { ThumbUp, Visibility } from '@material-ui/icons'

interface Post {
  id: number
  title: string
  tags: string
  content: string
  uid: {
    username: string
  }
}

const useCardStyle = makeStyles(theme => ({
  root: {
    backgroundColor: '#fff',
    '&:not(:last-child)': {
      borderBottom: '1px solid rgb(240,242,247)',
    },
    padding: theme.spacing(2),
  },
  p: {
    marginBottom: theme.spacing(2),
  },
  count: {
    marginLeft: '8px',
  },
}))

const PostCard: React.FC<Post> = p => {
  const router = useRouter()
  const classes = useCardStyle()
  return (
    <Grid
      container
      alignItems="flex-start"
      justify="space-between"
      direction="column"
      className={classes.root}
      onClick={() => router.push(`/p/${p.id}`)}
    >
      <Grid className={classes.p} item xs={12}>
        <Typography variant="h6">{p.title}</Typography>
        <Typography variant="body2">{p.content}</Typography>
      </Grid>
      <Grid container spacing={2} direction="row" alignItems="center">
        <Grid item>
          <Button size="small" color="secondary" variant="outlined">
            <ThumbUp fontSize="small" />
            <span className={classes.count}>22</span>
          </Button>
        </Grid>
        <Grid item>
          <Grid container alignItems="center">
            <Visibility fontSize="small" color="action" />
            <Typography
              variant="caption"
              className={classes.count}
              color="textSecondary"
            >
              22
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

const useIndexStyle = makeStyles(theme => ({
  sidebar: {
    position: 'sticky',
    top: theme.mixins.toolbar.minHeight,
    '& .cardInfo': {
      height: '244px',
    },
  },
  content: {
    // backgroundColor: '#fff',
  },
}))

const Index: React.FC = () => {
  const [posts, setPosts] = useState<Array<Post>>([])
  const classes = useIndexStyle()
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
      <Container style={{ marginTop: '16px' }} maxWidth="md">
        <Grid spacing={2} container alignItems="flex-start">
          <Grid className={classes.content} item lg={9} sm={12}>
            {posts.map(p => (
              <PostCard {...p} key={p.id} />
            ))}
          </Grid>

          <Hidden smDown>
            <Grid className={classes.sidebar} item sm={3}>
              <Card className="cardInfo">222</Card>
            </Grid>
          </Hidden>
        </Grid>
      </Container>
    </div>
  )
}
export default Index
