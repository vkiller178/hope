import React, { useEffect, useState } from 'react'
import { NextPage } from 'next'
import Menu from '../../components/menu'
import { menus } from '../../js/const'
import { PageContent } from '../../components/common/page'
import { get } from '../../js/request'
import Link from 'next/link'

interface User {
  id?: number
  username?: string
}

const Friends: NextPage = () => {
  const [users, setUsers] = useState<User[]>([])
  useEffect(() => {
    get('/open/users').then(([users]) => {
      setUsers(users)
    })
  }, [])
  return (
    <div>
      <Menu menus={menus} />
      <PageContent>
        {users.map((u) => (
          <Link key={u.id} href={`/friends/${u.id}`}>
            <div>{u.username}</div>
          </Link>
        ))}
      </PageContent>
    </div>
  )
}

export default Friends
