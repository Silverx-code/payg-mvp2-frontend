import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import AppLayout from '../components/AppLayout.jsx'

// ---------------- COMPONENTS ----------------
function CoverageBar({ wallet, price }) {
  const pct = price > 0 ? Math.min((wallet / price) * 100, 100) : 0

  return (
    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
      <div
        className="h-full bg-white rounded-full transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
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
    <span className={`text-xs font-display font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${cfg[status] || cfg.inactive}`}>
      <span
        className={`w-2 h-2 rounded-full ${
          status === 'active'
            ? 'bg-green-brand'
            : status === 'pending'
            ? 'bg-orange-brand'
            : 'bg-ink-muted'
        }`}
      />
      {status === 'active' ? 'Active' : status === 'pending' ? 'Pending' : 'Inactive'}
    </span>
  )
}

// ---------------- MAIN ----------------
export default function Dashboard() {
  const navigate = useNavigate()
  const { user, subscription, transactions, notifications } = useApp()

  // ---- SAFE CALCULATIONS ----
  const wallet = Number(subscription.walletBalance || 0)
  const price = Number(subscription.planPrice || 0)

  const remaining = Math.max(0, price - wallet)
  const pct = price > 0 ? Math.min((wallet / price) * 100, 100) : 0
  const unread = notifications.filter(n => !n.read).length

  // ---- DAYS LEFT ----
  const daysLeft = subscription.coverageUntil
    ? Math.max(
        0,
        Math.ceil(
          (new Date(subscription.coverageUntil).getTime() - Date.now()) /
            86400000
        )
      )
    : 0

  // ---- FORMAT DATE ----
  const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'short',
    })
  }

  return (
    <AppLayout>
      <div className="text-base md:text-lg">

        {/* HEADER */}
        <div className="bg-white px-5 lg:px-8 pt-12 lg:pt-8 pb-5 border-b border-ink-border sticky top-0 z-30">
          <div className="flex items-center justify-between max-w-5xl">
            <div>
              <p className="text-sm text-ink-muted font-display mb-1">Good day 👋</p>
              <h1 className="font-display font-extrabold text-3xl lg:text-4xl text-ink">
                {user?.firstName
                  ? `${user.firstName} ${user.lastName || ''}`
                  : 'Welcome back'}
              </h1>
            </div>

            <button
              onClick={() => navigate('/notifications')}
              className="relative w-11 h-11 bg-ink-faint rounded-2xl flex items-center justify-center hover:bg-ink-border transition-colors"
            >
              <span className="icon-o text-ink text-2xl">notifications</span>

              {unread > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-brand rounded-full text-white text-xs font-display font-bold flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="px-4 lg:px-8 pt-6 pb-28 lg:pb-10 max-w-5xl">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* WALLET */}
            <div className="lg:col-span-2 bg-blue-brand rounded-3xl p-7 relative overflow-hidden">

              <div className="flex items-start justify-between mb-5 relative z-10">
                <div>
                  <p className="text-sm text-blue-muted font-display font-semibold mb-1">
                    Insurance Wallet
                  </p>

                  <p className="font-display font-black text-white text-5xl lg:text-6xl">
                    ₦{wallet.toLocaleString()}
                  </p>

                  <p className="text-sm text-blue-muted font-display mt-1">
                    of ₦{price.toLocaleString()} monthly target
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs font-display text-blue-muted mb-1">Policy</p>
                  <p className="text-white font-display font-bold text-base">
                    {subscription.policyNumber}
                  </p>
                  <div className="mt-2">
                    <StatusBadge status={subscription.status} />
                  </div>
                </div>
              </div>

              <CoverageBar wallet={wallet} price={price} />

              <div className="flex justify-between mt-3">
                {remaining > 0 ? (
                  <p className="text-sm text-blue-muted font-display">
                    ₦{remaining.toLocaleString()} more to fully fund coverage
                  </p>
                ) : (
                  <p className="text-sm text-blue-muted font-display">
                    🎉 Fully funded for this month!
                  </p>
                )}
                <p className="text-sm text-blue-muted font-display">
                  {pct.toFixed(0)}%
                </p>
              </div>
            </div>

            {/* PLAN */}
            <div className="bg-white rounded-3xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-display font-bold text-ink-muted uppercase tracking-wider">
                  Current Plan
                </p>
                <button
                  onClick={() => navigate('/plans')}
                  className="text-sm font-display font-bold text-blue-brand hover:underline"
                >
                  Change
                </button>
              </div>

              <p className="font-display font-extrabold text-ink text-xl mb-2">
                {subscription.plan}
              </p>
              <p className="text-sm text-ink-muted mb-4">
                ₦{price.toLocaleString()} / month
              </p>

              {daysLeft > 0 && (
                <p className="text-sm font-display text-ink">
                  Coverage active for <b>{daysLeft} days</b>
                </p>
              )}
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-white rounded-3xl p-6 shadow-card">
              <p className="text-xs font-display font-bold text-ink-muted uppercase tracking-wider mb-4">
                Quick Actions
              </p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Top Up', path: '/payment' },
                  { label: 'File Claim', path: '/claims' },
                  { label: 'My Plans', path: '/plans' },
                  { label: 'Profile', path: '/profile' },
                ].map(a => (
                  <button
                    key={a.path}
                    onClick={() => navigate(a.path)}
                    className="p-3 rounded-2xl bg-ink-faint hover:bg-ink-border transition"
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* TRANSACTIONS */}
            <div className="bg-white rounded-3xl shadow-card overflow-hidden">
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <p className="text-xs font-display font-bold text-ink-muted uppercase tracking-wider">
                  Recent Payments
                </p>
                <button
                  onClick={() => navigate('/payment')}
                  className="text-sm font-display font-bold text-blue-brand hover:underline"
                >
                  View all
                </button>
              </div>

              {transactions.length === 0 ? (
                <p className="px-6 pb-6 text-sm text-ink-muted">
                  No transactions yet
                </p>
              ) : (
                transactions.slice(0, 3).map(tx => (
                  <div
                    key={tx.id}
                    className="flex items-center gap-3 px-6 py-4 border-b border-ink-border"
                  >
                    <div className="flex-1">
                      <p className="font-display font-semibold text-ink text-base">
                        {tx.type}
                      </p>
                      <p className="text-xs text-ink-muted">
                        {formatDate(tx.date)}
                      </p>
                    </div>

                    <span className="font-display font-bold text-green-brand text-base">
                      +₦{Number(tx.amount).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  )
}