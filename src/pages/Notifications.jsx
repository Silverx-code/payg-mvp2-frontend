import { useApp } from '../context/AppContext.jsx'
import AppLayout from '../components/AppLayout.jsx'
import PageHeader from '../components/PageHeader.jsx'

const TYPE_CONFIG = {
  payment: { icon: 'payments',      bg: 'bg-green-light',  color: 'text-green-brand' },
  coverage: { icon: 'shield',        bg: 'bg-blue-light',   color: 'text-blue-brand' },
  claim:    { icon: 'receipt_long',  bg: 'bg-orange-light', color: 'text-orange-brand' },
  alert:    { icon: 'warning',       bg: 'bg-red-50',       color: 'text-red-500' },
  info:     { icon: 'info',          bg: 'bg-ink-faint',    color: 'text-ink-muted' },
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso)
  const mins = Math.floor(diff / 60000)
  const hrs = Math.floor(mins / 60)
  const days = Math.floor(hrs / 24)
  if (days > 0) return `${days}d ago`
  if (hrs > 0) return `${hrs}h ago`
  if (mins > 0) return `${mins}m ago`
  return 'Just now'
}

function NotifItem({ n, onRead, showDot }) {
  const t = TYPE_CONFIG[n.type] || TYPE_CONFIG.info
  return (
    <button onClick={() => onRead(n.id)}
      className={`w-full flex items-start gap-3 px-4 lg:px-5 py-4 text-left hover:bg-ink-faint transition-colors ${!n.read ? 'bg-blue-light/30' : ''}`}>
      <div className={`w-10 h-10 rounded-2xl ${t.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
        <span className={`icon text-xl ${t.color}`}>{t.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <p className="font-display font-bold text-ink text-sm">{n.title}</p>
          {showDot && <span className="w-2 h-2 rounded-full bg-blue-brand flex-shrink-0"/>}
        </div>
        <p className="text-xs text-ink-muted leading-relaxed mb-1">{n.body}</p>
        <p className="text-[10px] text-ink-muted font-display">{timeAgo(n.time || n.createdAt)}</p>
      </div>
    </button>
  )
}

export default function Notifications() {
  const { notifications, markRead, markAllRead, unreadCount } = useApp()

  const unread = notifications.filter(n => !n.read)
  const read = notifications.filter(n => n.read)

  return (
    <AppLayout>
      <PageHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
        right={
          unreadCount > 0 && (
            <button onClick={markAllRead}
              className="text-xs font-display font-bold text-blue-brand hover:underline">
              Mark all read
            </button>
          )
        }
      />

      <div className="px-4 lg:px-8 pt-5 pb-28 lg:pb-10 max-w-5xl">

        {notifications.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-card p-16 text-center mt-4">
            <span className="icon text-5xl text-ink-border mb-4 block">notifications</span>
            <h3 className="font-display font-bold text-ink text-lg mb-2">No notifications yet</h3>
            <p className="text-sm text-ink-muted leading-relaxed max-w-xs mx-auto">
              Payment confirmations, coverage alerts and claim updates will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

            {/* Unread */}
            {unread.length > 0 && (
              <div className="lg:col-span-2">
                <p className="text-[10px] font-display font-bold text-ink-muted uppercase tracking-wider mb-2 px-1">New</p>
                <div className="bg-white rounded-3xl shadow-card overflow-hidden divide-y divide-ink-border">
                  {unread.map(n => <NotifItem key={n.id} n={n} onRead={markRead} showDot={true} />)}
                </div>
              </div>
            )}

            {/* Read — shown in 2 columns on desktop if no unread, 1-col otherwise */}
            {read.length > 0 && (
              <div className={unread.length === 0 ? 'lg:col-span-2' : 'lg:col-span-2'}>
                <p className="text-[10px] font-display font-bold text-ink-muted uppercase tracking-wider mb-2 px-1">Earlier</p>
                <div className={`grid grid-cols-1 ${unread.length === 0 ? 'lg:grid-cols-2' : ''} gap-0 lg:gap-4`}>
                  {unread.length === 0
                    ? read.map(n => (
                        <div key={n.id} className="bg-white rounded-3xl shadow-card overflow-hidden">
                          <div className="opacity-60">
                            <NotifItem n={n} onRead={() => {}} showDot={false} />
                          </div>
                        </div>
                      ))
                    : (
                        <div className="bg-white rounded-3xl shadow-card overflow-hidden divide-y divide-ink-border opacity-70">
                          {read.map(n => <NotifItem key={n.id} n={n} onRead={() => {}} showDot={false} />)}
                        </div>
                      )
                  }
                </div>
              </div>
            )}
          </div>
        )}

        {/* SMS notice */}
        <div className="mt-5 bg-blue-light border border-blue-muted rounded-2xl p-4 flex gap-3 items-start">
          <span className="icon text-blue-brand text-xl flex-shrink-0">sms</span>
          <div>
            <p className="text-xs font-display font-bold text-blue-brand mb-0.5">SMS Alerts Active</p>
            <p className="text-xs text-blue-700 leading-relaxed">
              Payment confirmations and coverage alerts are also sent to your registered phone via SMS.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
