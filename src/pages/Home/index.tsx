/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Checkbox, Col, Divider, Form, Input, Row, Switch, type FormProps } from 'antd'
import { type FC, forwardRef, useImperativeHandle, useRef, useState, Fragment } from 'react'
const mockApiResult = { 1: '1', 2: '0', 3: '1', 4: '0' }
const mapPortList = Object.entries(mockApiResult).map(([p, open]) => ({ port: +p, open: open === '1' }))
interface IPortListItem { port: number; open: boolean }
interface IFormDataItem { name: string; age: number }
interface IFormData { [key: number]: IFormDataItem }

const defaultFormData: IFormData = {
  1: { name: '湛山', age: 18 },
  2: { name: '张三', age: 40 },
  3: { name: '王五', age: 38 },
  4: { name: '赵六', age: 28 }
}

const Status = {
  SUCCESS: 'success',
  ERROR: 'error'
} as const;

export const Home: FC = () => {
  // 从api获取 通过 setPortList 设置
  const [portList, setPortList] = useState<IPortListItem[]>(mapPortList)
  // 同 portList
  const [formData, setFormData] = useState(defaultFormData)

  const childRef = useRef<Record<keyof any, any>>({})
  const handleCollect = async () => {
    const formRC = childRef.current
    if (!formRC) return;
    const result: Record<number, any> = {}
    for (const { port } of portList) {
      try {
        if (!formRC[port]) continue;
        const res = await formRC[port].validate()
        result[port] = { status: Status.SUCCESS, data: res }
      } catch (error) {
        result[port] = { status: Status.ERROR, data: error }
      }
    }
    console.info("🚀 ~ :21 ~ handleCollect ~ result:", result)
  }
  return (
    <div>
      <Button type='primary' onClick={handleCollect}>收集子表单数据</Button>
      <div className='flex'>
        <div className='flex flex-col gap-3'>
          {
            portList.map(({ port, open }, idx) => (
              <Fragment key={`${idx + port}`}>
                <ChildForm
                  ref={el => childRef.current[port] = el}
                  initialValues={formData[port] || {}}
                  portItem={{ port, open }}
                  isLianKe={true}
                />
                <Divider />
              </Fragment>
            ))
          }
        </div>
      </div>
    </div>
  )
}


interface ChildFormProps extends FormProps {
  portItem: { port: number; open: boolean }
  /** 是否为链科技设备 */
  isLianKe?: boolean
}

const ChildForm = forwardRef<any, ChildFormProps>(({ portItem, initialValues, isLianKe, ...rets }, ref) => {
  const [form] = Form.useForm()
  const { port, open } = portItem
  const [formVisible, setFormVisible] = useState(open)
  useImperativeHandle(ref, () => ({
    validate: () => form.validateFields()
  }), [form])

  return (
    <div>
      <Form form={form} initialValues={{
        ...initialValues,
        [`port-${port}`]: open
      }} {...rets}>
        <Form.Item hidden={!isLianKe}>
          <Form.Item label={`端口 ${port}`} name={`port-${port}`} valuePropName='checked'>
            <Switch onChange={checked => setFormVisible(checked)} />
          </Form.Item>
        </Form.Item>
        <div hidden={!formVisible}>
          <Row>
            <Col span={24}>
              <Form.Item label="姓名" name="name" required rules={[{ required: true, message: '请输入姓名' }]}>
                <Input placeholder="请输入姓名" allowClear />
              </Form.Item>
              <Form.Item label="年龄" name="age" >
                <Input placeholder="请输入年龄" allowClear />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="分类列表" name='category' >
                <Checkbox.Group onChange={(checkedList) => form.setFieldValue('category', checkedList.join(','))}>
                  <Checkbox value="1">菜品</Checkbox>
                  <Checkbox value="2">饮料</Checkbox>
                  <Checkbox value="3">鸡排</Checkbox>
                </Checkbox.Group>
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
    </div>
  )
})
