import React, { useContext } from 'react'
import styled from 'styled-components'
import { MenuProps } from './types'
import Link from 'next/link'
import { AppContext } from '../../pages/_app'
import { Dropdown, Menu as AMenu } from 'antd'
import { EditOutlined } from '@ant-design/icons'

const MenuRoot = styled('div')`
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

const MenuItem = styled('div')`
  cursor: pointer;
`

const userDropDown = (
  <AMenu>
    <AMenu.Item>
      <a href="/write">
        <EditOutlined /> 写文章
      </a>
    </AMenu.Item>
  </AMenu>
)

/**
 *
 * 找到className被定义的地方，使用更优雅的方式代替目前的使用方式
 */
const Menu: React.FC<MenuProps & { className?: string }> = ({
  menus,
  ...props
}) => {
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
            <a>登录</a>
          </Link>
        )}
      </>
    )
  }
  return (
    <MenuRoot {...props}>
      <a href="/">GodInSilence</a>
      <div className="menu-items">
        {menus.map((menu) => (
          <Link key={menu.title} href={menu.action()}>
            <MenuItem>{menu.title}</MenuItem>
          </Link>
        ))}
      </div>
      <div className="auth">{renderAuth()}</div>
    </MenuRoot>
  )
}

export default Menu
