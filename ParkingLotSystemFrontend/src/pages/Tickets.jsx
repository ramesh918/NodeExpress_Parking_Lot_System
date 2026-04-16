import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'
import { useToast } from '../components/Toast'

export default function Tickets() {
  const { isAdmin } = useAuth()
  const toast = useToast()
  const [tickets, setTickets] = useState([])
  const [myVehicles, setMyVehicles] = useState([])
  const [freeSpots, setFreeSpots] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ vehicleId: '', parkingSpotId: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const [ticketsRes, vehiclesRes] = await Promise.all([api.get('/tickets'), api.get('/vehicles/my')])
      const allVehicles = vehiclesRes.data.data
      setMyVehicles(allVehicles)
      if (isAdmin) {
        setTickets(ticketsRes.data.data)
      } else {
        const myVehicleIds = new Set(allVehicles.map((v) => v._id))
        setTickets(ticketsRes.data.data.filter((t) => myVehicleIds.has(t.vehicleId?._id)))
      }
    } catch (_) {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = async () => {
    setForm({ vehicleId: '', parkingSpotId: '' })
    setModal('create')
  }

  const loadFreeSpots = async (vehicleType) => {
    if (!vehicleType) return setFreeSpots([])
    try {
      const res = await api.get('/parking-spots', { params: { spotType: vehicleType, isOccupied: false } })
      setFreeSpots(res.data.data)
    } catch (_) { setFreeSpots([]) }
  }

  const onVehicleChange = (e) => {
    const vid = e.target.value
    const vehicle = myVehicles.find((v) => v._id === vid)
    setForm((f) => ({ ...f, vehicleId: vid, parkingSpotId: '' }))
    loadFreeSpots(vehicle?.vehicleType)
  }

  const handleCreate = async () => {
    setSaving(true)
    try {
      await api.post('/tickets', form)
      toast('Ticket created — vehicle parked!')
      setModal(null); load()
    } catch (err) {
      const d = err.response?.data
      toast(d?.details?.[0] || d?.message || 'Something went wrong', 'error')
    }
    setSaving(false)
  }

  const handleComplete = async () => {
    setSaving(true)
    try {
      await api.post(`/tickets/${selected._id}/checkout`)
      toast('Ticket completed — invoice auto-generated!')
      setModal(null); load()
    } catch (err) {
      const d = err.response?.data
      toast(d?.details?.[0] || d?.message || 'Something went wrong', 'error')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      await api.delete(`/tickets/${selected._id}`)
      toast('Ticket deleted')
      setModal(null); load()
    } catch (err) {
      const d = err.response?.data
      toast(d?.details?.[0] || d?.message || 'Delete failed', 'error')
    }
    setSaving(false)
  }

  const duration = (entry, exit) => {
    const ms = new Date(exit || Date.now()) - new Date(entry)
    const h = Math.floor(ms / 3600000)
    const m = Math.floor((ms % 3600000) / 60000)
    return `${h}h ${m}m`
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Tickets</h2>
          <p className="page-subtitle">{tickets.filter((t) => t.status === 'ACTIVE').length} active, {tickets.filter((t) => t.status === 'COMPLETED').length} completed</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Park Vehicle</button>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading"><div className="spinner" /> Loading…</div>
        ) : tickets.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">🎫</div><p>No tickets yet. Park your vehicle to create one.</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>#</th><th>License Plate</th><th>Spot</th><th>Entry Time</th><th>Exit Time</th><th>Duration</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {tickets.map((t, i) => (
                  <tr key={t._id}>
                    <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                    <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>{t.vehicleId?.licensePlate || '—'}</td>
                    <td><span className="badge badge-gray">{t.parkingSpotId?.spotNumber || '—'}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{new Date(t.entryTime).toLocaleString()}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{t.exitTime ? new Date(t.exitTime).toLocaleString() : '—'}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{duration(t.entryTime, t.exitTime)}</td>
                    <td><span className={`badge ${t.status === 'ACTIVE' ? 'badge-green' : 'badge-gray'}`}>{t.status}</span></td>
                    <td>
                      <div className="actions-cell">
                        {t.status === 'ACTIVE' && (
                          <button className="btn btn-warning btn-sm" onClick={() => { setSelected(t); setModal('complete') }}>Exit</button>
                        )}
                        {isAdmin && <button className="btn btn-danger btn-sm" onClick={() => { setSelected(t); setModal('delete') }}>🗑</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal === 'create' && (
        <Modal title="Park Vehicle" onClose={() => setModal(null)}
          footer={<><button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-primary" onClick={handleCreate} disabled={saving || !form.vehicleId || !form.parkingSpotId}>{saving ? 'Parking…' : 'Park Vehicle'}</button></>}>
          <div className="form-group">
            <label className="form-label">Select Your Vehicle</label>
            <select className="form-control" value={form.vehicleId} onChange={onVehicleChange}>
              <option value="">Choose vehicle</option>
              {myVehicles.map((v) => <option key={v._id} value={v._id}>{v.licensePlate} — {v.vehicleType.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Select Parking Spot {form.vehicleId && <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({freeSpots.length} available)</span>}</label>
            <select className="form-control" value={form.parkingSpotId} onChange={(e) => setForm((f) => ({ ...f, parkingSpotId: e.target.value }))} disabled={!form.vehicleId}>
              <option value="">Choose spot</option>
              {freeSpots.map((s) => <option key={s._id} value={s._id}>{s.spotNumber} — {s.parkingLotId?.name}</option>)}
            </select>
            {form.vehicleId && freeSpots.length === 0 && <p style={{ color: 'var(--danger)', fontSize: 12, marginTop: 6 }}>No available spots match your vehicle type.</p>}
          </div>
        </Modal>
      )}

      {modal === 'complete' && (
        <Modal title="Complete Ticket (Vehicle Exit)" onClose={() => setModal(null)}
          footer={<><button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-warning" onClick={handleComplete} disabled={saving}>{saving ? 'Processing…' : 'Confirm Exit'}</button></>}>
          <p className="confirm-text">Confirm exit for vehicle</p>
          <p className="confirm-highlight">{selected?.vehicleId?.licensePlate}</p>
          <p className="confirm-text" style={{ marginTop: 8 }}>This will free the spot, mark the ticket as completed, and auto-generate an invoice.</p>
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal title="Delete Ticket" onClose={() => setModal(null)}
          footer={<><button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-danger" onClick={handleDelete} disabled={saving}>{saving ? 'Deleting…' : 'Yes, Delete'}</button></>}>
          <p className="confirm-text">Delete this ticket? This cannot be undone.</p>
        </Modal>
      )}
    </div>
  )
}
