import { Button, Modal, Form, Select } from 'antd'
import React, { useState, useEffect } from 'react'
import { SettingFilled } from '@ant-design/icons'
import { useForm } from 'antd/lib/form/Form'
import noop from 'lodash/noop'
import { get } from '../js/request'
import { TagModal } from '../../db/models'
const MoreConfig: React.FC<{
  onChange: Function
  className: string
  value: any
}> = ({ onChange = noop, value, ...props }) => {
  const [modal, openModal] = useState(false)
  const [form] = useForm()
  const [tags, setTags] = useState<TagModal[]>([])

  function onSave() {
    openModal(false)

    onChange(form.getFieldsValue())
  }

  async function getTags() {
    const tags = await get<TagModal[]>('/open/tag')
    setTags(tags)
  }

  useEffect(() => {
    if (modal) getTags()
  }, [modal])

  useEffect(() => {
    if (value) {
      form.setFieldsValue(value)
    }
  }, [value])
  return (
    <>
      <Button
        {...props}
        shape="circle"
        type="primary"
        size="large"
        icon={<SettingFilled />}
        onClick={() => openModal(true)}
      />
      <Modal
        visible={modal}
        title="文章配置"
        onCancel={() => openModal(false)}
        onOk={onSave}
      >
        <Form form={form}>
          <Form.Item label="标签" name="tags">
            <Select mode="tags">
              {tags.map((tag) => (
                <Select.Option key={tag.id} value={tag.name}>
                  {tag.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
export default MoreConfig
