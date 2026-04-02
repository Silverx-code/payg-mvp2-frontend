import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import logo from '../assets/logo.png'

export default function Auth() {
  const [mode, setMode] = useState('phone')
  const [step, setStep] = useState('input')
  const [value, setValue] = useState('')
  const [otp, setOtp] = useState(['', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const refs = [useRef(), useRef(), useRef(), useRef()]
  const navigate = useNavigate()
  const { login } = useApp()

  const validate = () => {
    if (mode === 'phone' && !/^0[789]\d{9}$/.test(value.replace(/\s/g, '')))
      return 'Enter a valid Nigerian phone number (e.g. 08012345678)'
    if (mode === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return 'Enter a valid email address'
    return null
  }

  const handleSend = () => {
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep('otp')
    }, 1300)
  }

  const handleOtp = (i, val) => {
    if (!/^\d*$/.test(val)) return
    const n = [...otp]
    n[i] = val
    setOtp(n)
    if (val && i < 3) refs[i + 1].current?.focus()
  }

  const handleOtpKey = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      refs[i - 1].current?.focus()
    }
  }

  const handleVerify = () => {
    if (otp.join('').length < 4) {
      setError('Enter the 4-digit code')
      return
    }

    setError('')
    setLoading(true)

    setTimeout(() => {
      const isNewUser = Math.random() > 0.5
      login({
        phone: mode === 'phone' ? value : null,
        email: mode === 'email' ? value : null
      })

      navigate(isNewUser ? '/onboarding' : '/dashboard')
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-white flex">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col w-[45%] bg-blue-brand relative overflow-hidden p-12">

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <img
            src={logo}
            alt="Logo"
            className="w-10 h-10 object-contain"
          />
          <span className="font-display font-extrabold text-2xl text-white">
            PAYG
          </span>
        </div>

        {/* HERO TEXT */}
        <div className="flex-1 flex flex-col justify-center relative z-10">
          <h2 className="font-display font-black text-4xl text-white leading-tight mb-4">
            Healthcare coverage<br />on your terms
          </h2>

          <p className="text-blue-muted text-lg leading-relaxed mb-10">
            Pay-as-you-go insurance designed for Nigerians. No contracts, no hidden fees.
          </p>

          {[
            ['check_circle', 'No annual lock-in contracts'],
            ['check_circle', 'Top up from ₦100 any time'],
            ['check_circle', 'Instant SMS confirmations'],
            ['check_circle', 'NAICOM licensed & CBN regulated'],
          ].map(([ic, txt]) => (
            <div key={txt} className="flex items-center gap-3 mb-3">
              <span className="icon text-blue-muted/70 text-xl">{ic}</span>
              <p className="text-blue-muted font-display font-semibold text-sm">
                {txt}
              </p>
            </div>
          ))}
        </div>

        <p className="text-blue-muted/60 text-xs font-display relative z-10">
          © 2026 PayGo Technologies Ltd. · Licensed by NAICOM
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col max-w-md mx-auto px-5 lg:max-w-none lg:px-16 xl:px-24">

        {/* BACK */}
        <div className="pt-10 lg:pt-12">
          <Link
            to="/"
            className="lg:hidden inline-flex items-center gap-1.5 text-ink-muted text-sm hover:text-ink transition-colors"
          >
            <span className="icon-o text-xl">arrow_back</span>
            <span className="font-display font-medium">Back</span>
          </Link>
        </div>

        {/* MOBILE LOGO */}
        <div className="flex items-center gap-2 mt-6 mb-8 lg:mt-16">
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
          <span className="font-display font-extrabold text-xl text-ink">
            PAYG
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-sm lg:max-w-md w-full">

          {step === 'input' ? (
            <div>
              <h1 className="font-display font-black text-3xl text-ink mb-1">
                Welcome! 👋
              </h1>

              <p className="text-ink-muted mb-8">
                Sign in or create your account in seconds.
              </p>

              {/* MODE */}
              <div className="flex bg-ink-faint rounded-2xl p-1 mb-6">
                {[
                  ['phone', 'smartphone', 'Phone'],
                  ['email', 'mail', 'Email']
                ].map(([m, ic, lb]) => (
                  <button
                    key={m}
                    onClick={() => {
                      setMode(m)
                      setValue('')
                      setError('')
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-display font-semibold text-sm transition-all ${
                      mode === m
                        ? 'bg-white text-ink shadow-card'
                        : 'text-ink-muted'
                    }`}
                  >
                    <span className="icon-o text-lg">{ic}</span>
                    {lb}
                  </button>
                ))}
              </div>

              <label className="block text-[11px] font-display font-bold text-ink-muted uppercase tracking-wider mb-2">
                {mode === 'phone' ? 'Phone Number' : 'Email Address'}
              </label>

              {mode === 'phone' ? (
                <div className="flex gap-2 mb-1">
                  <div className="flex items-center bg-ink-faint border border-ink-border rounded-2xl px-3 h-14 text-sm font-display font-semibold text-ink gap-1">
                    🇳🇬 +234
                  </div>

                  <input
                    type="tel"
                    value={value}
                    onChange={e =>
                      setValue(e.target.value.replace(/\D/g, ''))
                    }
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="08012345678"
                    maxLength={11}
                    className="flex-1 bg-ink-faint border-2 border-ink-border focus:border-blue-brand rounded-2xl h-14 px-4 text-lg font-display text-ink transition-all"
                  />
                </div>
              ) : (
                <input
                  type="email"
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="you@example.com"
                  className="w-full bg-ink-faint border-2 border-ink-border focus:border-blue-brand rounded-2xl h-14 px-4 text-base font-display text-ink transition-all mb-1"
                />
              )}

              {error && (
                <p className="text-red-500 text-xs mt-2 mb-3 flex items-center gap-1">
                  <span className="icon-o text-base">error</span>
                  {error}
                </p>
              )}

              <button
                onClick={handleSend}
                disabled={loading}
                className="w-full mt-5 bg-blue-brand text-white font-display font-bold py-4 rounded-3xl shadow-blue hover:bg-blue-dark active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2 text-base"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full spin" />
                    Sending code…
                  </>
                ) : (
                  <>
                    <span className="icon-o text-xl">send</span>
                    Send Verification Code
                  </>
                )}
              </button>
            </div>
          ) : (
            <div>
              <h1 className="font-display font-black text-3xl text-ink mb-1">
                Check your {mode === 'phone' ? 'SMS' : 'inbox'} 📱
              </h1>

              <p className="text-ink-muted mb-8">
                We sent a 4-digit code to{' '}
                <span className="font-display font-semibold text-ink">
                  {value}
                </span>
              </p>

              <div className="flex gap-3 mb-4">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={refs[i]}
                    value={d}
                    maxLength={1}
                    inputMode="numeric"
                    onChange={e => handleOtp(i, e.target.value)}
                    onKeyDown={e => handleOtpKey(i, e)}
                    className={`flex-1 aspect-square text-center font-display font-extrabold text-2xl border-2 rounded-2xl ${
                      d
                        ? 'border-blue-brand bg-blue-light text-blue-brand'
                        : 'border-ink-border bg-ink-faint text-ink'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleVerify}
                disabled={loading}
                className="w-full bg-blue-brand text-white font-display font-bold py-4 rounded-3xl shadow-blue hover:bg-blue-dark transition-all"
              >
                {loading ? 'Verifying…' : 'Verify & Continue'}
              </button>
            </div>
          )}
        </div>

        <p className="py-6 text-center text-xs text-ink-muted">
          By continuing you agree to our Terms and Privacy Policy
        </p>
      </div>
    </div>
  )
}