import React, { useEffect, useState } from 'react'
import { NextPage } from 'next'
import Menu from '../../components/menu'
import { menus } from '../../js/const'
import { PageContent } from '../../components/common/page'
import { get } from '../../js/request'
import Link from 'next/link'
import { UserModel } from '../../../db/models'
import styled from 'styled-components'

const UserCard = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  width: 100px;
  .avatar {
    height: 80px;
    width: 80px;
    background-size: cover;
    background-position: center;
    border-radius: 100%;
  }
  & > span {
    font-size: 16px;
    margin-top: 16px;
  }
`

const renderFriend = (user: UserModel) => {
  return (
    <Link key={user.id} href={`/friends/${user.id}`}>
      <UserCard>
        <div
          className="avatar"
          style={{ backgroundImage: `url('${user.avatar}')` }}
        />
        <span>{user.username}</span>
      </UserCard>
    </Link>
  )
}

const Friends: NextPage = () => {
  const [users, setUsers] = useState<UserModel[]>([])
  useEffect(() => {
    get('/open/users').then(([users]) => {
      setUsers(users)
    })
  }, [])
  return (
    <>
      <Menu menus={menus} />
      <PageContent>{users.map(renderFriend)}</PageContent>
    </>
  )
}

export default Friends
