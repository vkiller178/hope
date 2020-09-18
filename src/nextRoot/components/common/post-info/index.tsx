import React from 'react'
import { UserOutlined, FieldTimeOutlined, EyeOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { Props } from './type'

export const PostInfoWrapper = styled('div')`
  display: flex;
  align-items: center;
  font-style: italic;
  .item {
    display: flex;
    align-items: center;
    &:not(:last-child) {
      margin-right: 16px;
    }
    span:last-child {
      margin-left: 8px;
    }
  }
`

const icons = [<UserOutlined />, <FieldTimeOutlined />, <EyeOutlined />]
const PostInfo: React.FC<Props> = ({ values }) => {
  return (
    <PostInfoWrapper>
      {values.map((item, index) =>
        item ? (
          <div key={item} className="item">
            {React.cloneElement(icons[index])}
            <span>{item}</span>
          </div>
        ) : null
      )}
    </PostInfoWrapper>
  )
}
export default PostInfo
