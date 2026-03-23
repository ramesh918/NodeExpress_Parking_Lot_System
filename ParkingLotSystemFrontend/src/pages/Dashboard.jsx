import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user, isAdmin } = useAuth()
  const [stats, setStats] = useState({ lots: 0, totalSpots: 0, freeSpots: 0, activeTickets: 0, pendingInvoices: 0, myVehicles: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [lotsRes, spotsRes, ticketsRes, invoicesRes, vehiclesRes] = await Promise.allSettled([
          api.get('/parking-lots'),
          api.get('/parking-spots'),
          api.get('/tickets'),
          api.get(isAdmin ? '/invoices' : '/invoices/my'),
          api.get('/vehicles/my'),
        ])

        const lots = lotsRes.value?.data?.data ?? []
        const spots = spotsRes.value?.data?.data ?? []
        const tickets = ticketsRes.value?.data?.data ?? []
        const invoices = invoicesRes.value?.data?.data ?? []
        const myVehicles = vehiclesRes.value?.data?.data ?? []

        setStats({
          lots: lots.length,
          totalSpots: spots.length,
          freeSpots: spots.filter((s) => !s.isOccupied).length,
          activeTickets: tickets.filter((t) => t.status === 'ACTIVE').length,
          pendingInvoices: invoices.filter((i) => i.status === 'PENDING').length,
          myVehicles: myVehicles.length,
        })
      } catch (_) {}
      setLoading(false)
    }
    fetchStats()
  }, [isAdmin])

  if (loading) return <div className="loading"><div className="spinner" /> Loading dashboard…</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Welcome back, {user?.name?.split(' ')[0]} 👋</h2>
          <p className="page-subtitle">Here is what is happening in your parking system today.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">🏢</div>
          <div>
            <div className="stat-value">{stats.lots}</div>
            <div className="stat-label">Parking Lots</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">🅿</div>
          <div>
            <div className="stat-value">{stats.freeSpots}</div>
            <div className="stat-label">Available Spots</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">🎫</div>
          <div>
            <div className="stat-value">{stats.activeTickets}</div>
            <div className="stat-label">Active Tickets</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">🧾</div>
          <div>
            <div className="stat-value">{stats.pendingInvoices}</div>
            <div className="stat-label">Pending Invoices</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">🚗</div>
          <div>
            <div className="stat-value">{stats.myVehicles}</div>
            <div className="stat-label">My Vehicles</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Quick Guide</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {[
              { step: '1', title: 'Register a Vehicle', desc: 'Go to Vehicles and add your vehicle with license plate and type.', icon: '🚗' },
              { step: '2', title: 'Find a Free Spot', desc: 'Go to Parking Spots, filter by type and availability.', icon: '🅿' },
              { step: '3', title: 'Create a Ticket', desc: 'Go to Tickets, select your vehicle and spot to park.', icon: '🎫' },
              { step: '4', title: 'Exit and Pay', desc: 'Complete the ticket on exit, then generate and pay your invoice.', icon: '💳' },
            ].map((g) => (
              <div key={g.step} style={{ padding: 16, background: 'var(--bg)', borderRadius: 8, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ fontSize: 24 }}>{g.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{g.step}. {g.title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 12, lineHeight: 1.5 }}>{g.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
