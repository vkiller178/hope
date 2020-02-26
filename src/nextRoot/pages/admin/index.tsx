import React, { useState } from 'react'
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Hidden,
} from '@material-ui/core'
import { List as ListItemIcon, Inbox, Mail, Menu } from '@material-ui/icons'

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: {
    ...theme.mixins.toolbar,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  menuButton: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
}))

const Admin: React.FC = () => {
  const classes = useStyles()

  const [drawOpen, setDrawOpen] = useState(false)

  const drawContent = (
    <>
      <div className={classes.toolbar} />
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <Inbox /> : <Mail />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </>
  )

  return (
    <div>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            onClick={() => setDrawOpen(!drawOpen)}
            color="inherit"
            className={classes.menuButton}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap>
            Hope 后台管理
          </Typography>
        </Toolbar>
      </AppBar>
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          classes={{
            paper: classes.drawerPaper,
          }}
          open={drawOpen}
          onClose={() => setDrawOpen(!drawOpen)}
        >
          {drawContent}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          {drawContent}
        </Drawer>
      </Hidden>
    </div>
  )
}
export default Admin
