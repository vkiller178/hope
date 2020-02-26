import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { get } from '../request'

const LOCALSTATEKEY = 'logStatus'

export enum LOCALSTATE {
  'logged' = 'logged',
  'none' = 'none',
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

export default (): { [key: string]: any } & {
  auth: authInfo
  setLocal: setLocalFuc
  isLogged: boolean
} => {
  const [auth, setAuth] = useState<authInfo>({})

  const getUserInfo = async () => {
    const u = await get<{ username: string; id: number }>('/user')

    setAuth({ ...auth, ...u })
  }
  const setLocal: setLocalFuc = s => {
    changeLocalState(s)
    setAuth({ ...auth, logStatus: s })
  }
  useEffect(() => {
    if (auth.logStatus === LOCALSTATE.logged && !auth.id) {
      getUserInfo()
    }
  }, [auth.logStatus])

  useEffect(() => {
    setAuth({ ...auth, logStatus: getLocalState() })
  }, [])

  return { auth, setLocal, isLogged: auth.logStatus === LOCALSTATE.logged }
}
