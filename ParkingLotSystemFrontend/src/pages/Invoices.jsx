import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'
import { useToast } from '../components/Toast'

export default function Invoices() {
  const { isAdmin } = useAuth()
  const toast = useToast()
  const [invoices, setInvoices] = useState([])
  const [completedTickets, setCompletedTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [ticketId, setTicketId] = useState('')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const url = isAdmin ? '/invoices' : '/invoices/my'
      const [invRes, ticketRes] = await Promise.all([api.get(url), api.get('/tickets')])
      setInvoices(invRes.data.data)
      const invoicedTicketIds = invRes.data.data.map((i) => i.ticketId?._id || i.ticketId)
      setCompletedTickets(
        ticketRes.data.data.filter(
          (t) => t.status === 'COMPLETED' && !invoicedTicketIds.includes(t._id)
        )
      )
    } catch (_) {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleGenerate = async () => {
    setSaving(true)
    try {
      await api.post('/invoices/generate', { ticketId })
      toast('Invoice generated successfully!')
      setModal(null)
      setTicketId('')
      load()
    } catch (err) {
      toast(err.response?.data?.message || 'Something went wrong', 'error')
    }
    setSaving(false)
  }

  const handlePay = async () => {
    setSaving(true)
    try {
      await api.patch(`/invoices/${selected._id}`, { status: 'PAID' })
      toast('Invoice marked as Paid!')
      setModal(null)
      load()
    } catch (err) {
      toast(err.response?.data?.message || 'Failed', 'error')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      await api.delete(`/invoices/${selected._id}`)
      toast('Invoice deleted')
      setModal(null)
      load()
    } catch (err) {
      toast(err.response?.data?.message || 'Delete failed', 'error')
    }
    setSaving(false)
  }

  const total = invoices.reduce((s, i) => s + i.amount, 0)
  const paid = invoices.filter((i) => i.status === 'PAID').reduce((s, i) => s + i.amount, 0)
  const pending = invoices.filter((i) => i.status === 'PENDING').reduce((s, i) => s + i.amount, 0)

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Invoices</h2>
          <p className="page-subtitle">{invoices.length} invoice{invoices.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setTicketId(''); setModal('generate') }}>
          + Generate Invoice
        </button>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-icon blue">💰</div>
          <div><div className="stat-value">&#8377;{total}</div><div className="stat-label">Total Billed</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">&#10003;</div>
          <div><div className="stat-value">&#8377;{paid}</div><div className="stat-label">Collected</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">&#8987;</div>
          <div><div className="stat-value">&#8377;{pending}</div><div className="stat-label">Pending</div></div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading"><div className="spinner" /> Loading...</div>
        ) : invoices.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">&#129534;</div>
            <p>No invoices yet. Complete a ticket first, then generate an invoice.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  {isAdmin && <th>Customer</th>}
                  <th>Ticket Ref</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, i) => (
                  <tr key={inv._id}>
                    <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                    {isAdmin && (
                      <td>
                        {inv.userId?.name || '—'}
                        <br />
                        <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{inv.userId?.email}</span>
                      </td>
                    )}
                    <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>
                      ...{(inv.ticketId?._id || inv.ticketId || '').slice(-8)}
                    </td>
                    <td style={{ fontWeight: 700, fontSize: 16 }}>&#8377;{inv.amount}</td>
                    <td>
                      <span className={`badge ${inv.status === 'PAID' ? 'badge-green' : 'badge-yellow'}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="actions-cell">
                        {inv.status === 'PENDING' && (
                          <button className="btn btn-success btn-sm" onClick={() => { setSelected(inv); setModal('pay') }}>
                            Pay
                          </button>
                        )}
                        {isAdmin && (
                          <button className="btn btn-danger btn-sm" onClick={() => { setSelected(inv); setModal('delete') }}>
                            &#128465;
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal === 'generate' && (
        <Modal
          title="Generate Invoice"
          onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleGenerate} disabled={saving || !ticketId}>
                {saving ? 'Generating...' : 'Generate'}
              </button>
            </>
          }
        >
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 14 }}>
            Select a completed ticket. Amount is auto-calculated from duration and fee config.
          </p>
          <div className="form-group">
            <label className="form-label">
              Completed Ticket
            </label>
            <select className="form-control" value={ticketId} onChange={(e) => setTicketId(e.target.value)}>
              <option value="">Select a ticket</option>
              {completedTickets.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.vehicleId?.licensePlate} — {t.parkingSpotId?.spotNumber} (
                  {new Date(t.entryTime).toLocaleDateString()} to{' '}
                  {t.exitTime ? new Date(t.exitTime).toLocaleDateString() : '?'})
                </option>
              ))}
            </select>
            {completedTickets.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 6 }}>
                No uninvoiced completed tickets found.
              </p>
            )}
          </div>
        </Modal>
      )}

      {modal === 'pay' && (
        <Modal
          title="Confirm Payment"
          onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-success" onClick={handlePay} disabled={saving}>
                {saving ? 'Processing...' : 'Confirm Payment'}
              </button>
            </>
          }
        >
          <p className="confirm-text">Confirm payment of</p>
          <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--success)', margin: '8px 0' }}>
            &#8377;{selected?.amount}
          </p>
          <p className="confirm-text">This will mark the invoice as PAID.</p>
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal
          title="Delete Invoice"
          onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={saving}>
                {saving ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </>
          }
        >
          <p className="confirm-text">
            Delete invoice of <span className="confirm-highlight">&#8377;{selected?.amount}</span>? This cannot be undone.
          </p>
        </Modal>
      )}
    </div>
  )
}
