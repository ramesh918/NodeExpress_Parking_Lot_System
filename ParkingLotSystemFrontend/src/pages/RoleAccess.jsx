import { useEffect, useState } from 'react'
import api from '../api/axios'
import Modal from '../components/Modal'
import { useToast } from '../components/Toast'

const ROLES = ['SUPER_ADMIN', 'ADMIN', 'USER']
const RESOURCES = ['PARKINGLOT', 'PARKINGSPOT', 'VEHICLE', 'TICKET', 'INVOICE', 'FEE']
const ACTIONS = ['CREATE', 'READ', 'UPDATE', 'DELETE']
const EMPTY = { role: '', resource: '', actions: [] }

export default function RoleAccess() {
  const toast = useToast()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/role-access')
      setEntries(res.data.data)
    } catch (_) {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(EMPTY); setModal('create') }
  const openEdit = (e) => { setSelected(e); setForm({ role: e.role, resource: e.resource, actions: [...e.actions] }); setModal('edit') }
  const openDelete = (e) => { setSelected(e); setModal('delete') }
  const closeModal = () => { setModal(null); setSelected(null) }

  const toggleAction = (action) => {
    setForm((f) => ({
      ...f,
      actions: f.actions.includes(action) ? f.actions.filter((a) => a !== action) : [...f.actions, action],
    }))
  }

  const selectAll = () => setForm((f) => ({ ...f, actions: [...ACTIONS] }))
  const clearAll = () => setForm((f) => ({ ...f, actions: [] }))

  const handleSave = async () => {
    setSaving(true)
    try {
      if (modal === 'create') {
        await api.post('/role-access', form)
        toast('Role access created')
      } else {
        await api.patch(`/role-access/${selected._id}`, { actions: form.actions })
        toast('Role access updated')
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
      await api.delete(`/role-access/${selected._id}`)
      toast('Role access entry deleted')
      closeModal(); load()
    } catch (err) {
      const d = err.response?.data
      toast(d?.details?.[0] || d?.message || 'Delete failed', 'error')
    }
    setSaving(false)
  }

  const roleBadge = (r) => ({ SUPER_ADMIN: 'badge-yellow', ADMIN: 'badge-blue', USER: 'badge-green' }[r] || 'badge-gray')
  const actionColor = (a) => ({ CREATE: '#22c55e', READ: '#3b82f6', UPDATE: '#f59e0b', DELETE: '#ef4444' }[a])

  // Group entries by role for display
  const grouped = ROLES.reduce((acc, role) => {
    acc[role] = entries.filter((e) => e.role === role)
    return acc
  }, {})

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Role Access Control</h2>
          <p className="page-subtitle">Define what each role can do on each resource</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Permission</button>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /> Loading…</div>
      ) : entries.length === 0 ? (
        <div className="card"><div className="empty-state"><div className="empty-state-icon">🔐</div><p>No role access entries yet.</p></div></div>
      ) : (
        ROLES.map((role) => grouped[role].length > 0 && (
          <div key={role} style={{ marginBottom: 20 }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span className={`badge ${roleBadge(role)}`} style={{ fontSize: 12 }}>{role.replace('_', ' ')}</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 13 }}>{grouped[role].length} resource{grouped[role].length !== 1 ? 's' : ''}</span>
            </h3>
            <div className="card">
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr><th>Resource</th><th>Allowed Actions</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {grouped[role].map((entry) => (
                      <tr key={entry._id}>
                        <td style={{ fontWeight: 600 }}>{entry.resource}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {ACTIONS.map((a) => (
                              <span key={a} style={{
                                padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700,
                                background: entry.actions.includes(a) ? actionColor(a) + '20' : '#f1f5f9',
                                color: entry.actions.includes(a) ? actionColor(a) : '#94a3b8',
                                border: `1px solid ${entry.actions.includes(a) ? actionColor(a) + '50' : 'transparent'}`,
                              }}>
                                {a}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <div className="actions-cell">
                            <button className="btn btn-ghost btn-sm" onClick={() => openEdit(entry)}>✏ Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => openDelete(entry)}>🗑</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))
      )}

      {(modal === 'create' || modal === 'edit') && (
        <Modal
          title={modal === 'create' ? 'Add Permission' : `Edit ${selected?.role} → ${selected?.resource}`}
          onClose={closeModal}
          footer={
            <>
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving || form.actions.length === 0}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </>
          }
        >
          {modal === 'create' ? (
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-control" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
                  <option value="">Select role</option>
                  {ROLES.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Resource</label>
                <select className="form-control" value={form.resource} onChange={(e) => setForm((f) => ({ ...f, resource: e.target.value }))}>
                  <option value="">Select resource</option>
                  {RESOURCES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
          ) : (
            <div className="form-row" style={{ marginBottom: 4 }}>
              <div className="form-group"><label className="form-label">Role</label><input className="form-control" value={form.role.replace('_', ' ')} disabled /></div>
              <div className="form-group"><label className="form-label">Resource</label><input className="form-control" value={form.resource} disabled /></div>
            </div>
          )}

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Allowed Actions</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost btn-sm" onClick={selectAll}>All</button>
                <button className="btn btn-ghost btn-sm" onClick={clearAll}>None</button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {ACTIONS.map((action) => {
                const checked = form.actions.includes(action)
                return (
                  <label key={action} onClick={() => toggleAction(action)} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                    border: `2px solid ${checked ? actionColor(action) : 'var(--border)'}`,
                    borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s',
                    background: checked ? actionColor(action) + '10' : '#fff',
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 4, border: `2px solid ${checked ? actionColor(action) : 'var(--border)'}`,
                      background: checked ? actionColor(action) : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {checked && <span style={{ color: '#fff', fontSize: 11, fontWeight: 900 }}>✓</span>}
                    </div>
                    <span style={{ fontWeight: 700, color: checked ? actionColor(action) : 'var(--text-muted)', fontSize: 13 }}>{action}</span>
                  </label>
                )
              })}
            </div>
          </div>
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal title="Delete Permission" onClose={closeModal}
          footer={<><button className="btn btn-ghost" onClick={closeModal}>Cancel</button><button className="btn btn-danger" onClick={handleDelete} disabled={saving}>{saving ? 'Deleting…' : 'Yes, Delete'}</button></>}>
          <p className="confirm-text">Remove access for</p>
          <p className="confirm-highlight">{selected?.role} → {selected?.resource}</p>
          <p className="confirm-text" style={{ marginTop: 8 }}>This cannot be undone.</p>
        </Modal>
      )}
    </div>
  )
}
