import React, { useContext } from 'react'
import styled from 'styled-components'
import { MenuProps } from './types'
import Link from 'next/link'
import { AppContext } from '../../pages/_app'
import { Dropdown, Menu as AMenu } from 'antd'
import { EditOutlined } from '@ant-design/icons'

const MenuRoot = styled.div`
  height: 48px;
  position: sticky;
  top: 0;
  width: 100%;
  background: white;
  padding: 0 20px;
  box-shadow: 0px 5px 5px #eee;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  z-index: 999;
  .menu-items {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding-right: 80px;
  }
`

const MenuItem = styled.div``

const Logo = styled.a``

const userDropDown = (
  <AMenu>
    <AMenu.Item>
      <a href="/write">
        <EditOutlined /> 写文章
      </a>
    </AMenu.Item>
  </AMenu>
)

const Menu: React.FC<MenuProps> = ({ menus }) => {
  const appContext = useContext(AppContext)
  const renderAuth = () => {
    return (
      <>
        {appContext.userInfo.username ? (
          <Dropdown overlay={userDropDown} placement="bottomCenter" arrow>
            <span>{appContext.userInfo.username}</span>
          </Dropdown>
        ) : (
          <Link href="/login">
            <a>登陆</a>
          </Link>
        )}
      </>
    )
  }
  return (
    <MenuRoot>
      <Logo href="/">GodInSilence</Logo>
      <div className="menu-items">
        {menus.map((menu) => (
          <MenuItem key={menu.title}>{menu.title}</MenuItem>
        ))}
      </div>
      <div className="auth">{renderAuth()}</div>
    </MenuRoot>
  )
}

export default Menu
