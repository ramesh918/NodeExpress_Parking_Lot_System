import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const TITLES = {
  '/': 'Dashboard',
  '/parking-lots': 'Parking Lots',
  '/parking-spots': 'Parking Spots',
  '/vehicles': 'Vehicles',
  '/tickets': 'Tickets',
  '/fees': 'Fee Configuration',
  '/invoices': 'Invoices',
  '/users': 'Users',
  '/role-access': 'Role Access',
}

export default function Navbar() {
  const { pathname } = useLocation()
  const { user } = useAuth()

  return (
    <header className="navbar">
      <h1 className="navbar-title">{TITLES[pathname] ?? 'Parking Lot System'}</h1>
      <div className="navbar-right">
        <span className={`role-badge role-${user?.role}`}>{user?.role?.replace('_', ' ')}</span>
        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{user?.email}</span>
      </div>
    </header>
  )
}
