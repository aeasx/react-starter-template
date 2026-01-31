/* eslint-disable @typescript-eslint/no-explicit-any */
// ...existing code...
import { Button, Card, Col, Form, Input, Row, Switch } from 'antd'
import { useEffect, useState, type FC, forwardRef, useImperativeHandle, useRef } from 'react'
const apiResult = { 1: '1', 2: '0', 3: '1', 4: '0' }
const getPortConfigApi = () => {
  return new Promise<Record<number, string>>(resolve => {
    return setTimeout(() => {
      resolve(apiResult)
    }, 300)
  })
}
interface IPortListItem { port: number; open: boolean }
export const Home: FC = () => {
  const [goodsList, setGoodsList] = useState<IPortListItem[]>([])
  const [formData, setFormData] = useState<Record<string, any>>({})
  // 保存每个子组件的 ref
  const childRefs = useRef<Record<number, any>>({})

  useEffect(() => {
    getPortConfigApi().then(res => {
      const portList = Object.entries(res).map(([port, open]) => ({ port: Number(port), open: open == '1' }))
      setGoodsList(portList)
    })
  }, [])

  const handleChildChange = (idx: number, values: any) => {
    setFormData(pre => ({ ...pre, [idx]: values }))
    console.log(`child form change`);
  }

  const togglePortStatus = (port: number) => {
    setGoodsList(prev => prev.map(item =>
      item.port === port ? { ...item, open: !item.open } : item
    ));
  };

  // 父组件点击时收集所有子表单值（会执行 validateFields）
  const handleCollect = async () => {
    const result: Record<number, any> = {}
    for (const { port, open } of goodsList) {
      const child = childRefs.current[port];
      if (!child) continue;
      if (child.validate) {
        try {
          result[port] = { ...await child.validate(), open }
        } catch (err) {
          result[port] = { __error: err, open }
        }
        // 这里不进行校验
      } else if (child.getFieldsValue) {
        result[port] = { ...child.getFieldsValue(), open }
      } else {
        result[port] = { open }
      }
    }
    console.log('收集到的所有表单值：', result)
    setFormData(result)
  }

  return (
    <div className='flex'>
      <div className="text-3xl flex flex-col items-center">
        <div style={{ marginBottom: 12 }}>
          <Button type="primary" onClick={handleCollect}>收集所有表单值</Button>
        </div>

        <Row gutter={[16, 16]} style={{ width: '600px' }}>
          {
            goodsList.map(({ port, open }) => (
              <Col span={12} key={port}>
                <div style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '4px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <Form.Item label="是否显示" valuePropName="checked" style={{ marginBottom: 0 }}>
                      <Switch checked={open} onChange={() => togglePortStatus(port)} />
                    </Form.Item>
                  </div>
                  <TestChild
                    hidden={!open}
                    ref={el => (childRefs.current[port] = el)}
                    port={port}
                    onChange={handleChildChange}
                    initialValues={formData[port] || {}}
                  />
                </div>
              </Col>
            ))
          }
        </Row>
      </div>
      <div>
        <pre style={{ background: '#fafafa', padding: 12, fontSize: 12 }}>{JSON.stringify(formData, null, 2)}</pre>
      </div>
    </div>
  )
}

interface TestProps {
  port?: number
  initialValues?: any
  onChange?: (portIdx: number, values: any) => void
  hidden?: boolean
}

// 使用 forwardRef 暴露方法给父组件
const TestChild = forwardRef<any, TestProps>(({ port = 0, initialValues = {}, onChange, hidden }, ref) => {
  const [form] = Form.useForm()

  useImperativeHandle(ref, () => ({
    getValues: () => form.getFieldsValue(),
    validate: () => form.validateFields()
  }), [form])

  useEffect(() => {
    form.setFieldsValue(initialValues)
  }, [initialValues])
  return (
    <Card style={{ border: '1px solid red', padding: 16 }} hidden={hidden}>
      <Form form={form} initialValues={initialValues} layout='vertical'
        onValuesChange={(_, all) => onChange?.(port, all)}
      >
        <Form.Item label="姓名" name="name" required rules={[{ required: true, message: '请输入姓名' }]}>
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item label='年龄' name='age'>
          <Input placeholder="请输入年龄" />
        </Form.Item>
      </Form>
    </Card>
  )
})
