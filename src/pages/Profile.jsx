import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import AppLayout from '../components/AppLayout.jsx'
import PageHeader from '../components/PageHeader.jsx'

export default function Profile() {
  const { user, subscription, logout } = useApp()
  const navigate = useNavigate()
  const [showLogout, setShowLogout] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  const menuItems = [
    { icon: 'person',         label: 'Personal Details',     sub: 'Name, DOB, gender',              path: null },
    { icon: 'family_restroom',label: 'Next of Kin',          sub: 'Emergency contact',               path: null },
    { icon: 'shield',         label: 'My Plan',              sub: `${subscription.plan} — ₦${subscription.planPrice.toLocaleString()}/mo`, path: '/plans' },
    { icon: 'receipt_long',   label: 'Transaction History',  sub: 'All payments',                    path: null },
    { icon: 'notifications',  label: 'Notifications',        sub: 'SMS & in-app alerts',             path: '/notifications' },
    { icon: 'help',           label: 'Help & Support',       sub: 'FAQs, contact us',                path: null },
    { icon: 'description',    label: 'Terms of Service',     sub: null,                              path: '/terms' },
    { icon: 'privacy_tip',    label: 'Privacy Policy',       sub: null,                              path: '/privacy' },
  ]

  return (
    <AppLayout>
      <PageHeader title="Profile" back={false}/>

      <div className="px-4 lg:px-8 pt-5 pb-28 lg:pb-10 max-w-5xl">

        {/* Desktop: 2-col / Mobile: stack */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left column: profile card + plan + NAICOM */}
          <div className="flex flex-col gap-4">

            {/* Profile hero card */}
            <div className="bg-blue-brand rounded-3xl p-6 relative overflow-hidden fu">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"/>
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
                    <span className="w-1.5 h-1.5 rounded-full bg-green-brand ring"/>
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
                <button className="text-blue-muted hover:text-white transition-colors">
                  <span className="icon-o text-xl">content_copy</span>
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
                  <span className={`w-1.5 h-1.5 rounded-full ${subscription.status === 'active' ? 'bg-green-brand' : 'bg-orange-brand'}`}/>
                  {subscription.status === 'active' ? 'Active' : 'Pending'}
                </div>
              </div>
            </div>

            {/* NAICOM */}
            <div className="bg-green-light border border-green-muted rounded-2xl p-4 flex gap-3 items-center fu fu2">
              <span className="icon text-green-brand text-2xl flex-shrink-0">verified</span>
              <div>
                <p className="font-display font-bold text-green-brand text-sm">Licensed by NAICOM</p>
                <p className="text-xs text-green-700">License No. IA/2024/001 · Regulated by CBN</p>
              </div>
            </div>

            <p className="text-center text-xs text-ink-muted font-display">PAYG v2.0.0 · © 2026 PayGo Technologies Ltd.</p>
          </div>

          {/* Right column: menu + logout */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            <div className="bg-white rounded-3xl shadow-card overflow-hidden fu fu2">
              {menuItems.map((item, i) => (
                <button key={item.label}
                  onClick={() => item.path && navigate(item.path)}
                  className={`w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-ink-faint transition-colors ${
                    i < menuItems.length - 1 ? 'border-b border-ink-border' : ''
                  } ${item.path ? 'cursor-pointer' : 'cursor-default opacity-60'}`}>
                  <div className="w-9 h-9 bg-ink-faint rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="icon-o text-ink-mid text-xl">{item.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-ink text-sm">{item.label}</p>
                    {item.sub && <p className="text-xs text-ink-muted truncate">{item.sub}</p>}
                  </div>
                  {item.path
                    ? <span className="icon-o text-ink-muted text-xl">chevron_right</span>
                    : <span className="text-[9px] bg-ink-faint text-ink-muted font-display font-bold px-1.5 py-0.5 rounded-full">Soon</span>
                  }
                </button>
              ))}
            </div>

            <button onClick={() => setShowLogout(true)}
              className="w-full border-2 border-ink-border text-red-500 font-display font-semibold py-4 rounded-3xl hover:bg-red-50 hover:border-red-200 active:scale-95 transition-all flex items-center justify-center gap-2 fu fu3">
              <span className="icon-o text-xl">logout</span>
              Sign Out
            </button>
          </div>

        </div>
      </div>

      {/* Logout modal */}
      {showLogout && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end lg:items-center justify-center p-0 lg:p-6"
          onClick={() => setShowLogout(false)}>
          <div className="bg-white w-full lg:max-w-sm rounded-t-4xl lg:rounded-3xl p-6 scale-in"
            onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-ink-border rounded-full mx-auto mb-5 lg:hidden"/>
            <h3 className="font-display font-extrabold text-xl text-ink text-center mb-2">Sign Out?</h3>
            <p className="text-sm text-ink-muted text-center mb-6">You'll need to verify your phone number to sign back in.</p>
            <button onClick={handleLogout}
              className="w-full bg-red-500 text-white font-display font-bold py-4 rounded-3xl mb-3 hover:bg-red-600 active:scale-95 transition-all">
              Yes, Sign Out
            </button>
            <button onClick={() => setShowLogout(false)}
              className="w-full bg-ink-faint text-ink font-display font-bold py-4 rounded-3xl hover:bg-ink-border active:scale-95 transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
