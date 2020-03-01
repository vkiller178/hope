import {
  AppBar,
  IconButton,
  Button,
  makeStyles,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Box,
} from '@material-ui/core'
import React from 'react'

import MenuIcon from '@material-ui/icons/Menu'
import { AccountCircle } from '@material-ui/icons'
import { useState } from 'react'
import useAuth, { LOCALSTATE } from '../../js/hooks/useAuth'
import { useRouter } from 'next/router'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    position: 'sticky',
    top: 0,
    ...theme.mixins.toolbar,
    zIndex: 1,
  },
  title: {
    flexGrow: 1,
  },
  menuButton: {
    paddingRight: 0,
  },
}))

const Account = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const handleMenu = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const toWrite = () => {
    handleClose()
    route.push('/write')
  }

  const { setLocal } = useAuth(false)
  const logout = () => {
    setLocal(LOCALSTATE.none)
  }
  const open = Boolean(anchorEl)
  const route = useRouter()

  return (
    <div>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={toWrite}>写文章</MenuItem>
        <MenuItem onClick={logout}>退出</MenuItem>
      </Menu>
    </div>
  )
}

export default () => {
  const classes = useStyles()
  const route = useRouter()
  const { isLogged } = useAuth()

  return (
    <div className={classes.root}>
      <AppBar>
        <Toolbar>
          <Typography
            onClick={() => route.push('/')}
            className={classes.title}
            variant="h6"
          >
            vkiller
          </Typography>
          {isLogged ? (
            <Account />
          ) : (
            <Button onClick={() => route.push('/login')} color="inherit">
              登录
            </Button>
          )}
          <IconButton className={classes.menuButton} color="inherit">
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  )
}
