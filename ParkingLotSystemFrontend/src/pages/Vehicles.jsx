import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'
import { useToast } from '../components/Toast'

const TYPES = ['TWO_WHEELER', 'THREE_WHEELER', 'FOUR_WHEELER']
const EMPTY = { licensePlate: '', vehicleType: '', make: '', model: '', color: '' }

export default function Vehicles() {
  const { isAdmin } = useAuth()
  const toast = useToast()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const url = isAdmin ? '/vehicles' : '/vehicles/my'
      const res = await api.get(url)
      setVehicles(res.data.data)
    } catch (_) {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(EMPTY); setModal('create') }
  const openEdit = (v) => { setSelected(v); setForm({ licensePlate: v.licensePlate, vehicleType: v.vehicleType, make: v.make, model: v.model, color: v.color }); setModal('edit') }
  const openDelete = (v) => { setSelected(v); setModal('delete') }
  const closeModal = () => { setModal(null); setSelected(null) }
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      if (modal === 'create') {
        await api.post('/vehicles', form)
        toast('Vehicle registered successfully')
      } else {
        await api.patch(`/vehicles/${selected._id}`, form)
        toast('Vehicle updated')
      }
      closeModal(); load()
    } catch (err) {
      const d = err.response?.data
      toast(d?.details?.[0] || d?.message || 'Something went wrong', 'error')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      await api.delete(`/vehicles/${selected._id}`)
      toast('Vehicle deleted')
      closeModal(); load()
    } catch (err) {
      const d = err.response?.data
      toast(d?.details?.[0] || d?.message || 'Delete failed', 'error')
    }
    setSaving(false)
  }

  const typeBadge = (t) => ({ TWO_WHEELER: 'badge-blue', THREE_WHEELER: 'badge-orange', FOUR_WHEELER: 'badge-purple' }[t] || 'badge-gray')

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">{isAdmin ? 'All Vehicles' : 'My Vehicles'}</h2>
          <p className="page-subtitle">{vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} registered</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Register Vehicle</button>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading"><div className="spinner" /> Loading…</div>
        ) : vehicles.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">🚗</div><p>No vehicles registered yet.</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>#</th><th>License Plate</th><th>Type</th><th>Make / Model</th><th>Color</th>
                  {isAdmin && <th>Owner</th>}<th>Registered</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {vehicles.map((v, i) => (
                  <tr key={v._id}>
                    <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                    <td style={{ fontWeight: 700, fontFamily: 'monospace', letterSpacing: 1 }}>{v.licensePlate}</td>
                    <td><span className={`badge ${typeBadge(v.vehicleType)}`}>{v.vehicleType.replace(/_/g, ' ')}</span></td>
                    <td>{v.make} {v.model}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 14, height: 14, borderRadius: '50%', background: v.color.toLowerCase(), border: '1px solid var(--border)' }} />
                        {v.color}
                      </div>
                    </td>
                    {isAdmin && <td style={{ color: 'var(--text-muted)' }}>{v.userId?.name || '—'}</td>}
                    <td style={{ color: 'var(--text-muted)' }}>{new Date(v.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(v)}>✏ Edit</button>
                        {isAdmin && <button className="btn btn-danger btn-sm" onClick={() => openDelete(v)}>🗑</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {(modal === 'create' || modal === 'edit') && (
        <Modal title={modal === 'create' ? 'Register Vehicle' : 'Edit Vehicle'} onClose={closeModal}
          footer={<><button className="btn btn-ghost" onClick={closeModal}>Cancel</button><button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button></>}>
          <div className="form-row">
            <div className="form-group"><label className="form-label">License Plate</label><input className="form-control" value={form.licensePlate} onChange={set('licensePlate')} placeholder="TS09AB1234" style={{ textTransform: 'uppercase' }} /></div>
            <div className="form-group">
              <label className="form-label">Vehicle Type</label>
              <select className="form-control" value={form.vehicleType} onChange={set('vehicleType')}>
                <option value="">Select type</option>
                {TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Make</label><input className="form-control" value={form.make} onChange={set('make')} placeholder="Honda" /></div>
            <div className="form-group"><label className="form-label">Model</label><input className="form-control" value={form.model} onChange={set('model')} placeholder="Activa" /></div>
          </div>
          <div className="form-group"><label className="form-label">Color</label><input className="form-control" value={form.color} onChange={set('color')} placeholder="Red" /></div>
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal title="Delete Vehicle" onClose={closeModal}
          footer={<><button className="btn btn-ghost" onClick={closeModal}>Cancel</button><button className="btn btn-danger" onClick={handleDelete} disabled={saving}>{saving ? 'Deleting…' : 'Yes, Delete'}</button></>}>
          <p className="confirm-text">Delete vehicle <span className="confirm-highlight">{selected?.licensePlate}</span>?</p>
          <p className="confirm-text" style={{ marginTop: 8 }}>This cannot be undone.</p>
        </Modal>
      )}
    </div>
  )
}
