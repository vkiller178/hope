import { Button, Popover, Row } from 'antd'
import React from 'react'
import { ReloadOutlined } from '@ant-design/icons'
import { TagModal } from '../../../db/models'
import styles from './index.module.scss'
import { get, post } from '../../js/request'

const TagButton: React.FC<{
  tag: any
  onToogle: (tag: TagModal) => void
  onClick: (tag: TagModal) => void
  active: boolean | undefined
}> = ({ tag, onToogle, onClick, active }) => {
  return (
    <div className={styles.button}>
      <Button
        type={active ? 'primary' : tag.visible ? 'default' : 'dashed'}
        shape="round"
        key={tag.id}
        // disabled={!tag.visible}
        onClick={() => {
          if (!tag.visible) return
          onClick(tag)
        }}
      >
        {tag.name}
      </Button>

      <Button
        className={styles.toogleButton}
        size="small"
        shape="circle"
        icon={<ReloadOutlined />}
        onClick={(e) => {
          e.stopPropagation()
          onToogle(tag)
        }}
      />
    </div>
  )
}
const TagList: React.FC<{
  tags: Array<TagModal>
  onReload: any
  onSelect: any
  currentTags: string[]
}> = ({ tags, onReload, onSelect, currentTags }) => {
  async function onToogle(tag: TagModal) {
    const res = await post(`/tag/${tag.id}`, {
      visible: !tag.visible,
    })

    if (res) {
      onReload()
    }
  }

  return (
    <div className={styles.tagList}>
      {tags.map((tag) => {
        return (
          <TagButton
            key={tag.id}
            tag={tag}
            onToogle={onToogle}
            onClick={onSelect}
            active={currentTags.includes(tag.id.toString())}
          />
        )
      })}
    </div>
  )
}
export default TagList
