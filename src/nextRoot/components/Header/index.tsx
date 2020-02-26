import {
  AppBar,
  IconButton,
  Button,
  makeStyles,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Link,
} from '@material-ui/core'

import MenuIcon from '@material-ui/icons/Menu'
import { AccountCircle, GitHub, LinkRounded } from '@material-ui/icons'
import { useState } from 'react'
import useAuth from '../../js/hooks/useAuth'
import { useRouter } from 'next/router'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
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
      <AppBar position="static">
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
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
          <GitHub />
        </Toolbar>
      </AppBar>
    </div>
  )
}
