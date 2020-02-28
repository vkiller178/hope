import React from 'react'
import { Card, TextField, makeStyles, Grid } from '@material-ui/core'
import useFormValidator, { normalize } from '../js/hooks/useFormValidateor'

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

export const useUserForm = () =>
  useFormValidator({
    username: {
      rule: [{ validator: val => !!val, msg: '请输入用户名' }],
    },
    password: {
      rule: [{ validator: val => !!val, msg: '请输入密码' }],
    },
  })

const UserForm: React.FC<{ allFields: any }> = ({ allFields, children }) => {
  const classes = useStyle()

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
            {children}
          </Grid>
        </form>
      </Card>
    </Grid>
  )
}
export default UserForm
