import React from 'react'
import {
  AppBar,
  IconButton,
  Button,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core'

// import { Menu } from '@material-ui/icons'

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

const Login: React.FC = () => {
  const classes = useStyles()
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
            {/* <Menu /> */}
            22
          </IconButton>
          <Typography className={classes.title} variant="h6">
            vkiller
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  )
}
export default Login
