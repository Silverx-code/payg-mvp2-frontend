import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

const STEPS = ['welcome', 'personal', 'kin', 'plan', 'done']

const STEP_META = [
  { label: 'Welcome',  icon: 'waving_hand' },
  { label: 'Personal', icon: 'person' },
  { label: 'Next of Kin', icon: 'family_restroom' },
  { label: 'Plan',     icon: 'shield' },
  { label: 'Done',     icon: 'check_circle' },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const { login, changePlan } = useApp()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ firstName: '', lastName: '', dob: '', gender: '', kinName: '', kinPhone: '', kinRelation: '', plan: 'Standard' })
  const [errors, setErrors] = useState({})

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validatePersonal = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.dob) e.dob = 'Required'
    if (!form.gender) e.gender = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateKin = () => {
    const e = {}
    if (!form.kinName.trim()) e.kinName = 'Required'
    if (!/^0[789]\d{9}$/.test(form.kinPhone)) e.kinPhone = 'Valid Nigerian number required'
    if (!form.kinRelation) e.kinRelation = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (step === 1 && !validatePersonal()) return
    if (step === 2 && !validateKin()) return
    if (step === STEPS.length - 1) {
      const prices = { Basic: 500, Standard: 1000, Premium: 2000 }
      changePlan(form.plan === 'Basic' ? 1 : form.plan === 'Standard' ? 2 : 3, form.plan, prices[form.plan])
      login({ ...form })
      navigate('/dashboard')
      return
    }
    setErrors({})
    setStep(s => s + 1)
  }

  const planOptions = [
    { id: 'Basic', price: '₦500/mo', benefit: 'Clinic visits', icon: 'local_hospital', c: 'bg-blue-light', ic: 'text-blue-brand' },
    { id: 'Standard', price: '₦1,000/mo', benefit: 'General care + virtual', icon: 'health_and_safety', c: 'bg-blue-brand', ic: 'text-white', featured: true },
    { id: 'Premium', price: '₦2,000/mo', benefit: 'Full coverage', icon: 'workspace_premium', c: 'bg-amber-50', ic: 'text-amber-600' },
  ]

  const progress = (step / (STEPS.length - 1)) * 100

  return (
    <div className="min-h-screen bg-white flex">

      {/* Desktop left panel — step progress */}
      <div className="hidden lg:flex flex-col w-72 xl:w-80 bg-ink-faint border-r border-ink-border p-10 flex-shrink-0">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-9 h-9 rounded-xl bg-blue-brand flex items-center justify-center shadow-blue">
            <span className="icon text-white text-lg">shield</span>
          </div>
          <span className="font-display font-extrabold text-xl text-ink">PAYG</span>
        </div>

        <h3 className="font-display font-bold text-ink mb-1">Setting up your account</h3>
        <p className="text-xs text-ink-muted mb-8">Takes about 2 minutes</p>

        <div className="flex flex-col gap-3">
          {STEP_META.map((s, i) => {
            const done = i < step
            const active = i === step
            return (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${active ? 'bg-white shadow-card' : ''}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                  done ? 'bg-green-brand' : active ? 'bg-blue-brand' : 'bg-ink-border'
                }`}>
                  <span className={`icon text-base ${done || active ? 'text-white' : 'text-ink-muted'}`}>
                    {done ? 'check' : s.icon}
                  </span>
                </div>
                <span className={`font-display font-semibold text-sm ${active ? 'text-ink' : done ? 'text-ink-muted' : 'text-ink-border'}`}>
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col max-w-lg mx-auto px-5 lg:px-12 xl:px-16">

        {/* Mobile progress bar */}
        <div className="lg:hidden h-1 bg-ink-border -mx-5">
          <div className="h-full bg-blue-brand transition-all duration-500 rounded-full" style={{ width: `${progress}%` }}/>
        </div>

        <div className="flex-1 px-0 py-8 flex flex-col">

          {/* Welcome */}
          {step === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center scale-in">
              <div className="w-24 h-24 bg-blue-light rounded-full flex items-center justify-center mb-6">
                <span className="icon text-blue-brand text-5xl">shield</span>
              </div>
              <h1 className="font-display font-black text-3xl lg:text-4xl text-ink mb-3">Welcome to PAYG! 🎉</h1>
              <p className="text-ink-muted text-base leading-relaxed mb-6 max-w-sm">
                Let's set up your profile so we can personalise your coverage. Takes about 2 minutes.
              </p>
              <div className="bg-ink-faint rounded-2xl p-4 text-left w-full mb-8 max-w-sm">
                {['Personal details', 'Next of kin', 'Choose your plan'].map((s, i) => (
                  <div key={i} className="flex items-center gap-3 py-2">
                    <div className="w-6 h-6 rounded-full bg-blue-brand flex items-center justify-center text-white text-xs font-display font-bold flex-shrink-0">{i+1}</div>
                    <p className="text-sm font-display font-semibold text-ink">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personal details */}
          {step === 1 && (
            <div className="flex-1 fu">
              <p className="text-[11px] font-display font-bold text-blue-brand uppercase tracking-widest mb-1">Step 1 of 3</p>
              <h2 className="font-display font-extrabold text-2xl lg:text-3xl text-ink mb-1">Personal Details</h2>
              <p className="text-sm text-ink-muted mb-6">Required for your insurance policy.</p>

              <div className="flex gap-3 mb-4">
                {[['firstName','First name'],['lastName','Last name']].map(([k,lb]) => (
                  <div key={k} className="flex-1">
                    <label className="block text-[10px] font-display font-bold text-ink-muted uppercase tracking-wider mb-1.5">{lb}</label>
                    <input value={form[k]} onChange={e => set(k, e.target.value)}
                      className={`w-full bg-ink-faint border-2 rounded-2xl h-12 px-4 font-display text-ink transition-all ${errors[k] ? 'border-red-400' : 'border-ink-border focus:border-blue-brand'}`}/>
                    {errors[k] && <p className="text-red-500 text-[10px] mt-1">{errors[k]}</p>}
                  </div>
                ))}
              </div>

              <label className="block text-[10px] font-display font-bold text-ink-muted uppercase tracking-wider mb-1.5">Date of Birth</label>
              <input type="date" value={form.dob} onChange={e => set('dob', e.target.value)}
                className={`w-full bg-ink-faint border-2 rounded-2xl h-12 px-4 font-display text-ink transition-all mb-4 ${errors.dob ? 'border-red-400' : 'border-ink-border focus:border-blue-brand'}`}/>
              {errors.dob && <p className="text-red-500 text-[10px] -mt-3 mb-4">{errors.dob}</p>}

              <label className="block text-[10px] font-display font-bold text-ink-muted uppercase tracking-wider mb-2">Gender</label>
              <div className="flex gap-2 mb-1">
                {['Male', 'Female', 'Other'].map(g => (
                  <button key={g} onClick={() => set('gender', g)}
                    className={`flex-1 py-2.5 rounded-2xl font-display font-bold text-sm border-2 transition-all ${
                      form.gender === g ? 'border-blue-brand bg-blue-light text-blue-brand' : 'border-ink-border bg-ink-faint text-ink-muted'
                    }`}>{g}</button>
                ))}
              </div>
              {errors.gender && <p className="text-red-500 text-[10px] mt-1">{errors.gender}</p>}
            </div>
          )}

          {/* Next of kin */}
          {step === 2 && (
            <div className="flex-1 fu">
              <p className="text-[11px] font-display font-bold text-blue-brand uppercase tracking-widest mb-1">Step 2 of 3</p>
              <h2 className="font-display font-extrabold text-2xl lg:text-3xl text-ink mb-1">Next of Kin</h2>
              <p className="text-sm text-ink-muted mb-6">Required by insurance regulations.</p>

              {[['kinName','Full name','text','e.g. Adaeze Johnson'],['kinPhone','Phone number','tel','e.g. 08012345678']].map(([k,lb,t,ph]) => (
                <div key={k} className="mb-4">
                  <label className="block text-[10px] font-display font-bold text-ink-muted uppercase tracking-wider mb-1.5">{lb}</label>
                  <input type={t} value={form[k]} onChange={e => set(k, e.target.value)} placeholder={ph}
                    className={`w-full bg-ink-faint border-2 rounded-2xl h-12 px-4 font-display text-ink transition-all ${errors[k] ? 'border-red-400' : 'border-ink-border focus:border-blue-brand'}`}/>
                  {errors[k] && <p className="text-red-500 text-[10px] mt-1">{errors[k]}</p>}
                </div>
              ))}

              <label className="block text-[10px] font-display font-bold text-ink-muted uppercase tracking-wider mb-2">Relationship</label>
              <div className="grid grid-cols-3 gap-2">
                {['Spouse', 'Parent', 'Sibling', 'Child', 'Friend', 'Other'].map(r => (
                  <button key={r} onClick={() => set('kinRelation', r)}
                    className={`py-2.5 rounded-2xl font-display font-bold text-sm border-2 transition-all ${
                      form.kinRelation === r ? 'border-blue-brand bg-blue-light text-blue-brand' : 'border-ink-border bg-ink-faint text-ink-muted'
                    }`}>{r}</button>
                ))}
              </div>
              {errors.kinRelation && <p className="text-red-500 text-[10px] mt-2">{errors.kinRelation}</p>}
            </div>
          )}

          {/* Choose plan */}
          {step === 3 && (
            <div className="flex-1 fu">
              <p className="text-[11px] font-display font-bold text-blue-brand uppercase tracking-widest mb-1">Step 3 of 3</p>
              <h2 className="font-display font-extrabold text-2xl lg:text-3xl text-ink mb-1">Choose Your Plan</h2>
              <p className="text-sm text-ink-muted mb-6">You can change this anytime from your dashboard.</p>
              <div className="flex flex-col gap-3">
                {planOptions.map(p => (
                  <button key={p.id} onClick={() => set('plan', p.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-3xl border-2 text-left transition-all ${
                      form.plan === p.id ? 'border-blue-brand bg-blue-light' : 'border-ink-border hover:border-blue-muted'
                    }`}>
                    <div className={`w-12 h-12 rounded-2xl ${p.c} flex items-center justify-center flex-shrink-0`}>
                      <span className={`icon text-2xl ${p.ic}`}>{p.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-extrabold text-ink">{p.id}</span>
                        {p.featured && <span className="text-[9px] bg-orange-brand text-white font-display font-bold px-1.5 py-0.5 rounded-full">Popular</span>}
                      </div>
                      <p className="text-xs text-ink-muted">{p.benefit}</p>
                    </div>
                    <p className="font-display font-bold text-ink text-sm">{p.price}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Done */}
          {step === 4 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center scale-in">
              <div className="w-24 h-24 bg-green-light rounded-full flex items-center justify-center mb-6 ring">
                <span className="icon text-green-brand text-5xl">check_circle</span>
              </div>
              <h1 className="font-display font-black text-3xl lg:text-4xl text-ink mb-3">You're all set! 🎉</h1>
              <p className="text-ink-muted text-base leading-relaxed mb-2">
                Welcome, <span className="font-display font-bold text-ink">{form.firstName}</span>!
              </p>
              <p className="text-ink-muted text-sm leading-relaxed mb-8 max-w-xs">
                Your <span className="font-bold text-ink">{form.plan}</span> plan is ready. Top up your wallet to activate coverage.
              </p>
            </div>
          )}

          {/* CTA */}
          <button onClick={next}
            className="w-full bg-blue-brand text-white font-display font-bold py-4 rounded-3xl shadow-blue hover:bg-blue-dark active:scale-95 transition-all flex items-center justify-center gap-2 text-base mt-6">
            {step === STEPS.length - 1
              ? <><span className="icon-o">rocket_launch</span>Go to Dashboard</>
              : step === 0 ? <><span className="icon-o">arrow_forward</span>Get Started</>
              : <><span className="icon-o">arrow_forward</span>Continue</>}
          </button>

          {step > 0 && step < STEPS.length - 1 && (
            <button onClick={() => { setStep(s => s - 1); setErrors({}) }}
              className="w-full text-ink-muted font-display text-sm py-3 mt-2 hover:text-ink transition-colors">
              ← Back
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
