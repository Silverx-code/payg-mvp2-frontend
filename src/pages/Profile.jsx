import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import AppLayout from '../components/AppLayout.jsx'
import PageHeader from '../components/PageHeader.jsx'

/* ─── small helpers ─────────────────────────────────────── */
function BottomSheet({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end lg:items-center justify-center p-0 lg:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white w-full lg:max-w-lg rounded-t-4xl lg:rounded-3xl p-6 scale-in max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-ink-border rounded-full mx-auto mb-5 lg:hidden" />
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-extrabold text-xl text-ink">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 bg-ink-faint rounded-full flex items-center justify-center">
            <span className="icon-o text-ink-muted text-xl">close</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Field({ label, value, editing, name, type = 'text', options, onChange }) {
  if (editing && options) {
    return (
      <div className="mb-4">
        <label className="block text-xs font-display font-semibold text-ink-muted mb-1.5">{label}</label>
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-ink-faint border border-ink-border rounded-2xl px-4 py-3 text-sm font-display text-ink focus:outline-none focus:border-blue-brand"
        >
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    )
  }
  if (editing) {
    return (
      <div className="mb-4">
        <label className="block text-xs font-display font-semibold text-ink-muted mb-1.5">{label}</label>
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className="w-full bg-ink-faint border border-ink-border rounded-2xl px-4 py-3 text-sm font-display text-ink focus:outline-none focus:border-blue-brand"
        />
      </div>
    )
  }
  return (
    <div className="flex items-center justify-between py-3 border-b border-ink-border last:border-0">
      <p className="text-xs font-display font-semibold text-ink-muted">{label}</p>
      <p className="text-sm font-display font-semibold text-ink">{value || '—'}</p>
    </div>
  )
}

/* ─── Personal Details modal ────────────────────────────── */
function PersonalDetailsModal({ open, onClose, user, onSave }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName:  user?.lastName  || '',
    dob:       user?.dob       || '',
    gender:    user?.gender    || '',
  })

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSave = () => {
    onSave(form)
    setEditing(false)
  }

  const handleClose = () => { setEditing(false); onClose() }

  return (
    <BottomSheet open={open} onClose={handleClose} title="Personal Details">
      <Field label="First Name"    value={form.firstName} editing={editing} name="firstName" onChange={handleChange} />
      <Field label="Last Name"     value={form.lastName}  editing={editing} name="lastName"  onChange={handleChange} />
      <Field label="Date of Birth" value={form.dob}       editing={editing} name="dob"       type="date" onChange={handleChange} />
      <Field label="Gender"        value={form.gender}    editing={editing} name="gender"
        options={['Male', 'Female', 'Prefer not to say']} onChange={handleChange} />

      {editing ? (
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setEditing(false)}
            className="flex-1 bg-ink-faint text-ink font-display font-bold py-4 rounded-3xl hover:bg-ink-border active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-brand text-white font-display font-bold py-4 rounded-3xl hover:bg-blue-dark active:scale-95 transition-all"
          >
            Save Changes
          </button>
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="w-full mt-6 bg-blue-brand text-white font-display font-bold py-4 rounded-3xl hover:bg-blue-dark active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span className="icon-o text-xl">edit</span>
          Edit Details
        </button>
      )}
    </BottomSheet>
  )
}

/* ─── Next of Kin modal ─────────────────────────────────── */
function NextOfKinModal({ open, onClose, user, onSave }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    kinName:         user?.kinName         || '',
    kinPhone:        user?.kinPhone        || '',
    kinRelationship: user?.kinRelationship || '',
  })

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSave = () => { onSave(form); setEditing(false) }
  const handleClose = () => { setEditing(false); onClose() }

  return (
    <BottomSheet open={open} onClose={handleClose} title="Next of Kin">
      <div className="bg-blue-light rounded-2xl px-4 py-3 flex gap-3 mb-5">
        <span className="icon text-blue-brand text-xl flex-shrink-0">info</span>
        <p className="text-xs text-blue-brand font-display">
          Required by Nigerian insurance regulations. This person will be contacted in case of an emergency.
        </p>
      </div>

      <Field label="Full Name"     value={form.kinName}         editing={editing} name="kinName"         onChange={handleChange} />
      <Field label="Phone Number"  value={form.kinPhone}        editing={editing} name="kinPhone"        type="tel" onChange={handleChange} />
      <Field label="Relationship"  value={form.kinRelationship} editing={editing} name="kinRelationship"
        options={['Spouse', 'Parent', 'Sibling', 'Child', 'Friend', 'Other']} onChange={handleChange} />

      {editing ? (
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setEditing(false)}
            className="flex-1 bg-ink-faint text-ink font-display font-bold py-4 rounded-3xl hover:bg-ink-border active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-brand text-white font-display font-bold py-4 rounded-3xl hover:bg-blue-dark active:scale-95 transition-all"
          >
            Save Changes
          </button>
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="w-full mt-6 bg-blue-brand text-white font-display font-bold py-4 rounded-3xl hover:bg-blue-dark active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span className="icon-o text-xl">edit</span>
          Edit Next of Kin
        </button>
      )}
    </BottomSheet>
  )
}

/* ─── Transaction History modal ─────────────────────────── */
const STATUS_STYLE = {
  success: 'bg-green-light text-green-brand',
  pending: 'bg-orange-light text-orange-brand',
  failed:  'bg-red-50 text-red-500',
}

function TransactionHistoryModal({ open, onClose, transactions }) {
  return (
    <BottomSheet open={open} onClose={onClose} title="Transaction History">
      {transactions.length === 0 ? (
        <div className="text-center py-10">
          <span className="icon-o text-ink-muted text-5xl">receipt_long</span>
          <p className="font-display font-semibold text-ink mt-3">No transactions yet</p>
          <p className="text-sm text-ink-muted mt-1">Your payment history will appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-0">
          {transactions.map((tx, i) => (
            <div
              key={tx.id || i}
              className="flex items-center justify-between py-4 border-b border-ink-border last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-light rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="icon text-green-brand text-xl">payments</span>
                </div>
                <div>
                  <p className="font-display font-semibold text-ink text-sm">
                    {tx.description || 'Wallet Top-up'}
                  </p>
                  <p className="text-xs text-ink-muted">
                    {tx.date ? new Date(tx.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-display font-bold text-ink text-sm">
                  +₦{Number(tx.amount).toLocaleString()}
                </p>
                <span className={`text-[10px] font-display font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[tx.status] || STATUS_STYLE.success}`}>
                  {tx.status || 'Success'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </BottomSheet>
  )
}

/* ─── Help & Support modal ──────────────────────────────── */
const FAQS = [
  {
    q: 'How does the wallet work?',
    a: 'Top up any amount at any time. Once your wallet reaches your plan\'s monthly price, coverage activates automatically.'
  },
  {
    q: 'What happens if my wallet runs out?',
    a: 'You get a 7-day grace period to top up before coverage pauses. Your plan and policy number are always kept safe.'
  },
  {
    q: 'How do I file a claim?',
    a: 'Go to the Claims tab, tap "New Claim", fill in your hospital details and amount, and submit. Claims are reviewed within 3 working days.'
  },
  {
    q: 'Which hospitals can I use?',
    a: 'Any registered partner hospital. Show your policy number at the reception. A full directory is coming soon in-app.'
  },
  {
    q: 'How does airtime deduction work?',
    a: 'We deduct 10%, 20%, or 50% of every airtime recharge and add it straight to your wallet. No bank card needed.'
  },
]

function HelpModal({ open, onClose }) {
  const [openFaq, setOpenFaq] = useState(null)
  const [copied, setCopied] = useState(false)

  const copyEmail = () => {
    navigator.clipboard.writeText('support@payg.ng')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Help & Support">

      {/* Contact strip */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <a
          href="tel:+2348001234567"
          className="bg-blue-light rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-blue-muted transition-colors"
        >
          <span className="icon text-blue-brand text-2xl">call</span>
          <p className="font-display font-bold text-blue-brand text-xs text-center">Call Us</p>
          <p className="font-display text-blue-brand text-[10px] text-center">0800 123 4567</p>
        </a>
        <button
          onClick={copyEmail}
          className="bg-ink-faint rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-ink-border transition-colors"
        >
          <span className="icon-o text-ink text-2xl">mail</span>
          <p className="font-display font-bold text-ink text-xs text-center">
            {copied ? 'Copied!' : 'Email Us'}
          </p>
          <p className="font-display text-ink-muted text-[10px] text-center">support@payg.ng</p>
        </button>
      </div>

      {/* FAQs */}
      <p className="font-display font-bold text-ink text-sm mb-3">Frequently Asked Questions</p>
      <div className="rounded-2xl border border-ink-border overflow-hidden">
        {FAQS.map((faq, i) => (
          <div key={i} className="border-b border-ink-border last:border-0">
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-ink-faint transition-colors"
            >
              <p className="font-display font-semibold text-ink text-sm pr-4">{faq.q}</p>
              <span className={`icon-o text-ink-muted text-xl flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>
            {openFaq === i && (
              <div className="px-4 pb-4">
                <p className="text-sm text-ink-muted leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Response time note */}
      <div className="mt-4 bg-orange-light rounded-2xl px-4 py-3 flex gap-3">
        <span className="icon text-orange-brand text-xl flex-shrink-0">schedule</span>
        <p className="text-xs text-orange-brand font-display">
          We typically respond within <strong>24 hours</strong> on business days (Mon–Fri, 8am–6pm WAT).
        </p>
      </div>
    </BottomSheet>
  )
}

/* ─── Main Profile page ─────────────────────────────────── */
export default function Profile() {
  const { user, subscription, transactions, logout, updateUser } = useApp()
  const navigate = useNavigate()

  const [showLogout,      setShowLogout]      = useState(false)
  const [showPersonal,    setShowPersonal]    = useState(false)
  const [showKin,         setShowKin]         = useState(false)
  const [showTxHistory,   setShowTxHistory]   = useState(false)
  const [showHelp,        setShowHelp]        = useState(false)
  const [copied,          setCopied]          = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  const copyPolicy = () => {
    navigator.clipboard.writeText(subscription.policyNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSavePersonal = (data) => {
    if (typeof updateUser === 'function') updateUser(data)
  }

  const handleSaveKin = (data) => {
    if (typeof updateUser === 'function') updateUser(data)
  }

  const menuItems = [
    {
      icon: 'person',
      label: 'Personal Details',
      sub: 'Name, DOB, gender',
      action: () => setShowPersonal(true),
      arrow: true,
    },
    {
      icon: 'family_restroom',
      label: 'Next of Kin',
      sub: 'Emergency contact',
      action: () => setShowKin(true),
      arrow: true,
    },
    {
      icon: 'shield',
      label: 'My Plan',
      sub: `${subscription.plan} — ₦${subscription.planPrice.toLocaleString()}/mo`,
      action: () => navigate('/plans'),
      arrow: true,
    },
    {
      icon: 'receipt_long',
      label: 'Transaction History',
      sub: `${(transactions || []).length} payment${(transactions || []).length !== 1 ? 's' : ''}`,
      action: () => setShowTxHistory(true),
      arrow: true,
    },
    {
      icon: 'notifications',
      label: 'Notifications',
      sub: 'SMS & in-app alerts',
      action: () => navigate('/notifications'),
      arrow: true,
    },
    {
      icon: 'help',
      label: 'Help & Support',
      sub: 'FAQs, contact us',
      action: () => setShowHelp(true),
      arrow: true,
    },
    {
      icon: 'description',
      label: 'Terms of Service',
      sub: null,
      action: () => navigate('/terms'),
      arrow: true,
    },
    {
      icon: 'privacy_tip',
      label: 'Privacy Policy',
      sub: null,
      action: () => navigate('/privacy'),
      arrow: true,
    },
  ]

  return (
    <AppLayout>
      <PageHeader title="Profile" back={false} />

      <div className="px-4 lg:px-8 pt-5 pb-28 lg:pb-10 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Left column ── */}
          <div className="flex flex-col gap-4">

            {/* Profile hero card */}
            <div className="bg-blue-brand rounded-3xl p-6 relative overflow-hidden fu">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="icon text-white text-3xl">person</span>
                </div>
                <div>
                  <h2 className="font-display font-extrabold text-white text-xl">
                    {user?.firstName ? `${user.firstName} ${user.lastName}` : 'PAYG User'}
                  </h2>
                  <p className="text-blue-muted text-sm font-display">{user?.phone || user?.email || '+234 — — — —'}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-brand ring" />
                    <span className="text-green-muted text-xs font-display font-bold">
                      {subscription.status === 'active' ? 'Active Member' : 'Member'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 bg-white/10 rounded-2xl px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-blue-muted text-[10px] font-display font-semibold">Policy Number</p>
                  <p className="text-white font-display font-bold text-sm tracking-wide">{subscription.policyNumber}</p>
                </div>
                <button onClick={copyPolicy} className="text-blue-muted hover:text-white transition-colors">
                  <span className="icon-o text-xl">{copied ? 'check_circle' : 'content_copy'}</span>
                </button>
              </div>
            </div>

            {/* Plan card */}
            <div className="bg-white rounded-3xl shadow-card p-5 fu fu1">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-display font-bold text-ink-muted uppercase tracking-wider">Current Plan</p>
                <button onClick={() => navigate('/plans')} className="text-xs text-blue-brand font-display font-bold hover:underline">Change</button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-light rounded-xl flex items-center justify-center">
                    <span className="icon text-blue-brand text-xl">health_and_safety</span>
                  </div>
                  <div>
                    <p className="font-display font-bold text-ink">{subscription.plan}</p>
                    <p className="text-xs text-ink-muted">₦{subscription.planPrice.toLocaleString()}/month</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-display font-bold ${
                  subscription.status === 'active' ? 'bg-green-light text-green-brand' : 'bg-orange-light text-orange-brand'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${subscription.status === 'active' ? 'bg-green-brand' : 'bg-orange-brand'}`} />
                  {subscription.status === 'active' ? 'Active' : 'Pending'}
                </div>
              </div>
            </div>

           

            <p className="text-center text-xs text-ink-muted font-display">PAYG v2.0.0 · © 2026 PayGo Technologies Ltd.</p>
          </div>

          {/* ── Right column ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            <div className="bg-white rounded-3xl shadow-card overflow-hidden fu fu2">
              {menuItems.map((item, i) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={`w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-ink-faint transition-colors cursor-pointer ${
                    i < menuItems.length - 1 ? 'border-b border-ink-border' : ''
                  }`}
                >
                  <div className="w-9 h-9 bg-ink-faint rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="icon-o text-ink-mid text-xl">{item.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-ink text-sm">{item.label}</p>
                    {item.sub && <p className="text-xs text-ink-muted truncate">{item.sub}</p>}
                  </div>
                  <span className="icon-o text-ink-muted text-xl">chevron_right</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowLogout(true)}
              className="w-full border-2 border-ink-border text-red-500 font-display font-semibold py-4 rounded-3xl hover:bg-red-50 hover:border-red-200 active:scale-95 transition-all flex items-center justify-center gap-2 fu fu3"
            >
              <span className="icon-o text-xl">logout</span>
              Sign Out
            </button>
          </div>

        </div>
      </div>

      {/* ── Modals ── */}
      <PersonalDetailsModal
        open={showPersonal}
        onClose={() => setShowPersonal(false)}
        user={user}
        onSave={handleSavePersonal}
      />

      <NextOfKinModal
        open={showKin}
        onClose={() => setShowKin(false)}
        user={user}
        onSave={handleSaveKin}
      />

      <TransactionHistoryModal
        open={showTxHistory}
        onClose={() => setShowTxHistory(false)}
        transactions={transactions || []}
      />

      <HelpModal
        open={showHelp}
        onClose={() => setShowHelp(false)}
      />

      {/* Logout modal */}
      {showLogout && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end lg:items-center justify-center p-0 lg:p-6"
          onClick={() => setShowLogout(false)}
        >
          <div
            className="bg-white w-full lg:max-w-sm rounded-t-4xl lg:rounded-3xl p-6 scale-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-ink-border rounded-full mx-auto mb-5 lg:hidden" />
            <h3 className="font-display font-extrabold text-xl text-ink text-center mb-2">Sign Out?</h3>
            <p className="text-sm text-ink-muted text-center mb-6">You'll need to verify your phone number to sign back in.</p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white font-display font-bold py-4 rounded-3xl mb-3 hover:bg-red-600 active:scale-95 transition-all"
            >
              Yes, Sign Out
            </button>
            <button
              onClick={() => setShowLogout(false)}
              className="w-full bg-ink-faint text-ink font-display font-bold py-4 rounded-3xl hover:bg-ink-border active:scale-95 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  )
}