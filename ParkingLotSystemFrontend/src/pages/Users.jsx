import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'
import { useToast } from '../components/Toast'

const EMPTY = { name: '', email: '', password: '', role: 'USER' }
const ROLES = ['USER', 'ADMIN', 'SUPER_ADMIN']

export default function Users() {
  const { isSuperAdmin } = useAuth()
  const toast = useToast()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/users')
      setUsers(res.data.data)
    } catch (_) {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(EMPTY); setModal('create') }
  const openEdit = (u) => { setSelected(u); setForm({ name: u.name, email: u.email, password: '', role: u.role }); setModal('edit') }
  const openDelete = (u) => { setSelected(u); setModal('delete') }
  const closeModal = () => { setModal(null); setSelected(null) }
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      if (modal === 'create') {
        await api.post('/users', form)
        toast('User created successfully')
      } else {
        const body = { name: form.name, role: form.role }
        await api.patch(`/users/${selected._id}`, body)
        toast('User updated')
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
      await api.delete(`/users/${selected._id}`)
      toast('User deleted')
      closeModal(); load()
    } catch (err) {
      toast(err.response?.data?.message || 'Delete failed', 'error')
    }
    setSaving(false)
  }

  const roleBadge = (r) => ({ SUPER_ADMIN: 'badge-yellow', ADMIN: 'badge-blue', USER: 'badge-green' }[r] || 'badge-gray')

  const filtered = users.filter(
    (u) => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const counts = { total: users.length, superAdmin: users.filter((u) => u.role === 'SUPER_ADMIN').length, admin: users.filter((u) => u.role === 'ADMIN').length, user: users.filter((u) => u.role === 'USER').length }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Users</h2>
          <p className="page-subtitle">{counts.total} total — {counts.superAdmin} Super Admin, {counts.admin} Admin, {counts.user} User</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add User</button>
      </div>

      <div className="filter-bar">
        <input className="form-control" placeholder="Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ minWidth: 260 }} />
      </div>

      <div className="card">
        {loading ? (
          <div className="loading"><div className="spinner" /> Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">👥</div><p>No users found.</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u._id}>
                    <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                    <td><span className={`badge ${roleBadge(u.role)}`}>{u.role.replace('_', ' ')}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(u)}>✏ Edit</button>
                        {isSuperAdmin && <button className="btn btn-danger btn-sm" onClick={() => openDelete(u)}>🗑</button>}
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
        <Modal
          title={modal === 'create' ? 'Add New User' : 'Edit User'}
          onClose={closeModal}
          footer={
            <>
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            </>
          }
        >
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-control" value={form.name} onChange={set('name')} placeholder="John Doe" />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-control" type="email" value={form.email} onChange={set('email')} placeholder="john@example.com" disabled={modal === 'edit'} />
          </div>
          {modal === 'create' && (
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-control" type="password" value={form.password} onChange={set('password')} placeholder="Min 6 characters" />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-control" value={form.role} onChange={set('role')}>
              {(isSuperAdmin ? ROLES : ['USER', 'ADMIN']).map((r) => (
                <option key={r} value={r}>{r.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal title="Delete User" onClose={closeModal}
          footer={<><button className="btn btn-ghost" onClick={closeModal}>Cancel</button><button className="btn btn-danger" onClick={handleDelete} disabled={saving}>{saving ? 'Deleting…' : 'Yes, Delete'}</button></>}>
          <p className="confirm-text">Are you sure you want to delete</p>
          <p className="confirm-highlight">"{selected?.name}" ({selected?.email})?</p>
          <p className="confirm-text" style={{ marginTop: 8 }}>This action cannot be undone.</p>
        </Modal>
      )}
    </div>
  )
}
