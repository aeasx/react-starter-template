import { Icon } from '@iconify/react'
import type { FC } from 'react'

export const Home: FC = () => {
  return (
    <div className="w-[300px] h-[200px] m-auto text-3xl flex flex-col items-center">
      <h1 className="text-red-600">react-ts-template</h1>
      <Icon icon="mdi:home" width="48" height="48" color="red" />
    </div>
  )
}
