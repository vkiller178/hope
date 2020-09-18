import React from 'react'
import { post } from '../js/request'
import Menu from '../components/menu'
import { menus } from '../js/const'
import { Form, Input, Button } from 'antd'
import { PageContent } from '../components/common/page'
import styled from 'styled-components'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const tailLayout = {
  wrapperCol: { span: 16, offset: 8 },
}

const LoginPage = styled(PageContent)`
  margin-top: 40px;
  background-color: transparent;
  form {
    background-color: white;
    width: 300px;
    margin: 0 auto;
    padding: 12px;
    .ant-form-item {
      overflow: hidden;
    }
  }
`

const Login: React.FC = () => {
  const doLogin = async (e: any) => {
    e.preventDefault()
  }

  const onFinish = async (values) => {
    const res = await post<string | undefined>('!/open/login', values)
    if (res) {
      location.href = '/'
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div>
      <Menu menus={menus} />
      <LoginPage>
        <Form
          {...layout}
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </LoginPage>
    </div>
  )
}
export default Login
