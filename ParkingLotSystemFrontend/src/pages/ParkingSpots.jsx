import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'
import { useToast } from '../components/Toast'

const TYPES = ['TWO_WHEELER', 'THREE_WHEELER', 'FOUR_WHEELER']
const EMPTY = { parkingLotId: '', spotNumber: '', spotType: '', isOccupied: false }

export default function ParkingSpots() {
  const { isAdmin } = useAuth()
  const toast = useToast()
  const [spots, setSpots] = useState([])
  const [lots, setLots] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ parkingLotId: '', spotType: '', isOccupied: '' })
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filter.parkingLotId) params.parkingLotId = filter.parkingLotId
      if (filter.spotType) params.spotType = filter.spotType
      if (filter.isOccupied !== '') params.isOccupied = filter.isOccupied
      const [spotsRes, lotsRes] = await Promise.all([api.get('/parking-spots', { params }), api.get('/parking-lots')])
      setSpots(spotsRes.data.data)
      setLots(lotsRes.data.data)
    } catch (_) {}
    setLoading(false)
  }

  useEffect(() => { load() }, [filter])

  const openCreate = () => { setForm(EMPTY); setModal('create') }
  const openEdit = (s) => { setSelected(s); setForm({ parkingLotId: s.parkingLotId?._id || s.parkingLotId, spotNumber: s.spotNumber, spotType: s.spotType, isOccupied: s.isOccupied }); setModal('edit') }
  const openDelete = (s) => { setSelected(s); setModal('delete') }
  const closeModal = () => { setModal(null); setSelected(null) }
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      if (modal === 'create') {
        await api.post('/parking-spots', form)
        toast('Parking spot created')
      } else {
        await api.patch(`/parking-spots/${selected._id}`, { spotNumber: form.spotNumber, spotType: form.spotType })
        toast('Parking spot updated')
      }
      closeModal(); load()
    } catch (err) {
      toast(err.response?.data?.message || 'Something went wrong', 'error')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      await api.delete(`/parking-spots/${selected._id}`)
      toast('Parking spot deleted')
      closeModal(); load()
    } catch (err) {
      toast(err.response?.data?.message || 'Delete failed', 'error')
    }
    setSaving(false)
  }

  const typeBadge = (t) => ({ TWO_WHEELER: 'badge-blue', THREE_WHEELER: 'badge-orange', FOUR_WHEELER: 'badge-purple' }[t] || 'badge-gray')

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Parking Spots</h2>
          <p className="page-subtitle">{spots.length} spot{spots.length !== 1 ? 's' : ''} found</p>
        </div>
        {isAdmin && <button className="btn btn-primary" onClick={openCreate}>+ Add Spot</button>}
      </div>

      <div className="filter-bar">
        <select className="form-control" value={filter.parkingLotId} onChange={(e) => setFilter((f) => ({ ...f, parkingLotId: e.target.value }))}>
          <option value="">All Parking Lots</option>
          {lots.map((l) => <option key={l._id} value={l._id}>{l.name}</option>)}
        </select>
        <select className="form-control" value={filter.spotType} onChange={(e) => setFilter((f) => ({ ...f, spotType: e.target.value }))}>
          <option value="">All Types</option>
          {TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
        </select>
        <select className="form-control" value={filter.isOccupied} onChange={(e) => setFilter((f) => ({ ...f, isOccupied: e.target.value }))}>
          <option value="">All Status</option>
          <option value="false">Available</option>
          <option value="true">Occupied</option>
        </select>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading"><div className="spinner" /> Loading…</div>
        ) : spots.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">🅿</div><p>No parking spots found.</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>#</th><th>Spot No.</th><th>Type</th><th>Parking Lot</th><th>Status</th>{isAdmin && <th>Actions</th>}</tr>
              </thead>
              <tbody>
                {spots.map((s, i) => (
                  <tr key={s._id}>
                    <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                    <td style={{ fontWeight: 700 }}>{s.spotNumber}</td>
                    <td><span className={`badge ${typeBadge(s.spotType)}`}>{s.spotType.replace(/_/g, ' ')}</span></td>
                    <td>{s.parkingLotId?.name || '—'}</td>
                    <td>
                      <span className={`badge ${s.isOccupied ? 'badge-red' : 'badge-green'}`}>
                        {s.isOccupied ? 'Occupied' : 'Available'}
                      </span>
                    </td>
                    {isAdmin && (
                      <td>
                        <div className="actions-cell">
                          <button className="btn btn-ghost btn-sm" onClick={() => openEdit(s)}>✏ Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => openDelete(s)}>🗑</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {(modal === 'create' || modal === 'edit') && (
        <Modal title={modal === 'create' ? 'Add Parking Spot' : 'Edit Parking Spot'} onClose={closeModal}
          footer={<><button className="btn btn-ghost" onClick={closeModal}>Cancel</button><button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button></>}>
          {modal === 'create' && (
            <div className="form-group">
              <label className="form-label">Parking Lot</label>
              <select className="form-control" value={form.parkingLotId} onChange={set('parkingLotId')}>
                <option value="">Select parking lot</option>
                {lots.map((l) => <option key={l._id} value={l._id}>{l.name}</option>)}
              </select>
            </div>
          )}
          <div className="form-row">
            <div className="form-group"><label className="form-label">Spot Number</label><input className="form-control" value={form.spotNumber} onChange={set('spotNumber')} placeholder="T-01" /></div>
            <div className="form-group">
              <label className="form-label">Spot Type</label>
              <select className="form-control" value={form.spotType} onChange={set('spotType')}>
                <option value="">Select type</option>
                {TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal title="Delete Parking Spot" onClose={closeModal}
          footer={<><button className="btn btn-ghost" onClick={closeModal}>Cancel</button><button className="btn btn-danger" onClick={handleDelete} disabled={saving}>{saving ? 'Deleting…' : 'Yes, Delete'}</button></>}>
          <p className="confirm-text">Delete spot <span className="confirm-highlight">"{selected?.spotNumber}"</span>?</p>
          <p className="confirm-text" style={{ marginTop: 8 }}>This cannot be undone.</p>
        </Modal>
      )}
    </div>
  )
}
