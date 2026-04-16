import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'
import { useToast } from '../components/Toast'

const EMPTY = { name: '', address: '', city: '', totalSpots: '' }

export default function ParkingLots() {
  const { isAdmin } = useAuth()
  const toast = useToast()
  const [lots, setLots] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // 'create' | 'edit' | 'delete'
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/parking-lots')
      setLots(res.data.data)
    } catch (_) {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(EMPTY); setModal('create') }
  const openEdit = (lot) => { setSelected(lot); setForm({ name: lot.name, address: lot.address, city: lot.city, totalSpots: lot.totalSpots }); setModal('edit') }
  const openDelete = (lot) => { setSelected(lot); setModal('delete') }
  const closeModal = () => { setModal(null); setSelected(null) }

  const handleSave = async () => {
    setSaving(true)
    try {
      const body = { ...form, totalSpots: Number(form.totalSpots) }
      if (modal === 'create') {
        await api.post('/parking-lots', body)
        toast('Parking lot created successfully')
      } else {
        await api.patch(`/parking-lots/${selected._id}`, body)
        toast('Parking lot updated successfully')
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
      await api.delete(`/parking-lots/${selected._id}`)
      toast('Parking lot deleted')
      closeModal(); load()
    } catch (err) {
      const d = err.response?.data
      toast(d?.details?.[0] || d?.message || 'Delete failed', 'error')
    }
    setSaving(false)
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Parking Lots</h2>
          <p className="page-subtitle">{lots.length} lot{lots.length !== 1 ? 's' : ''} registered</p>
        </div>
        {isAdmin && <button className="btn btn-primary" onClick={openCreate}>+ Add Parking Lot</button>}
      </div>

      <div className="card">
        {loading ? (
          <div className="loading"><div className="spinner" /> Loading…</div>
        ) : lots.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">🏢</div><p>No parking lots found.</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Name</th><th>Address</th><th>City</th><th>Total Spots</th><th>Created</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {lots.map((lot, i) => (
                  <tr key={lot._id}>
                    <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{lot.name}</td>
                    <td>{lot.address}</td>
                    <td>{lot.city}</td>
                    <td><span className="badge badge-blue">{lot.totalSpots} spots</span></td>
                    <td style={{ color: 'var(--text-muted)' }}>{new Date(lot.createdAt).toLocaleDateString()}</td>
                    {isAdmin && (
                      <td>
                        <div className="actions-cell">
                          <button className="btn btn-ghost btn-sm" onClick={() => openEdit(lot)}>✏ Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => openDelete(lot)}>🗑</button>
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
        <Modal
          title={modal === 'create' ? 'Add Parking Lot' : 'Edit Parking Lot'}
          onClose={closeModal}
          footer={<>
            <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          </>}
        >
          <div className="form-group"><label className="form-label">Name</label><input className="form-control" value={form.name} onChange={set('name')} placeholder="Downtown Parking Plaza" /></div>
          <div className="form-group"><label className="form-label">Address</label><input className="form-control" value={form.address} onChange={set('address')} placeholder="123 Main Street" /></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">City</label><input className="form-control" value={form.city} onChange={set('city')} placeholder="Hyderabad" /></div>
            <div className="form-group"><label className="form-label">Total Spots</label><input className="form-control" type="number" min="1" value={form.totalSpots} onChange={set('totalSpots')} placeholder="50" /></div>
          </div>
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal title="Delete Parking Lot" onClose={closeModal} footer={<>
          <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={saving}>{saving ? 'Deleting…' : 'Yes, Delete'}</button>
        </>}>
          <p className="confirm-text">Are you sure you want to delete</p>
          <p className="confirm-highlight">"{selected?.name}"?</p>
          <p className="confirm-text" style={{ marginTop: 8 }}>This action cannot be undone.</p>
        </Modal>
      )}
    </div>
  )
}
