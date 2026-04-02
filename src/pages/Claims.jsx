import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import AppLayout from '../components/AppLayout.jsx'
import PageHeader from '../components/PageHeader.jsx'

const CLAIM_TYPES = ['Outpatient', 'Inpatient', 'Pharmacy', 'Lab', 'Dental', 'Optical', 'Emergency', 'Other']

const STATUS_CFG = {
  submitted:    { label: 'Submitted',    bg: 'bg-blue-light',   text: 'text-blue-brand',   icon: 'schedule' },
  under_review: { label: 'Under Review', bg: 'bg-orange-light', text: 'text-orange-brand', icon: 'manage_search' },
  approved:     { label: 'Approved',     bg: 'bg-green-light',  text: 'text-green-brand',  icon: 'check_circle' },
  rejected:     { label: 'Rejected',     bg: 'bg-red-50',       text: 'text-red-500',      icon: 'cancel' },
  paid:         { label: 'Paid',         bg: 'bg-green-light',  text: 'text-green-brand',  icon: 'payments' },
}

export default function Claims() {
  const { claims, submitClaim, subscription } = useApp()
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: '', description: '', amount: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.type) e.type = 'Select a claim type'
    if (!form.description.trim() || form.description.length < 10) e.description = 'Please describe in at least 10 characters'
    if (!form.amount || parseInt(form.amount) < 100) e.amount = 'Minimum claim amount is ₦100'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    setSubmitting(true)
    setTimeout(() => {
      submitClaim({ type: form.type, description: form.description, amount: parseInt(form.amount) })
      setSubmitting(false)
      setSubmitted(true)
      setTimeout(() => { setShowForm(false); setSubmitted(false); setForm({ type: '', description: '', amount: '' }) }, 1500)
    }, 1100)
  }

  return (
    <AppLayout>
      <PageHeader
        title="Claims"
        subtitle={`${claims.length} total claim${claims.length !== 1 ? 's' : ''}`}
        right={
          <button onClick={() => setShowForm(true)}
            className="bg-blue-brand text-white font-display font-bold px-4 py-2 rounded-2xl text-sm flex items-center gap-1.5 hover:bg-blue-dark transition-colors shadow-blue">
            <span className="icon-o text-lg">add</span>
            <span className="hidden sm:inline">New Claim</span>
          </button>
        }
      />

      <div className="px-4 lg:px-8 pt-5 pb-28 lg:pb-10 max-w-5xl">

        {claims.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-card p-16 text-center mt-4">
            <span className="icon text-5xl text-ink-border mb-4 block">receipt_long</span>
            <h3 className="font-display font-bold text-ink text-lg mb-2">No claims yet</h3>
            <p className="text-sm text-ink-muted leading-relaxed mb-6 max-w-xs mx-auto">
              Submit a claim for any medical expenses covered under your {subscription.plan} plan.
            </p>
            <button onClick={() => setShowForm(true)}
              className="bg-blue-brand text-white font-display font-bold px-6 py-3 rounded-2xl text-sm hover:bg-blue-dark transition-colors shadow-blue inline-flex items-center gap-2">
              <span className="icon-o">add</span> File Your First Claim
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {claims.map((c, idx) => {
              const s = STATUS_CFG[c.status] || { label: c.status, bg: 'bg-ink-faint', text: 'text-ink-muted', icon: 'info' }
              return (
                <div key={c.id || c.ref}
                  className="bg-white rounded-3xl shadow-card p-5 fu"
                  style={{ animationDelay: `${idx * 0.06}s` }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-light rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="icon text-orange-brand text-xl">receipt_long</span>
                      </div>
                      <div>
                        <p className="font-display font-bold text-ink">{c.type}</p>
                        <p className="text-[10px] text-ink-muted font-display">{c.ref}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-display font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${s.bg} ${s.text}`}>
                      <span className={`icon text-xs`}>{s.icon}</span>
                      {s.label}
                    </span>
                  </div>

                  <p className="text-sm text-ink-muted leading-relaxed mb-3 line-clamp-2">{c.description}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-ink-border">
                    <div>
                      <p className="text-[10px] font-display text-ink-muted">Claim Amount</p>
                      <p className="font-display font-bold text-ink">₦{c.amount?.toLocaleString()}</p>
                    </div>
                    <p className="text-[10px] text-ink-muted font-display">
                      {new Date(c.date || c.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Info card */}
        <div className="mt-5 bg-blue-light border border-blue-muted rounded-2xl p-4 flex gap-3 items-start">
          <span className="icon text-blue-brand text-xl flex-shrink-0">info</span>
          <div>
            <p className="text-xs font-display font-bold text-blue-brand mb-0.5">How claims work</p>
            <p className="text-xs text-blue-700 leading-relaxed">
              Submit your claim with a description and amount. Our team reviews within 3–5 business days. Approved claims are paid directly to your bank account.
            </p>
          </div>
        </div>
      </div>

      {/* New Claim Modal / Slide-up */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end lg:items-center justify-center p-0 lg:p-6"
          onClick={() => setShowForm(false)}>
          <div className="bg-white w-full lg:max-w-lg rounded-t-4xl lg:rounded-3xl p-6 scale-in max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-ink-border rounded-full mx-auto mb-5 lg:hidden"/>
            <h3 className="font-display font-extrabold text-xl text-ink mb-1">New Claim</h3>
            <p className="text-sm text-ink-muted mb-5">Complete the form below to submit your claim.</p>

            {/* Claim type */}
            <label className="block text-[10px] font-display font-bold text-ink-muted uppercase tracking-wider mb-2">Claim Type</label>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {CLAIM_TYPES.map(t => (
                <button key={t} onClick={() => set('type', t)}
                  className={`py-2 px-1 rounded-xl font-display font-semibold text-[11px] border-2 transition-all ${
                    form.type === t ? 'border-blue-brand bg-blue-light text-blue-brand' : 'border-ink-border bg-ink-faint text-ink-muted'
                  }`}>{t}</button>
              ))}
            </div>
            {errors.type && <p className="text-red-500 text-[10px] -mt-2 mb-3">{errors.type}</p>}

            {/* Description */}
            <label className="block text-[10px] font-display font-bold text-ink-muted uppercase tracking-wider mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Describe the medical service, treatment or prescription..."
              rows={3}
              className={`w-full bg-ink-faint border-2 rounded-2xl px-4 py-3 font-display text-ink text-sm transition-all resize-none mb-1 ${errors.description ? 'border-red-400' : 'border-ink-border focus:border-blue-brand'}`}/>
            {errors.description && <p className="text-red-500 text-[10px] mb-3">{errors.description}</p>}

            {/* Amount */}
            <label className="block text-[10px] font-display font-bold text-ink-muted uppercase tracking-wider mb-1.5 mt-3">Amount (₦)</label>
            <div className="relative mb-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-bold text-ink-muted text-lg">₦</span>
              <input type="number" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="0"
                className={`w-full bg-ink-faint border-2 rounded-2xl h-13 pl-9 pr-4 py-3.5 font-display font-bold text-lg text-ink transition-all ${errors.amount ? 'border-red-400' : 'border-ink-border focus:border-blue-brand'}`}/>
            </div>
            {errors.amount && <p className="text-red-500 text-[10px] mb-3">{errors.amount}</p>}

            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)}
                className="flex-1 bg-ink-faint text-ink font-display font-bold py-3.5 rounded-2xl hover:bg-ink-border transition-colors">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={submitting || submitted}
                className={`flex-1 font-display font-bold py-3.5 rounded-2xl text-white flex items-center justify-center gap-2 transition-all ${
                  submitted ? 'bg-green-brand' : 'bg-blue-brand hover:bg-blue-dark shadow-blue'
                } disabled:opacity-70`}>
                {submitting
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spin"/>Submitting…</>
                  : submitted
                  ? <><span className="icon text-sm">check_circle</span>Submitted!</>
                  : <><span className="icon-o">send</span>Submit Claim</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
