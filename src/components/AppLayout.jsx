import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import logo from '../assets/logo.png'

/* ─── Shared Tabs (single source of truth) ─────────────────────────────── */
const tabs = [
  { path: '/dashboard', icon: 'grid_view', label: 'Home' },
  { path: '/plans',     icon: 'shield',    label: 'Plans' },
  { path: '/payment',   icon: 'add_card',  label: 'Pay' },
  { path: '/claims',    icon: 'receipt_long', label: 'Claims' },
  { path: '/profile',   icon: 'person',    label: 'Profile' },
]

/* ─── Shared helper ─────────────────────────────────────────────────────── */
const isActive = (pathname, path) =>
  pathname === path || pathname.startsWith(path + '/')

/* ───────────────── MOBILE BOTTOM NAV ──────────────────────────────────── */
export function BottomNav() {
  const { pathname } = useLocation()
  const { unreadCount } = useApp()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-ink-border safe-bottom">
      <div className="flex justify-around items-center px-1 pt-2 pb-3">
        {tabs.map(t => {
          const active = isActive(pathname, t.path)

          return (
            <Link
              key={t.path}
              to={t.path}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-2xl transition-all ${
                active ? 'text-blue-brand' : 'text-ink-muted'
              }`}
            >
              {/* Badge */}
              {t.path === '/dashboard' && unreadCount > 0 && (
                <span className="absolute -top-0.5 right-1 w-4 h-4 bg-orange-brand rounded-full text-white text-[9px] font-display font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}

              <span className={`text-[22px] ${active ? 'icon' : 'icon-o'}`}>
                {t.icon}
              </span>

              <span className={`text-[10px] font-display font-semibold ${
                active ? 'text-blue-brand' : 'text-ink-muted'
              }`}>
                {t.label}
              </span>

              {active && (
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-blue-brand rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

/* ───────────────── DESKTOP SIDEBAR ────────────────────────────────────── */
export function Sidebar() {
  const { pathname } = useLocation()
  const { unreadCount, subscription } = useApp()

  return (
    <aside className="hidden md:flex flex-col w-20 lg:w-64 min-h-screen bg-white border-r border-ink-border fixed left-0 top-0 bottom-0 z-40">

      {/* Logo */}
      <div className="px-6 pt-8 pb-6 border-b border-ink-border">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-6 h-6 object-contain" />
          <div className="hidden lg:block">
            <span className="font-display font-extrabold text-xl text-ink">PAYG</span>
            <p className="text-[10px] text-ink-muted">Insurance Platform</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {tabs.map(t => {
          const active = isActive(pathname, t.path)

          return (
            <Link
              key={t.path}
              to={t.path}
              className={`relative flex items-center gap-3 px-3 py-3 rounded-2xl transition-all ${
                active
                  ? 'bg-blue-light text-blue-brand'
                  : 'text-ink-muted hover:bg-ink-faint hover:text-ink'
              }`}
            >
              {/* Badge */}
              {t.path === '/dashboard' && unreadCount > 0 && (
                <span className="absolute top-2 left-8 w-4 h-4 bg-orange-brand rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}

              <span className={`text-2xl flex-shrink-0 ${active ? 'icon' : 'icon-o'}`}>
                {t.icon}
              </span>

              <span className={`font-display font-semibold text-sm hidden lg:block ${
                active ? 'text-blue-brand' : ''
              }`}>
                {t.label}
              </span>

              {active && (
                <span className="ml-auto w-1.5 h-6 bg-blue-brand rounded-full hidden lg:block" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Plan summary */}
      <div className="px-4 pb-6 hidden lg:block">
        <div className="bg-ink-faint rounded-2xl p-4">
          <p className="text-[10px] font-bold text-ink-muted uppercase mb-2">
            Current Plan
          </p>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-sm text-ink">
                {subscription?.plan || 'Standard'}
              </p>
              <p className="text-[10px] text-ink-muted">
                ₦{(subscription?.planPrice || 1000).toLocaleString()}/mo
              </p>
            </div>

            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
              subscription?.status === 'active'
                ? 'bg-green-light text-green-brand'
                : 'bg-orange-light text-orange-brand'
            }`}>
              {subscription?.status === 'active' ? 'Active' : 'Pending'}
            </span>
          </div>
        </div>

        <p className="text-center text-[10px] text-ink-muted mt-3">
          PAYG v2.0.0
        </p>
      </div>
    </aside>
  )
}

/* ───────────────── APP LAYOUT WRAPPER ─────────────────────────────────── */
export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-ink-faint">
      <Sidebar />

      {/* Main content shifts when sidebar is visible */}
      <div className="md:ml-20 lg:ml-64 min-h-screen">
        {children}
      </div>

      <BottomNav />
    </div>
  )
}