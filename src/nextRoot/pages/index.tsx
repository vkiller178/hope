import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { get, post } from '../js/request'
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  Button,
  makeStyles,
  Hidden,
  Link,
} from '@material-ui/core'
import { ThumbUp, Visibility } from '@material-ui/icons'

import Skeleton from '@material-ui/lab/Skeleton'
import clsx from 'clsx'
import VirtualScroll, { LoadState } from '../components/VirtualScroll/Index'

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
  dom: {
    offsetTop: number
  }
}

const useCardStyle = makeStyles(theme => ({
  root: {
    backgroundColor: '#fff',
    borderBottom: '1px solid rgb(240,242,247)',
    padding: theme.spacing(2),
    minHeight: 100,
  },
  p: {
    marginBottom: theme.spacing(2),
  },
  count: {
    marginLeft: '8px',
  },
}))

const Indicator: React.FC<{ load: LoadState }> = ({ load }) => {
  const classesCard = useCardStyle()

  return (
    <Grid
      container
      direction="column"
      alignItems="stretch"
      justify="center"
      className={classesCard.root}
    >
      {load === LoadState.loading ? (
        <>
          <Skeleton variant="text" width={60} />
          <Skeleton variant="text" width={160} />
          <Skeleton variant="text" />
        </>
      ) : load === LoadState.noMore ? (
        <Grid container justify="center" alignItems="center">
          <span>暂无更多</span>
        </Grid>
      ) : null}
    </Grid>
  )
}

const PostCard: React.FC<Post> = p => {
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
    position: 'relative',
  },
  root: {},
}))

export function useMixedWindowSize() {
  const [size, setSize] = useState({ height: 0, width: 0 })

  useEffect(() => {
    setSize({ height: window.innerHeight, width: window.innerWidth })
  }, [])

  return size
}

const Index: React.FC = () => {
  const classes = useIndexStyle()

  const getFeed = async posts => {
    const feeds = await get<Array<Post>>('/open/feed', {
      skip: posts.length,
      take: 10,
    })

    return feeds
  }

  return (
    <div className={classes.root}>
      <Header />
      <Container style={{ marginTop: '16px' }} maxWidth="md">
        <Grid spacing={2} container alignItems="flex-start">
          <Grid className={clsx(classes.content)} item lg={9} xs={12} sm={12}>
            <VirtualScroll
              fetchMethod={posts => getFeed(posts)}
              renderItem={(item: any) => <PostCard {...item} />}
              indicator={Indicator}
              scrollBinderEleQuery="#__next"
            />
          </Grid>

          <Hidden mdDown>
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
