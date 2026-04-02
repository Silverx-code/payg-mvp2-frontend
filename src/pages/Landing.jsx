import { useNavigate, Link } from 'react-router-dom'
import logo from '../assets/logo.png' // ✅ ADD THIS

export default function Landing() {
  const navigate = useNavigate()

  const features = [
    { icon: 'payments', title: 'Pay-As-You-Go', desc: 'Top up your wallet any amount, any time. No fixed premiums.' },
    { icon: 'health_and_safety', title: 'Instant Coverage', desc: 'Activate your plan the moment your wallet is funded.' },
    { icon: 'receipt_long', title: 'Easy Claims', desc: 'Submit claims in seconds. Get paid in 3–5 business days.' },
    { icon: 'sms', title: 'SMS Alerts', desc: 'Real-time SMS notifications for every payment and update.' },
  ]

  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="flex items-center justify-between px-5 lg:px-12 py-5 border-b border-ink-border">
        <div className="flex items-center gap-3">

          {/* ✅ UPDATED LOGO */}
          <div className="w-9 h-9 rounded-xl bg-blue-brand flex items-center justify-center shadow-blue overflow-hidden">
            <img 
              src={logo} 
              alt="PAYG Logo" 
              className="w-6 h-6 object-contain"
            />
          </div>

          <span className="font-display font-extrabold text-xl text-ink">PAYG</span>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/privacy" className="hidden lg:block text-sm font-display text-ink-muted hover:text-ink transition-colors">Privacy</Link>
          <button onClick={() => navigate('/auth')}
            className="bg-blue-brand text-white font-display font-bold px-5 py-2.5 rounded-2xl text-sm hover:bg-blue-dark transition-colors shadow-blue">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="px-5 lg:px-12 pt-14 lg:pt-20 pb-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div>
            <div className="inline-flex items-center gap-2 bg-green-light border border-green-muted rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-brand animate-pulse"/>
              <p className="text-xs font-display font-bold text-green-brand">Licensed by NAICOM · Nigeria</p>
            </div>

            <h1 className="font-display font-black text-4xl lg:text-5xl xl:text-6xl text-ink leading-tight mb-5">
              Health insurance<br/>
              <span className="text-blue-brand">without the lock-in</span>
            </h1>

            <p className="text-ink-muted text-lg leading-relaxed mb-8 max-w-lg">
              Pay for coverage exactly when you need it. Top up your wallet, activate your plan, and stay protected — no annual contracts.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => navigate('/auth')}
                className="bg-blue-brand text-white font-display font-bold px-8 py-4 rounded-3xl text-base hover:bg-blue-dark active:scale-95 transition-all shadow-blue flex items-center justify-center gap-2">
                <span className="icon-o text-xl">rocket_launch</span>
                Start for Free
              </button>
              <button onClick={() => navigate('/plans')}
                className="border-2 border-ink-border text-ink font-display font-bold px-8 py-4 rounded-3xl text-base hover:border-blue-brand hover:text-blue-brand transition-all flex items-center justify-center gap-2">
                <span className="icon-o text-xl">shield</span>
                View Plans
              </button>
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              {[['lock', 'SSL Encrypted'], ['verified_user', 'PCI-DSS'], ['support_agent', '24/7 Support'], ['verified', 'NAICOM Licensed']].map(([ic, lb]) => (
                <div key={lb} className="flex items-center gap-1.5 text-xs text-ink-muted font-display">
                  <span className="icon-o text-sm text-ink-mid">{ic}</span>{lb}
                </div>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-light to-transparent rounded-3xl -z-10"/>
            <div className="flex flex-col gap-3 p-6">
              {[
                { name: 'Basic', price: '₦500', icon: 'local_hospital', bg: 'bg-blue-light', ic: 'text-blue-brand', tag: null },
                { name: 'Standard', price: '₦1,000', icon: 'health_and_safety', bg: 'bg-blue-brand', ic: 'text-white', tag: 'Most Popular' },
                { name: 'Premium', price: '₦2,000', icon: 'workspace_premium', bg: 'bg-amber-50', ic: 'text-amber-600', tag: null },
              ].map((p, i) => (
                <div key={p.name}
                  className={`bg-white rounded-2xl p-4 flex items-center gap-4 shadow-card transition-all ${i === 1 ? 'scale-[1.03] ring-2 ring-blue-brand/30' : ''}`}>
                  <div className={`w-11 h-11 rounded-xl ${p.bg} flex items-center justify-center flex-shrink-0`}>
                    <span className={`icon text-2xl ${p.ic}`}>{p.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-extrabold text-ink">{p.name}</span>
                      {p.tag && <span className="text-[9px] bg-orange-brand text-white font-display font-bold px-1.5 py-0.5 rounded-full">{p.tag}</span>}
                    </div>
                    <p className="text-xs text-ink-muted">Full coverage plan</p>
                  </div>
                  <span className="font-display font-black text-ink">{p.price}<span className="text-xs font-semibold text-ink-muted">/mo</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer unchanged */}
      <footer className="border-t border-ink-border px-5 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-ink-muted font-display">© 2026 PayGo Technologies Ltd. All rights reserved.</p>
        <div className="flex gap-5">
          <Link to="/privacy" className="text-xs text-ink-muted hover:text-ink font-display transition-colors">Privacy</Link>
          <Link to="/terms" className="text-xs text-ink-muted hover:text-ink font-display transition-colors">Terms</Link>
        </div>
      </footer>
    </div>
  )
}