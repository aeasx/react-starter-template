import { createRoot } from 'react-dom/client'
import './index.css'
// 设置全局字体
import '@/config/font.ts'
import { RouterProvider } from 'react-router'
import { router } from './router'
const root = document.getElementById('root')!

createRoot(root).render(<RouterProvider router={router} />)
