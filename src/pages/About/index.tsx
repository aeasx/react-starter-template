import { Button, Divider } from 'antd'
import { useEffect, useState, type FC } from 'react'
let userName = 'John'
const showMessage = () => {
  // update external variable
  userName = 'Machelle'
  const message = `hello ${userName}`
  console.info('🚀 ~ :7 ~ showMessage ~ message:', message)
}
export const About: FC = () => {
  const [count, setCount] = useState(0)
  const [year, setYear] = useState(2025)
  useEffect(() => {
    if (count === 0) {
      console.log(0)
    } else if (count === 1 || count === 2) {
      console.log(`1 or 2`)
    } else if (count === 3) {
      console.log(`3`)
    } else if (count === 4) {
      console.log(`4`)
    } else {
      console.log(`default`)
    }
    if (count >= 3) {
      setYear(2026)
    }
  }, [count])
  useEffect(() => {
    console.log(`userName`, userName) // `John` before the func call
    showMessage()
    console.log(`userName`, userName) // `Machelle` after the func call
  }, [])

  return (
    <div>
      <h1>About Page</h1>
      <p>Count: {count}</p>
      <p>Year: {year}</p>
      <Button type="primary" onClick={() => setCount(count + 1)}>
        Increment
      </Button>
      <Divider />
      <Button type="primary" onClick={() => window.location.reload()}>
        Refresh Page
      </Button>
    </div>
  )
}
