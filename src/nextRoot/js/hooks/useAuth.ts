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

export default (
  loadAuthInit: boolean = true
): { [key: string]: any } & {
  auth: authInfo
  setLocal: setLocalFuc
  isLogged: boolean
} => {
  const [auth, setAuth] = useState<authInfo>({ logStatus: LOCALSTATE.checking })

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

  useEffect(() => {
    if (getLocalState() === LOCALSTATE.logged && loadAuthInit) {
      getUserInfo()
    }
  }, [])

  return { auth, setLocal, isLogged: auth.logStatus === LOCALSTATE.logged }
}
