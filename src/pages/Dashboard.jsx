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
    <span className={`text-xs font-display font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${cfg[status] || cfg.inactive}`}>
      <span className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-green-brand' : status === 'pending' ? 'bg-orange-brand' : 'bg-ink-muted'}`} />
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
      <div className="text-base md:text-lg">

        {/* Header */}
        <div className="bg-white px-5 lg:px-8 pt-12 lg:pt-8 pb-5 border-b border-ink-border sticky top-0 z-30">
          <div className="flex items-center justify-between max-w-5xl">
            <div>
              <p className="text-sm text-ink-muted font-display mb-1">Good day 👋</p>
              <h1 className="font-display font-extrabold text-3xl lg:text-4xl text-ink">
                {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Welcome back'}
              </h1>
            </div>

            <button onClick={() => navigate('/notifications')} className="relative w-11 h-11 bg-ink-faint rounded-2xl flex items-center justify-center hover:bg-ink-border transition-colors">
              <span className="icon-o text-ink text-2xl">notifications</span>
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-brand rounded-full text-white text-xs font-display font-bold flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="px-4 lg:px-8 pt-6 pb-28 lg:pb-10 max-w-5xl">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Wallet */}
            <div className="lg:col-span-2 bg-blue-brand rounded-3xl p-7 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

              <div className="flex items-start justify-between mb-5 relative z-10">
                <div>
                  <p className="text-sm text-blue-muted font-display font-semibold mb-1">Insurance Wallet</p>
                  <p className="font-display font-black text-white text-5xl lg:text-6xl">
                    ₦{subscription.walletBalance.toLocaleString()}
                  </p>
                  <p className="text-sm text-blue-muted font-display mt-1">
                    of ₦{subscription.planPrice.toLocaleString()} monthly target
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs font-display text-blue-muted mb-1">Policy</p>
                  <p className="text-white font-display font-bold text-base">{subscription.policyNumber}</p>
                  <div className="mt-2">
                    <StatusBadge status={subscription.status} />
                  </div>
                </div>
              </div>

              <CoverageBar wallet={subscription.walletBalance} price={subscription.planPrice} />

              <div className="flex justify-between mt-3">
                {remaining > 0
                  ? <p className="text-sm text-blue-muted font-display">₦{remaining.toLocaleString()} more to fully fund coverage</p>
                  : <p className="text-sm text-blue-muted font-display">🎉 Fully funded for this month!</p>
                }
                <p className="text-sm text-blue-muted font-display">{pct.toFixed(0)}%</p>
              </div>
            </div>

            {/* Plan */}
            <div className="bg-white rounded-3xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-display font-bold text-ink-muted uppercase tracking-wider">Current Plan</p>
                <button onClick={() => navigate('/plans')} className="text-sm font-display font-bold text-blue-brand hover:underline">
                  Change
                </button>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-blue-light rounded-2xl flex items-center justify-center">
                  <span className="icon text-blue-brand text-3xl">health_and_safety</span>
                </div>
                <div>
                  <p className="font-display font-extrabold text-ink text-xl">{subscription.plan}</p>
                  <p className="text-sm text-ink-muted">₦{subscription.planPrice.toLocaleString()} / month</p>
                </div>
              </div>

              {daysLeft > 0 && (
                <div className="bg-ink-faint rounded-2xl p-4 flex items-center gap-3">
                  <span className={`icon text-lg ${daysLeft < 7 ? 'text-orange-brand' : 'text-green-brand'}`}>
                    {daysLeft < 7 ? 'warning' : 'event_available'}
                  </span>
                  <p className="text-sm font-display text-ink">
                    Coverage {daysLeft < 7
                      ? <span className="font-bold text-orange-brand">expires in {daysLeft}d</span>
                      : <span>active for <span className="font-bold">{daysLeft} days</span></span>}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl p-6 shadow-card">
              <p className="text-xs font-display font-bold text-ink-muted uppercase tracking-wider mb-4">Quick Actions</p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Top Up', icon: 'add_card', path: '/payment', color: 'bg-blue-light text-blue-brand' },
                  { label: 'File Claim', icon: 'receipt_long', path: '/claims', color: 'bg-orange-light text-orange-brand' },
                  { label: 'My Plans', icon: 'shield', path: '/plans', color: 'bg-green-light text-green-brand' },
                  { label: 'Profile', icon: 'person', path: '/profile', color: 'bg-ink-faint text-ink-mid' },
                ].map(a => (
                  <button key={a.path}
                    onClick={() => navigate(a.path)}
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-ink-faint transition-colors">
                    
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.color}`}>
                      <span className="icon-o text-xl">{a.icon}</span>
                    </div>

                    <span className="font-display font-semibold text-base text-ink">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Transactions */}
            <div className="bg-white rounded-3xl shadow-card overflow-hidden">
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <p className="text-xs font-display font-bold text-ink-muted uppercase tracking-wider">Recent Payments</p>
                <button onClick={() => navigate('/payment')} className="text-sm font-display font-bold text-blue-brand hover:underline">
                  View all
                </button>
              </div>

              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-6 py-4 border-b border-ink-border">
                  <div className="w-10 h-10 bg-green-light rounded-xl flex items-center justify-center">
                    <span className="icon text-green-brand text-xl">payments</span>
                  </div>

                  <div className="flex-1">
                    <p className="font-display font-semibold text-ink text-base">Wallet Top Up</p>
                    <p className="text-xs text-ink-muted">20 Mar</p>
                  </div>

                  <span className="font-display font-bold text-green-brand text-base">+₦500</span>
                </div>
              ))}
            </div>

          </div>
          
        </div>
      </div>
    </AppLayout>
  )
}