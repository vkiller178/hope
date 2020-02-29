import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { get } from '../request'

const LOCALSTATEKEY = 'logStatus'

export enum LOCALSTATE {
  'logged' = 'logged',
  'none' = 'none',
  'checking' = 'checking',
}

function getLocalState(): LOCALSTATE {
  return (localStorage.getItem(LOCALSTATEKEY) as LOCALSTATE) || LOCALSTATE.none
}

function changeLocalState(state: LOCALSTATE) {
  localStorage.setItem(LOCALSTATEKEY, state)
}

interface authInfo {
  logStatus?: LOCALSTATE
  username?: string
  id?: number
}

type setLocalFuc = (status: LOCALSTATE) => void

type useAuthFunResponse = { [key: string]: any } & {
  auth: authInfo
  setLocal: setLocalFuc
  isLogged: boolean
  isMe: (id: any) => boolean
}

export default (loadAuthInit: boolean = true): useAuthFunResponse => {
  const [auth, setAuth] = useState<authInfo>({ logStatus: LOCALSTATE.checking })
  /**
   * TODO: 目前会造成每个用到此hook的组件都会调用一次查询用户信息
   */
  const getUserInfo = async () => {
    const u = await get<{ username: string; id: number }>('/user')

    if (!u) {
      setAuth({ ...auth, logStatus: LOCALSTATE.none })
      changeLocalState(LOCALSTATE.none)
    } else {
      setAuth({ ...auth, ...u, logStatus: LOCALSTATE.logged })
    }
  }
  const setLocal: setLocalFuc = s => {
    changeLocalState(s)
    setAuth({ ...auth, logStatus: s })
  }

  const isMe = (id: any) =>
    auth.logStatus === LOCALSTATE.logged && auth.id === id

  useEffect(() => {
    if (getLocalState() === LOCALSTATE.logged && loadAuthInit) {
      getUserInfo()
    }
  }, [])

  return {
    auth,
    setLocal,
    isLogged: auth.logStatus === LOCALSTATE.logged,
    isMe,
  }
}
