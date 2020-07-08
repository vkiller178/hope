import React from 'react'
import styled from 'styled-components'
import { MenuProps, ItemProps } from './types'

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

const Menu: React.FC<MenuProps> = ({ menus }) => {
  return (
    <MenuRoot>
      <Logo href="/">vkiller</Logo>
      <div className="menu-items">
        {menus.map((menu) => (
          <MenuItem key={menu.title}>{menu.title}</MenuItem>
        ))}
      </div>
    </MenuRoot>
  )
}

export default Menu
