import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import AppLayout from '../components/AppLayout.jsx'


function CoverageBar({ wallet, price }) {
  const pct = Math.min((wallet / price) * 100, 100)
  return (
    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
      <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
    </div>
  )
}

function StatusBadge({ status }) {
  const cfg = {
    active: 'bg-green-light text-green-brand',
    pending: 'bg-orange-light text-orange-brand',
    inactive: 'bg-ink-faint text-ink-muted',
  }
  return (
    <span className={`text-[10px] font-display font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${cfg[status] || cfg.inactive}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-green-brand' : status === 'pending' ? 'bg-orange-brand' : 'bg-ink-muted'}`} />
      {status === 'active' ? 'Active' : status === 'pending' ? 'Pending' : 'Inactive'}
    </span>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, subscription, transactions, notifications, claims } = useApp()
  const remaining = Math.max(0, subscription.planPrice - subscription.walletBalance)
  const pct = Math.min((subscription.walletBalance / subscription.planPrice) * 100, 100)
  const unread = notifications.filter(n => !n.read).length

  const daysLeft = subscription.coverageUntil
    ? Math.max(0, Math.ceil((new Date(subscription.coverageUntil) - Date.now()) / 86400000))
    : 0

  return (
    <AppLayout>
      {/* Header */}
      <div className="bg-white px-5 lg:px-8 pt-12 lg:pt-8 pb-5 border-b border-ink-border sticky top-0 z-30">
        <div className="flex items-center justify-between max-w-5xl">
          <div>
            <p className="text-xs text-ink-muted font-display mb-0.5">Good day 👋</p>
            <h1 className="font-display font-extrabold text-2xl lg:text-3xl text-ink">
              {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Welcome back'}
            </h1>
          </div>
          <button onClick={() => navigate('/notifications')} className="relative w-10 h-10 bg-ink-faint rounded-2xl flex items-center justify-center hover:bg-ink-border transition-colors">
            <span className="icon-o text-ink text-xl">notifications</span>
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-brand rounded-full text-white text-[9px] font-display font-bold flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="px-4 lg:px-8 pt-5 pb-28 lg:pb-10 max-w-5xl">

        {/* ── DESKTOP: 2-col grid / MOBILE: stack ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Hero wallet card */}
          <div className="lg:col-span-2 bg-blue-brand rounded-3xl p-6 relative overflow-hidden fu">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

            <div className="flex items-start justify-between mb-4 relative z-10">
              <div>
                <p className="text-blue-muted text-xs font-display font-semibold mb-1">Insurance Wallet</p>
                <p className="font-display font-black text-white text-4xl lg:text-5xl">
                  ₦{subscription.walletBalance.toLocaleString()}
                </p>
                <p className="text-blue-muted text-xs font-display mt-1">of ₦{subscription.planPrice.toLocaleString()} monthly target</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-display text-blue-muted mb-1">Policy</p>
                <p className="text-white font-display font-bold text-sm">{subscription.policyNumber}</p>
                <div className="mt-2">
                  <StatusBadge status={subscription.status} />
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <CoverageBar wallet={subscription.walletBalance} price={subscription.planPrice} />
              <div className="flex justify-between mt-2">
                {remaining > 0
                  ? <p className="text-blue-muted text-xs font-display">₦{remaining.toLocaleString()} more to fully fund coverage</p>
                  : <p className="text-blue-muted text-xs font-display">🎉 Fully funded for this month!</p>
                }
                <p className="text-blue-muted text-xs font-display">{pct.toFixed(0)}%</p>
              </div>
            </div>
          </div>

          {/* Plan card */}
          <div className="bg-white rounded-3xl p-5 shadow-card fu fu1">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-display font-bold text-ink-muted uppercase tracking-wider">Current Plan</p>
              <button onClick={() => navigate('/plans')} className="text-xs font-display font-bold text-blue-brand hover:underline">Change</button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-light rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="icon text-blue-brand text-2xl">health_and_safety</span>
              </div>
              <div>
                <p className="font-display font-extrabold text-ink text-lg">{subscription.plan}</p>
                <p className="text-xs text-ink-muted">₦{subscription.planPrice.toLocaleString()} / month</p>
              </div>
            </div>
            {daysLeft > 0 && (
              <div className="bg-ink-faint rounded-2xl p-3 flex items-center gap-2">
                <span className={`icon text-base ${daysLeft < 7 ? 'text-orange-brand' : 'text-green-brand'}`}>
                  {daysLeft < 7 ? 'warning' : 'event_available'}
                </span>
                <p className="text-xs font-display text-ink">
                  Coverage {daysLeft < 7 ? <span className="font-bold text-orange-brand">expires in {daysLeft}d</span> : <span>active for <span className="font-bold">{daysLeft} days</span></span>}
                </p>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-3xl p-5 shadow-card fu fu1">
            <p className="text-[10px] font-display font-bold text-ink-muted uppercase tracking-wider mb-3">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Top Up', icon: 'add_card', path: '/payment', color: 'bg-blue-light text-blue-brand' },
                { label: 'File Claim', icon: 'receipt_long', path: '/claims', color: 'bg-orange-light text-orange-brand' },
                { label: 'My Plans', icon: 'shield', path: '/plans', color: 'bg-green-light text-green-brand' },
                { label: 'Profile', icon: 'person', path: '/profile', color: 'bg-ink-faint text-ink-mid' },
              ].map(a => (
                <button key={a.path} onClick={() => navigate(a.path)}
                  className="flex items-center gap-2.5 p-3 rounded-2xl hover:bg-ink-faint transition-colors group">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${a.color}`}>
                    <span className="icon-o text-lg">{a.icon}</span>
                  </div>
                  <span className="font-display font-semibold text-sm text-ink">{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent transactions */}
          <div className="bg-white rounded-3xl shadow-card overflow-hidden fu fu2">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <p className="text-[10px] font-display font-bold text-ink-muted uppercase tracking-wider">Recent Payments</p>
              <button onClick={() => navigate('/payment')} className="text-xs font-display font-bold text-blue-brand hover:underline">View all</button>
            </div>
            <div>
              {/* Transactions come from AppContext */}
              {[
                { id: 't1', amount: 500, date: '2026-03-20T10:30:00Z', status: 'success', reference: 'payg_ref_001' },
                { id: 't2', amount: 200, date: '2026-03-25T14:15:00Z', status: 'success', reference: 'payg_ref_002' },
                { id: 't3', amount: 150, date: '2026-03-28T09:00:00Z', status: 'success', reference: 'payg_ref_003' },
              ].map((tx, i, arr) => (
                <div key={tx.id} className={`flex items-center gap-3 px-5 py-3.5 ${i < arr.length - 1 ? 'border-b border-ink-border' : ''}`}>
                  <div className="w-9 h-9 bg-green-light rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="icon text-green-brand text-lg">payments</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-ink text-sm">Wallet Top Up</p>
                    <p className="text-[10px] text-ink-muted">{new Date(tx.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</p>
                  </div>
                  <span className="font-display font-bold text-green-brand text-sm">+₦{tx.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Claims summary */}
          <div className="bg-white rounded-3xl shadow-card overflow-hidden fu fu2">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <p className="text-[10px] font-display font-bold text-ink-muted uppercase tracking-wider">Recent Claims</p>
              <button onClick={() => navigate('/claims')} className="text-xs font-display font-bold text-blue-brand hover:underline">View all</button>
            </div>
            {claims.length === 0 ? (
              <div className="px-5 pb-5 text-center">
                <span className="icon text-3xl text-ink-border block mb-2">receipt_long</span>
                <p className="text-sm text-ink-muted font-display">No claims yet</p>
              </div>
            ) : (
              claims.slice(0, 3).map((c, i, arr) => {
                const statusCfg = {
                  submitted: 'bg-blue-light text-blue-brand',
                  under_review: 'bg-orange-light text-orange-brand',
                  approved: 'bg-green-light text-green-brand',
                  rejected: 'bg-red-50 text-red-500',
                  paid: 'bg-green-light text-green-brand',
                }
                return (
                  <div key={c.id || c.ref} className={`flex items-center gap-3 px-5 py-3.5 ${i < arr.length - 1 ? 'border-b border-ink-border' : ''}`}>
                    <div className="w-9 h-9 bg-orange-light rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="icon text-orange-brand text-lg">receipt_long</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-ink text-sm truncate">{c.type}</p>
                      <p className="text-[10px] text-ink-muted">{c.ref}</p>
                    </div>
                    <span className={`text-[9px] font-display font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${statusCfg[c.status] || 'bg-ink-faint text-ink-muted'}`}>
                      {c.status?.replace('_', ' ')}
                    </span>
                  </div>
                )
              })
            )}
          </div>

        </div>

        {/* NAICOM badge */}
        <div className="mt-4 bg-green-light border border-green-muted rounded-2xl p-4 flex gap-3 items-center fu fu3">
          <span className="icon text-green-brand text-2xl flex-shrink-0">verified</span>
          <div>
            <p className="font-display font-bold text-green-brand text-sm">Licensed by NAICOM</p>
            <p className="text-xs text-green-700">License No. IA/2024/001 · Regulated by CBN</p>
          </div>
        </div>

      </div>
    </AppLayout>
  )
}
