import { Icon } from "@iconify/react"
import { useBoolean } from "ahooks";
import type { FC } from "react"

const Home: FC = () => {
  const [value, toggle] = useBoolean(false);
  return (
    <div className="w-[300px] h-[200px] m-auto text-3xl flex flex-col items-center">
      <h1 className='text-red-600'>react-ts-template</h1>
      <Icon icon="mdi:home" width="48" height="48" color="red" />
      <div className="text-orange-300 cursor-pointer" onClick={toggle.toggle}>{value ? "true" : "false"}</div>
    </div>
  )
}

export default Home