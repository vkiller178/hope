import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { get } from '../../js/request'
import showdown from 'showdown'
import { Box, makeStyles, Grid, Typography, Container } from '@material-ui/core'
import Header from '../../components/Header'
import Head from 'next/head'
import clsx from 'clsx'

interface Post {
  title: string
  content: string
  uid: {
    username: string
  }
}

const useStyles = makeStyles(theme => ({
  markdownBody: {
    // padding: theme.spacing(2),
  },
  titleBlock: {
    margin: theme.spacing(2, 0),
    '& .title': {
      fontWeight: 500,
      fontSize: 16,
      marginBottom: '12px',
    },
    '& .author': {
      fontStyle: 'italic',
    },
    '& .tag': {
      padding: '2px',
      borderRadius: '2px',
      backgroundColor: 'lightblue',
      fontSize: '12px',
      '&:not(:last-child)': {
        marginRight: theme.spacing(1),
      },
    },
  },
}))

const converter = new showdown.Converter()
converter.setFlavor('github')

const PostView = ({ post }) => {
  useEffect(() => {}, [])
  const classes = useStyles()
  const router = useRouter()
  return (
    <div>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css"
        ></link>
      </Head>
      <Header />

      <Container maxWidth="md">
        <Grid
          className={classes.titleBlock}
          container
          direction="column"
          alignItems="flex-start"
        >
          <Grid className="title" item xs={12}>
            <div>{post.title}</div>
          </Grid>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item>
              <div className="author">{post.uid.username}</div>
            </Grid>
            <Grid item>
              {post.tags.split(' ').map(t => (
                <span className="tag">{t}</span>
              ))}
            </Grid>
          </Grid>
        </Grid>
        <Box
          className={clsx('markdown-body', classes.markdownBody)}
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></Box>
      </Container>
    </div>
  )
}

PostView.getInitialProps = async ctx => {
  const { pid } = ctx.query
  const post = await get<Post>(`$/open/post/${pid}`)
  post.content = converter.makeHtml(post.content)
  return { post }
}

export default PostView
