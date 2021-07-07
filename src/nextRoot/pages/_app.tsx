import Head from 'next/head'
import 'antd/dist/antd.css'
import '../styles/global.css'

import { ThemeProvider } from 'styled-components'
import { get } from '../js/request'
import { useEffect, createContext, useState } from 'react'

const theme = {
  colors: {
    primary: '#0070f3',
  },
}

interface AppContextProp {
  userInfo: {
    username?: string
    id?: number
  }
}

export const AppContext = createContext<AppContextProp>({
  userInfo: {},
})

export default function MyApp({ Component, pageProps }) {
  const [userInfo, setUserInfo] = useState({})
  useEffect(() => {
    // 此方法会在客户端调用！并且每个页面都会调用一次
    get('/user').then((res) => {
      res && setUserInfo(res)
    })
  }, [])
  return (
    <>
      <Head>
        <title>GodInSilence</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />

        <link
          href="https://cdn.jsdelivr.net/npm/github-markdown-css@4.0.0/github-markdown.min.css"
          rel="stylesheet"
        />
        <link href="/style/global.css" rel="stylesheet" />
        <link type="image/ico" rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <AppContext.Provider value={{ userInfo }}>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </AppContext.Provider>
    </>
  )
}
