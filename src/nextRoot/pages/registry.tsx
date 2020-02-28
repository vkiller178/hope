import React from 'react'
import Header from '../components/Header'
import UserForm, { useUserForm } from '../components/UserForm'
import { Grid, Button, Typography, Link } from '@material-ui/core'
import useAuth, { LOCALSTATE } from '../js/hooks/useAuth'
import { post } from '../js/request'

const Registry: React.FC = () => {
  const [allFields, { checkForm, form }] = useUserForm()

  const doRegistry = async () => {
    if (checkForm()) {
      const res = await post<string | undefined>('/open/registry', form)
      if (res) {
        location.href = '/login'
      }
    }
  }
  return (
    <div>
      <Header />
      <UserForm allFields={allFields}>
        <Grid item>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Button onClick={doRegistry} variant="outlined">
                注册
              </Button>
            </Grid>
            <Grid item>
              <Typography variant="caption">
                已有账号？立即<Link href="/login">登录</Link>！
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </UserForm>
    </div>
  )
}
export default Registry
