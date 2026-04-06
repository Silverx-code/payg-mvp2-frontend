import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

const BASE = import.meta.env.VITE_API_BASE_URL

// ─── Determines if we have a real backend to talk to ─────────────────────────
const hasBackend = () => Boolean(BASE && BASE !== 'https://payg-mvp2-backend.onrender.com' || false)

// ─── Generate a local mock OTP for dev/demo mode ─────────────────────────────
const mockOtp = () => String(Math.floor(1000 + Math.random() * 9000))

export default function Auth() {
  const [mode, setMode]         = useState('phone')
  const [step, setStep]         = useState('input')   // input | otp
  const [value, setValue]       = useState('')
  const [otp, setOtp]           = useState(['', '', '', ''])
  const [devCode, setDevCode]   = useState(null)       // shown in yellow banner in dev mode
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [resendTimer, setResendTimer] = useState(0)
  const refs = [useRef(), useRef(), useRef(), useRef()]
  const timerRef = useRef(null)
  const navigate = useNavigate()
  const { login } = useApp()

  // ─── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    if (mode === 'phone') {
      const clean = value.replace(/\s/g, '')
      if (!/^0[789]\d{9}$/.test(clean))
        return 'Enter a valid Nigerian number — e.g. 08012345678'
    }
    if (mode === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return 'Enter a valid email address'
    }
    return null
  }

  // ─── Start resend countdown (60 seconds) ───────────────────────────────────
  const startCountdown = () => {
    setResendTimer(60)
    timerRef.current = setInterval(() => {
      setResendTimer(t => {
        if (t <= 1) { clearInterval(timerRef.current); return 0 }
        return t - 1
      })
    }, 1000)
  }

  // ─── Send OTP ──────────────────────────────────────────────────────────────
  const handleSend = async () => {
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    setLoading(true)

    try {
      if (hasBackend()) {
        // ── Real backend ─────────────────────────────────────────────────────
        const res = await fetch(`${BASE}/auth/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            mode === 'phone' ? { phone: value } : { email: value }
          ),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Failed to send code')

        // Backend returns devOtp in development mode
        if (data.devOtp) setDevCode(data.devOtp)
        else setDevCode(null)

      } else {
        // ── No backend — generate local code and show it on screen ───────────
        const code = mockOtp()
        setDevCode(code)
        console.log(`[PAYG DEV] OTP for ${value}: ${code}`)
        // Simulate network delay
        await new Promise(r => setTimeout(r, 900))
      }

      setStep('otp')
      startCountdown()
    } catch (e) {
      setError(e.message || 'Could not send code. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  // ─── Resend ────────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendTimer > 0) return
    setOtp(['', '', '', ''])
    setDevCode(null)
    setError('')
    await handleSend()
  }

  // ─── OTP input handling ────────────────────────────────────────────────────
  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return
    const n = [...otp]; n[i] = val; setOtp(n)
    if (val && i < 3) refs[i + 1].current?.focus()
  }
  const handleOtpKey = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs[i - 1].current?.focus()
  }

  // ─── Auto-fill from dev banner ────────────────────────────────────────────
  const autoFill = () => {
    if (!devCode) return
    const digits = devCode.split('')
    setOtp(digits)
    refs[3].current?.focus()
  }

  // ─── Verify OTP ───────────────────────────────────────────────────────────
  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length < 4) { setError('Enter the 4-digit code'); return }
    setError('')
    setLoading(true)

    try {
      if (hasBackend()) {
        // ── Real backend verification ────────────────────────────────────────
        const payload = mode === 'phone'
          ? { phone: value, otp: code }
          : { email: value, otp: code }

        const res = await fetch(`${BASE}/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Verification failed')

        // Store JWT token
        if (data.token) localStorage.setItem('payg_token', data.token)

        login({
          id:          data.user.id,
          phone:       data.user.phone,
          email:       data.user.email,
          firstName:   data.user.firstName,
          lastName:    data.user.lastName,
          isOnboarded: data.user.isOnboarded,
        })
        navigate(data.isNew ? '/onboarding' : '/dashboard')

      } else {
        // ── Dev mode: accept the shown code ──────────────────────────────────
        if (code !== devCode) {
          throw new Error(`Wrong code. The dev code is ${devCode} — click it to auto-fill.`)
        }
        await new Promise(r => setTimeout(r, 700))
        // First-time users go to onboarding, returning go to dashboard
        const isNew = !localStorage.getItem('payg_returning')
        if (isNew) localStorage.setItem('payg_returning', '1')
        login({
          phone: mode === 'phone' ? value : null,
          email: mode === 'email' ? value : null,
          firstName: null,
        })
        navigate(isNew ? '/onboarding' : '/dashboard')
      }
    } catch (e) {
      setError(e.message || 'Verification failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white flex flex-col max-w-lg mx-auto px-5">

      {/* Back */}
      <div className="pt-10">
        <Link to="/" className="inline-flex items-center gap-1.5 text-ink-muted text-sm hover:text-ink transition-colors">
          <span className="icon-o text-xl">arrow_back</span>
          <span className="font-display font-medium">Back</span>
        </Link>
      </div>

      {/* Logo */}
      <div className="flex items-center gap-2 mt-6 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-blue-brand flex items-center justify-center shadow-blue">
          <span className="text-white text-xl icon">shield</span>
        </div>
        <span className="font-display font-extrabold text-xl text-ink">PAYG</span>
      </div>

      {/* ── STEP 1: Enter phone / email ──────────────────────────────────── */}
      {step === 'input' && (
        <div className="fu">
          <h1 className="font-display font-black text-3xl text-ink mb-1">Welcome! 👋</h1>
          <p className="text-ink-muted mb-8">Sign in or create your account</p>

          {/* Phone / Email toggle */}
          <div className="flex bg-ink-faint rounded-2xl p-1 mb-6">
            {[['phone', 'smartphone', 'Phone'], ['email', 'mail', 'Email']].map(([m, ic, lb]) => (
              <button key={m} onClick={() => { setMode(m); setValue(''); setError('') }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-display font-semibold text-sm transition-all ${
                  mode === m ? 'bg-white text-ink shadow-card' : 'text-ink-muted'
                }`}>
                <span className="icon-o text-lg">{ic}</span> {lb}
              </button>
            ))}
          </div>

          <label className="block text-[11px] font-display font-bold text-ink-muted uppercase tracking-wider mb-2">
            {mode === 'phone' ? 'Phone Number' : 'Email Address'}
          </label>

          {mode === 'phone' ? (
            <div className="flex gap-2 mb-1">
              <div className="flex items-center bg-ink-faint border border-ink-border rounded-2xl px-3 h-14 text-sm font-display font-semibold text-ink gap-1 flex-shrink-0">
                🇳🇬 +234
              </div>
              <input
                type="tel"
                value={value}
                onChange={e => { setValue(e.target.value.replace(/\D/g, '')); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="08012345678"
                maxLength={11}
                autoFocus
                className="flex-1 bg-ink-faint border-2 border-ink-border focus:border-blue-brand rounded-2xl h-14 px-4 text-lg font-display text-ink transition-all"
              />
            </div>
          ) : (
            <input
              type="email"
              value={value}
              onChange={e => { setValue(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="you@example.com"
              autoFocus
              className="w-full bg-ink-faint border-2 border-ink-border focus:border-blue-brand rounded-2xl h-14 px-4 text-base font-display text-ink transition-all"
            />
          )}

          {error && (
            <p className="text-red-500 text-xs mt-2 mb-1 flex items-center gap-1">
              <span className="icon-o text-base">error</span>{error}
            </p>
          )}

          <button
            onClick={handleSend}
            disabled={loading}
            className="w-full mt-5 bg-blue-brand text-white font-display font-bold py-4 rounded-3xl shadow-blue hover:bg-blue-dark active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2 text-base">
            {loading
              ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full spin"/>Sending code…</>
              : <><span className="icon-o text-xl">send</span>Send Verification Code</>}
          </button>

          {/* Dev mode badge */}
          {!hasBackend() && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-2 items-start">
              <span className="icon text-amber-500 text-lg flex-shrink-0 mt-0.5">construction</span>
              <div>
                <p className="text-xs font-display font-bold text-amber-700 mb-0.5">Demo mode</p>
                <p className="text-xs text-amber-600 leading-relaxed">
                  No backend connected. A code will be shown on screen so you can test the full flow.
                  Set <code className="bg-amber-100 px-1 rounded">VITE_API_BASE_URL</code> in <code className="bg-amber-100 px-1 rounded">.env</code> to use a real backend.
                </p>
              </div>
            </div>
          )}

          <div className="mt-4 p-4 bg-blue-light rounded-2xl">
            <p className="text-xs text-blue-brand font-display font-semibold flex items-start gap-2">
              <span className="icon text-base flex-shrink-0 mt-0.5">info</span>
              New to PAYG? We'll create your account automatically — no password needed.
            </p>
          </div>
        </div>
      )}

      {/* ── STEP 2: Enter OTP ────────────────────────────────────────────── */}
      {step === 'otp' && (
        <div className="fu">
          <h1 className="font-display font-black text-3xl text-ink mb-1">
            {mode === 'phone' ? 'Check your SMS 📱' : 'Check your inbox 📧'}
          </h1>
          <p className="text-ink-muted mb-6">
            We sent a 4-digit code to{' '}
            <span className="font-display font-semibold text-ink">{value}</span>
          </p>

          {/* ── Dev mode banner — shows the code and lets you click to fill ── */}
          {devCode && (
            <button
              onClick={autoFill}
              className="w-full mb-6 p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl text-left hover:bg-amber-100 transition-colors group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="icon text-amber-500 text-lg">construction</span>
                  <p className="text-xs font-display font-bold text-amber-700">Demo mode — your code is:</p>
                </div>
                <span className="text-[10px] font-display font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full group-hover:bg-amber-200 transition-colors">
                  Click to auto-fill →
                </span>
              </div>
              <p className="font-display font-black text-3xl text-amber-600 tracking-[0.3em] ml-7">
                {devCode}
              </p>
              <p className="text-[10px] text-amber-500 mt-1 ml-7">
                This code only appears because no SMS provider is connected yet.
              </p>
            </button>
          )}

          <label className="block text-[11px] font-display font-bold text-ink-muted uppercase tracking-wider mb-3">
            Verification Code
          </label>

          <div className="flex gap-3 mb-1">
            {otp.map((d, i) => (
              <input
                key={i}
                ref={refs[i]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleOtpChange(i, e.target.value)}
                onKeyDown={e => handleOtpKey(i, e)}
                className={`flex-1 aspect-square text-center font-display font-extrabold text-2xl border-2 rounded-2xl transition-all ${
                  d ? 'border-blue-brand bg-blue-light text-blue-brand' : 'border-ink-border bg-ink-faint text-ink'
                }`}
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-xs mt-2 mb-2 flex items-center gap-1">
              <span className="icon-o text-base">error</span>{error}
            </p>
          )}

          {/* Resend */}
          <div className="flex items-center justify-between mt-3 mb-6">
            <p className="text-xs text-ink-muted">Didn't receive it?</p>
            {resendTimer > 0 ? (
              <p className="text-xs font-display text-ink-muted">
                Resend in <span className="font-bold text-ink">{resendTimer}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-xs font-display font-bold text-orange-brand hover:underline">
                Resend Code
              </button>
            )}
          </div>

          <button
            onClick={handleVerify}
            disabled={loading || otp.join('').length < 4}
            className="w-full bg-blue-brand text-white font-display font-bold py-4 rounded-3xl shadow-blue hover:bg-blue-dark active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2 text-base mb-4">
            {loading
              ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full spin"/>Verifying…</>
              : <><span className="icon-o">verified</span>Verify & Continue</>}
          </button>

          <button
            onClick={() => { setStep('input'); setOtp(['', '', '', '']); setDevCode(null); setError(''); clearInterval(timerRef.current) }}
            className="w-full text-ink-muted text-sm font-display py-3 hover:text-ink transition-colors">
            ← Change {mode === 'phone' ? 'phone number' : 'email'}
          </button>
        </div>
      )}

      <p className="mt-auto py-6 text-center text-xs text-ink-muted leading-relaxed">
        By continuing you agree to our{' '}
        <Link to="/terms" className="text-blue-brand font-display font-semibold">Terms of Service</Link>{' '}
        and{' '}
        <Link to="/privacy" className="text-blue-brand font-display font-semibold">Privacy Policy</Link>
      </p>
    </div>
  )
}
