import { EventEmitter } from 'events'

const LOCALSTATEKEY = 'logStatus'

enum LOCALSTATE {
  'logged' = 'free',
}

class Auth extends EventEmitter {
  logged: boolean = false
  userInfo: any

  constructor() {
    super()
    this.logged = this.checkLocalState()
  }

  checkLocalState() {
    return localStorage.getItem(LOCALSTATEKEY) === LOCALSTATE.logged
  }

  changeLocalState(state: LOCALSTATE) {
    localStorage.setItem(LOCALSTATEKEY, state)
  }

  setUserInfo() {
    //
  }
}

export default new Auth()
