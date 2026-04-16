import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { ToastProvider } from './Toast'

export default function Layout() {
  return (
    <ToastProvider>
      <div className="layout">
        <Sidebar />
        <div className="main-area">
          <Navbar />
          <main className="page-content">
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
