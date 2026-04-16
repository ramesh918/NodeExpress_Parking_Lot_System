import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = [
  {
    section: 'Main',
    items: [
      { to: '/', icon: '▦', label: 'Dashboard', exact: true },
    ],
  },
  {
    section: 'Parking',
    items: [
      { to: '/parking-lots', icon: '🏢', label: 'Parking Lots' },
      { to: '/parking-spots', icon: '🅿', label: 'Parking Spots' },
    ],
  },
  {
    section: 'Operations',
    items: [
      { to: '/vehicles', icon: '🚗', label: 'Vehicles' },
      { to: '/tickets', icon: '🎫', label: 'Tickets' },
      { to: '/invoices', icon: '🧾', label: 'Invoices' },
    ],
  },
]

const ADMIN_NAV = {
  section: 'Management',
  items: [
    { to: '/fees', icon: '💰', label: 'Fee Config' },
    { to: '/users', icon: '👥', label: 'Users' },
  ],
}

const SUPER_ADMIN_NAV = { to: '/role-access', icon: '🔐', label: 'Role Access' }

export default function Sidebar() {
  const { user, logout, isAdmin, isSuperAdmin } = useAuth()

  const sections = [...NAV]
  if (isAdmin) {
    sections.push({
      ...ADMIN_NAV,
      items: isSuperAdmin
        ? [...ADMIN_NAV.items, SUPER_ADMIN_NAV]
        : ADMIN_NAV.items,
    })
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>🅿 ParkingLot</h2>
        <p>Management System</p>
      </div>

      <nav className="sidebar-nav">
        {sections.map((sec) => (
          <div key={sec.section}>
            <div className="nav-section">{sec.section}</div>
            {sec.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role}</div>
          </div>
          <button className="logout-btn" onClick={logout} title="Logout">⎋</button>
        </div>
      </div>
    </aside>
  )
}
