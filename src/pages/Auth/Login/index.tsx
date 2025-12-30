import { Form, Input } from "antd"

const Login = () => {
  const [form] = Form.useForm()

  return (
    <div>
      <h1 className="text-4xl font-bold text-pink-400">Login Page</h1>
      <Form form={form} layout="vertical" className="max-w-[400px]">
        <Form.Item label="Username" name="username">
          <Input placeholder="请输入姓名" allowClear />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input type="password" placeholder="请输入密码" allowClear />
        </Form.Item>
      </Form>
    </div>
  )
}

export default Login