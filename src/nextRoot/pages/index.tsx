import React, { useEffect, useState, useRef, DOMElement } from 'react'
import Header from '../components/Header'
import { get, post } from '../js/request'
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
  Link,
} from '@material-ui/core'
import { useRouter } from 'next/router'
import { ThumbUp, Visibility } from '@material-ui/icons'
import { useWindowSize } from 'react-use'

import Skeleton from '@material-ui/lab/Skeleton'

interface Post {
  id: number
  title: string
  tags: string
  content: string
  uid: {
    username: string
  }
  like: number
  click: number
  brief: string
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

  function viewPage() {
    post('open/userAction', {
      type: 'click',
      payload: {
        pid: p.id,
      },
    })
  }

  return (
    <Grid
      container
      alignItems="flex-start"
      justify="space-between"
      direction="column"
      className={classes.root}
    >
      <Grid className={classes.p} item xs={12}>
        <Typography variant="h6">{p.title}</Typography>
        <Typography component="div" variant="body2">
          <Box dangerouslySetInnerHTML={{ __html: p.brief }} />
          <Link onClick={viewPage} href={`/p/${p.id}`}>
            查看详情
          </Link>
        </Typography>
      </Grid>
      <Grid container spacing={2} direction="row" alignItems="center">
        <Grid item>
          <Button size="small" color="secondary" variant="outlined">
            <ThumbUp fontSize="small" />
            <span className={classes.count}>{p.like}</span>
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
              {p.click}
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
  root: {
    height: '667px',
    overflowY: 'scroll',
  },
}))

function useMixedWindowSize() {
  const [size, setSize] = useState({ height: 0, width: 0 })

  useEffect(() => {
    setSize({ height: window.innerHeight, width: window.innerWidth })
  }, [])

  return size
}

const Index: React.FC = () => {
  const [posts, setPosts] = useState<Array<Post>>([])
  const classes = useIndexStyle()
  const classesCard = useCardStyle()

  const { height } = useMixedWindowSize()

  const [load, setLoad] = useState<{ loading: boolean }>({
    loading: false,
  })

  const [lastTick, setLastTick] = useState(0)

  const getFeed = async () => {
    setLoad(_ => ({ loading: true }))

    const feeds = await get<Array<Post>>('/open/feed', {
      skip: posts.length,
      take: 10,
    })

    setLastTick(performance.now())

    if (feeds.length > 0) {
      setPosts(_ => _.concat(feeds))
    }
    setLoad(_ => ({ ..._, loading: false }))
  }

  useEffect(() => {
    getFeed()
  }, [])

  const scrollWrapper = useRef<HTMLElement>()

  const scrollTake = 400

  function onScroll() {
    const now = performance.now()
    if (
      scrollWrapper.current &&
      scrollWrapper.current.scrollTop + height ===
        scrollWrapper.current.scrollHeight &&
      load.loading === false &&
      now - lastTick > scrollTake
    ) {
      getFeed()
    }
  }

  return (
    <div
      ref={ref => (scrollWrapper.current = ref)}
      className={classes.root}
      style={{ height }}
      onScroll={onScroll}
    >
      <Header />
      <div>
        <Container style={{ marginTop: '16px' }} maxWidth="md">
          <Grid spacing={2} container alignItems="flex-start">
            <Grid className={classes.content} item lg={9} xs={12} sm={12}>
              {posts.map(p => (
                <PostCard {...p} key={p.id} />
              ))}

              {load.loading && (
                <div className={classesCard.root}>
                  <Skeleton variant="text" width={60} />
                  <Skeleton variant="text" width={160} />
                  <Skeleton variant="text" />
                </div>
              )}
            </Grid>

            <Hidden mdDown>
              <Grid className={classes.sidebar} item sm={3}>
                <Card className="cardInfo">222</Card>
              </Grid>
            </Hidden>
          </Grid>
        </Container>
      </div>
    </div>
  )
}
export default Index
