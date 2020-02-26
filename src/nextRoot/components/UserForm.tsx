import React, { useState } from 'react'
import {
  Card,
  TextField,
  makeStyles,
  Grid,
  Button,
  Typography,
  Link,
  Container,
} from '@material-ui/core'
import useFormValidator, { normalize } from '../js/hooks/useFormValidateor'
import { post } from '../js/request'
import useAuth, { LOCALSTATE } from '../js/hooks/useAuth'

const useStyle = makeStyles(theme => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      width: '400px',
    },
    width: 'calc(100% - 32px)',
    padding: '24px',
    margin: '100px 16px',
  },
  textfield: {
    width: '100%',
  },
}))

type User = {
  username: string
  password: string
}

const UserForm: React.FC = () => {
  const classes = useStyle()

  const { auth, setLocal } = useAuth()

  const [allFields, { checkForm, form }] = useFormValidator({
    username: {
      rule: [{ validator: val => !!val, msg: '请输入用户名' }],
    },
    password: {
      rule: [{ validator: val => !!val, msg: '请输入密码' }],
    },
  })

  const doSometing = async () => {
    if (checkForm()) {
      const res = await post<string | undefined>('/open/login', form)
      if (res) {
        setLocal(LOCALSTATE.logged)
        location.href = '/'
      }
    }
  }

  return (
    <Grid container alignItems="center" justify="center">
      <Card className={classes.root}>
        <form>
          <Grid container direction="column" spacing={3}>
            <Grid item xs={12}>
              <TextField
                className={classes.textfield}
                label="username"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                {...normalize(allFields.username)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                className={classes.textfield}
                label="password"
                variant="outlined"
                type="password"
                InputLabelProps={{ shrink: true }}
                {...normalize(allFields.password)}
              />
            </Grid>
            <Grid item>
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <Button onClick={doSometing} variant="outlined">
                    登录
                  </Button>
                </Grid>
                <Grid item>
                  <Typography variant="caption">
                    还没有账号？立即<Link>注册</Link>！
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Grid>
  )
}
export default UserForm
