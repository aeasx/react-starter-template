import { Button, Card, Form, Input, message, Switch } from 'antd'
import { useEffect, useState, type FC } from 'react'
const getPortConfigApi = () => {
  return new Promise<boolean[]>(resolve => {
    return setTimeout(() => {
      resolve([true, true, false, true])
    }, 300)
  })
}
export const Home: FC = () => {
  const [goodsList, setGoodsList] = useState<boolean[]>([])
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    getPortConfigApi().then(res => { setGoodsList(res) })
  }, [])
  const handleChildChange = (idx: number, values: any) => {
    setFormData(pre => ({ ...pre, [idx]: values }))
    console.log(`child form change`);
  }
  return (
    <div className="text-3xl flex flex-col items-center">
      {
        goodsList.map((x, xIndex) => (
          <div key={xIndex}>
            {x ? '表单' + xIndex : '表单' + xIndex + '(空)'}
            <TestChild index={xIndex} onChange={handleChildChange} initialValues={formData[xIndex] || {}} />
          </div>
        ))
      }
      <div>
        <pre style={{ background: '#fafafa', padding: 12 }}>{JSON.stringify(formData, null, 2)}</pre>
      </div>
    </div>
  )
}
interface TestProps {
  index?: number
  initialValues?: any
  onChange?: (index: number, values: any) => void
}

const TestChild: FC<TestProps> = ({ index = 0, initialValues = {}, onChange }) => {
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    message.success('保存成功')
    if (onChange) {
      onChange(index, values)
    }
    console.log(`表单值`, values);
  }
  return (
    <Card style={{ border: '1px solid red', padding: 16 }}>
      <Form form={form} initialValues={initialValues} layout='vertical'
        onFinish={onFinish}
      >
        <Form.Item label="姓名" name="name" required rules={[{ required: true, message: '请输入姓名' }]}>
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item label='是否同意' name='agree' valuePropName='checked'>
          <Switch />
        </Form.Item>
        <Button type="primary" htmlType="submit">保存</Button>
      </Form>
    </Card>
  )
}
