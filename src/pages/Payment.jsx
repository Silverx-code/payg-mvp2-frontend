import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { usePaystack } from '../hooks/usePaystack.js'
import AppLayout from '../components/AppLayout.jsx'
import PageHeader from '../components/PageHeader.jsx'

const QUICK_AMOUNTS = [200, 500, 1000, 2000]

export default function Payment() {
  const { subscription, addPayment, user } = useApp()
  const { openPaystack } = usePaystack()
  const navigate = useNavigate()

  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('paystack')
  const [stage, setStage] = useState('form')
  const [error, setError] = useState('')
  const [paidRef, setPaidRef] = useState(null)

  const remaining = Math.max(0, subscription.planPrice - subscription.walletBalance)
  const progress = Math.min((subscription.walletBalance / subscription.planPrice) * 100, 100)

  const handlePay = () => {
    const amt = parseInt(amount)
    if (!amt || amt < 100) { setError('Minimum payment is ₦100'); return }
    setError('')
    setStage('processing')
    openPaystack({
      email: user?.email || 'user@payg.ng',
      amount: amt,
      reference: `PAYG_${Date.now()}`,
      onSuccess: (response) => {
        addPayment(amt, response.reference)
        setPaidRef(response.reference)
        setStage('success')
      },
      onClose: () => { setStage('form'); setError('Payment was cancelled. Try again.') },
    })
  }

  if (stage === 'processing') {
    return (
      <AppLayout>
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5">
          <div className="text-center max-w-sm w-full">
            <div className="w-20 h-20 bg-blue-light rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="w-10 h-10 border-4 border-blue-muted border-t-blue-brand rounded-full spin block"/>
            </div>
            <h2 className="font-display font-extrabold text-2xl text-ink mb-2">Opening Paystack…</h2>
            <p className="text-ink-muted text-sm mb-6">Secure payment gateway is loading</p>
            <div className="bg-ink-faint rounded-2xl p-4 text-left space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-green-brand animate-pulse"/>
                <p className="text-xs font-display font-semibold text-ink">Paystack SSL active</p>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-blue-brand animate-pulse" style={{animationDelay:'0.4s'}}/>
                <p className="text-xs font-display text-ink-muted">PCI-DSS compliant processing</p>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (stage === 'success') {
    const amt = parseInt(amount)
    return (
      <AppLayout>
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5">
          <div className="text-center fu max-w-sm w-full">
            <div className="w-24 h-24 bg-green-light rounded-full flex items-center justify-center mx-auto mb-6 ring">
              <span className="icon text-green-brand text-5xl">check_circle</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl text-ink mb-1">Payment Successful!</h2>
            <p className="text-ink-muted text-sm mb-6">₦{amt.toLocaleString()} added to your insurance wallet</p>
            <div className="bg-ink-faint rounded-3xl p-5 mb-5 text-left space-y-3">
              {[
                ['Amount', `₦${amt.toLocaleString()}`],
                ['Reference', paidRef],
                ['New Balance', `₦${subscription.walletBalance.toLocaleString()}`],
                ['Status', 'Confirmed'],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-ink-muted font-display">{label}</span>
                  <span className={`font-display font-bold ${label === 'New Balance' ? 'text-green-brand' : label === 'Status' ? 'text-[11px] bg-green-light text-green-brand px-2 py-0.5 rounded-full' : 'text-ink text-xs'}`}>{val}</span>
                </div>
              ))}
            </div>
            <div className="bg-green-light border border-green-muted rounded-2xl p-4 mb-6 flex gap-3 items-start text-left">
              <span className="icon text-green-brand text-xl flex-shrink-0">sms</span>
              <div>
                <p className="text-xs font-display font-bold text-green-brand mb-1">SMS Sent ✓</p>
                <p className="text-xs text-green-700 italic leading-relaxed">
                  "₦{amt.toLocaleString()} received. Your PAYG coverage is active. Stay healthy! 🛡️"
                </p>
              </div>
            </div>
            <button onClick={() => navigate('/dashboard')}
              className="w-full bg-blue-brand text-white font-display font-bold py-4 rounded-3xl shadow-blue hover:bg-blue-dark active:scale-95 transition-all">
              Back to Dashboard
            </button>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <PageHeader title="Top Up Wallet" subtitle="Add funds to your insurance wallet"/>

      <div className="px-4 lg:px-8 pt-5 pb-28 lg:pb-10">
        {/* Desktop: 2-col layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-5xl">

          {/* Left column */}
          <div className="flex flex-col gap-4">

            {/* Balance card */}
            <div className="bg-blue-brand rounded-3xl p-5 relative overflow-hidden fu">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"/>
              <p className="text-blue-muted text-xs font-display font-semibold mb-1">Insurance Wallet</p>
              <p className="font-display font-black text-white text-3xl mb-3">₦{subscription.walletBalance.toLocaleString()}</p>
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden mb-1.5">
                <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progress}%` }}/>
              </div>
              {remaining > 0
                ? <p className="text-blue-muted text-xs font-display">₦{remaining.toLocaleString()} more for full <span className="text-white font-bold">{subscription.plan}</span> coverage</p>
                : <p className="text-blue-muted text-xs font-display">🎉 Fully funded for this month!</p>
              }
            </div>

            {/* Quick amounts + custom input */}
            <div className="bg-white rounded-3xl p-5 shadow-card fu fu1">
              <p className="text-[10px] font-display font-bold text-ink-muted uppercase tracking-wider mb-3">Quick Add</p>
              <div className="grid grid-cols-4 gap-2 mb-5">
                {QUICK_AMOUNTS.map(a => {
                  const isRemaining = a === remaining
                  return (
                    <button key={a} onClick={() => setAmount(String(a))}
                      className={`py-3 rounded-2xl font-display font-bold text-sm transition-all relative ${
                        amount === String(a) ? 'bg-blue-brand text-white shadow-blue' : 'bg-ink-faint text-ink hover:bg-blue-light hover:text-blue-brand'
                      }`}>
                      {isRemaining && <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] bg-orange-brand text-white px-1.5 rounded-full font-display font-bold whitespace-nowrap">Exact</span>}
                      ₦{a >= 1000 ? `${a/1000}k` : a}
                    </button>
                  )
                })}
              </div>

              <p className="text-[10px] font-display font-bold text-ink-muted uppercase tracking-wider mb-2">Custom Amount</p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-bold text-ink-muted text-lg">₦</span>
                <input type="number" value={amount} min={100}
                  onChange={e => { setAmount(e.target.value); setError('') }}
                  placeholder="Enter amount (min ₦100)"
                  className={`w-full bg-ink-faint border-2 rounded-2xl h-13 pl-9 pr-4 py-3.5 font-display font-bold text-lg text-ink transition-all ${
                    error ? 'border-red-400' : 'border-ink-border focus:border-blue-brand'
                  }`}/>
              </div>
              {error && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><span className="icon-o text-sm">error</span>{error}</p>}
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">

            {/* Payment method */}
            <div className="bg-white rounded-3xl p-5 shadow-card fu fu2">
              <p className="text-[10px] font-display font-bold text-ink-muted uppercase tracking-wider mb-3">Payment Method</p>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'paystack', label: 'Paystack', sub: 'Card, bank transfer, USSD', emoji: '💳', badge: 'Recommended' },
                  { id: 'flutterwave', label: 'Flutterwave', sub: 'Card, bank transfer, mobile money', emoji: '🌍', badge: null },
                ].map(m => (
                  <button key={m.id} onClick={() => setMethod(m.id)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                      method === m.id ? 'border-blue-brand bg-blue-light' : 'border-ink-border hover:border-blue-muted'
                    }`}>
                    <span className="text-2xl">{m.emoji}</span>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <p className="font-display font-bold text-ink text-sm">{m.label}</p>
                        {m.badge && <span className="text-[9px] bg-green-light text-green-brand font-display font-bold px-1.5 py-0.5 rounded-full">{m.badge}</span>}
                      </div>
                      <p className="text-xs text-ink-muted">{m.sub}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === m.id ? 'border-blue-brand' : 'border-ink-border'}`}>
                      {method === m.id && <div className="w-2.5 h-2.5 bg-blue-brand rounded-full"/>}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Setup note */}
            <div className="bg-ink-faint border border-ink-border rounded-2xl p-4 flex gap-2 items-start">
              <span className="icon-o text-ink-muted text-lg flex-shrink-0 mt-0.5">info</span>
              <p className="text-xs text-ink-muted leading-relaxed">
                <span className="font-display font-semibold text-ink">To enable live payments:</span> Add your Paystack key to <code className="bg-white px-1 rounded text-[10px]">.env</code> as <code className="bg-white px-1 rounded text-[10px]">VITE_PAYSTACK_PUBLIC_KEY</code>. Get it at <span className="text-blue-brand">dashboard.paystack.com</span>
              </p>
            </div>

            {/* Security badges */}
            <div className="flex items-center justify-center gap-5">
              {[['lock', 'SSL Secure'], ['verified_user', 'PCI-DSS'], ['support_agent', '24/7 Support']].map(([ic, lb]) => (
                <div key={lb} className="flex items-center gap-1 text-[10px] text-ink-muted font-display">
                  <span className="icon-o text-sm">{ic}</span> {lb}
                </div>
              ))}
            </div>

            {/* Pay button */}
            <button onClick={handlePay}
              className="w-full bg-orange-brand text-white font-display font-bold py-4 rounded-3xl shadow-orange hover:bg-orange-600 active:scale-95 transition-all flex items-center justify-center gap-2 text-base">
              <span className="icon-o text-xl">payments</span>
              Pay ₦{amount ? parseInt(amount).toLocaleString() : '---'} via {method === 'paystack' ? 'Paystack' : 'Flutterwave'}
            </button>

            <p className="text-center text-xs text-ink-muted">
              Secured by SSL. Your card details are never stored.
            </p>
          </div>

        </div>
      </div>
    </AppLayout>
  )
}
