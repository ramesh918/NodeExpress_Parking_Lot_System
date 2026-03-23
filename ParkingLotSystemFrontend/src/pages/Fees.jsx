import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'
import { useToast } from '../components/Toast'

const TYPES = ['TWO_WHEELER', 'THREE_WHEELER', 'FOUR_WHEELER']
const EMPTY = { vehicleType: '', baseFare: '', ratePerHour: '' }

export default function Fees() {
  const { isAdmin } = useAuth()
  const toast = useToast()
  const [fees, setFees] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/fees')
      setFees(res.data.data)
    } catch (_) {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(EMPTY); setModal('create') }
  const openEdit = (f) => { setSelected(f); setForm({ vehicleType: f.vehicleType, baseFare: f.baseFare, ratePerHour: f.ratePerHour }); setModal('edit') }
  const closeModal = () => { setModal(null); setSelected(null) }
  const set = (k) => (e) => setForm((prev) => ({ ...prev, [k]: e.target.value }))

  const existingTypes = fees.map((f) => f.vehicleType)
  const availableTypes = TYPES.filter((t) => !existingTypes.includes(t))

  const handleSave = async () => {
    setSaving(true)
    try {
      const body = { ...form, baseFare: Number(form.baseFare), ratePerHour: Number(form.ratePerHour) }
      if (modal === 'create') {
        await api.post('/fees', body)
        toast('Fee created')
      } else {
        await api.patch(`/fees/${selected._id}`, { baseFare: body.baseFare, ratePerHour: body.ratePerHour })
        toast('Fee updated')
      }
      closeModal(); load()
    } catch (err) {
      toast(err.response?.data?.message || 'Something went wrong', 'error')
    }
    setSaving(false)
  }

  const icons = { TWO_WHEELER: '🛵', THREE_WHEELER: '🛺', FOUR_WHEELER: '🚗' }
  const typeBadge = (t) => ({ TWO_WHEELER: 'badge-blue', THREE_WHEELER: 'badge-orange', FOUR_WHEELER: 'badge-purple' }[t] || 'badge-gray')

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Fee Configuration</h2>
          <p className="page-subtitle">Parking charges per vehicle type</p>
        </div>
        {isAdmin && availableTypes.length > 0 && <button className="btn btn-primary" onClick={openCreate}>+ Add Fee</button>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
        {fees.map((fee) => (
          <div key={fee._id} className="card card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 28 }}>{icons[fee.vehicleType]}</span>
                <div>
                  <span className={`badge ${typeBadge(fee.vehicleType)}`}>{fee.vehicleType.replace(/_/g, ' ')}</span>
                </div>
              </div>
              {isAdmin && <button className="btn btn-ghost btn-sm" onClick={() => openEdit(fee)}>✏ Edit</button>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 2 }}>Base Fare</div>
                <div style={{ fontSize: 22, fontWeight: 800 }}>₹{fee.baseFare}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 2 }}>Per Hour</div>
                <div style={{ fontSize: 22, fontWeight: 800 }}>₹{fee.ratePerHour}</div>
              </div>
            </div>
          </div>
        ))}
        {fees.length === 0 && !loading && (
          <div className="card"><div className="empty-state"><div className="empty-state-icon">💰</div><p>No fees configured yet.</p></div></div>
        )}
        {loading && <div className="loading"><div className="spinner" /> Loading…</div>}
      </div>

      <div className="card card-body" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
        <h4 style={{ marginBottom: 8, color: '#92400e' }}>💡 How invoice amount is calculated</h4>
        <p style={{ color: '#78350f', fontSize: 13, lineHeight: 1.6 }}>
          Amount = <strong>Base Fare</strong> + ( <strong>ceil(Hours Parked)</strong> × <strong>Rate Per Hour</strong> )<br />
          Example: Base ₹20 + 3 hours × ₹10/hr = <strong>₹50 total</strong>
        </p>
      </div>

      {(modal === 'create' || modal === 'edit') && (
        <Modal title={modal === 'create' ? 'Add Fee' : 'Edit Fee'} onClose={closeModal}
          footer={<><button className="btn btn-ghost" onClick={closeModal}>Cancel</button><button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button></>}>
          {modal === 'create' ? (
            <div className="form-group">
              <label className="form-label">Vehicle Type</label>
              <select className="form-control" value={form.vehicleType} onChange={set('vehicleType')}>
                <option value="">Select type</option>
                {availableTypes.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
          ) : (
            <div className="form-group"><label className="form-label">Vehicle Type</label><input className="form-control" value={form.vehicleType.replace(/_/g, ' ')} disabled /></div>
          )}
          <div className="form-row">
            <div className="form-group"><label className="form-label">Base Fare (₹)</label><input className="form-control" type="number" min="0" value={form.baseFare} onChange={set('baseFare')} placeholder="20" /></div>
            <div className="form-group"><label className="form-label">Rate Per Hour (₹)</label><input className="form-control" type="number" min="0" value={form.ratePerHour} onChange={set('ratePerHour')} placeholder="10" /></div>
          </div>
        </Modal>
      )}
    </div>
  )
}
