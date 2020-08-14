import Head from 'next/head'
import App from 'next/app'
import 'normalize.css'
import 'antd/dist/antd.css'
import '../style/global.css'

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
        <title>vkiller</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />

        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css"
          rel="stylesheet"
        />
      </Head>
      <AppContext.Provider value={{ userInfo }}>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </AppContext.Provider>
    </>
  )
}
