import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import AppLayout from '../components/AppLayout.jsx'
import PageHeader from '../components/PageHeader.jsx'

const PLANS = [
  {
    id: 1, name: 'Basic', price: 500,
    tagline: 'Essential protection for everyday health',
    icon: 'local_hospital', iconBg: 'bg-blue-light', iconColor: 'text-blue-brand',
    features: [
      { text: 'Clinic visits & consultations', ok: true },
      { text: 'Basic lab tests', ok: true },
      { text: 'Digital health records', ok: true },
      { text: 'SMS health alerts', ok: true },
      { text: '24/7 virtual consultations', ok: false },
      { text: 'Pharmacy discounts', ok: false },
      { text: 'Specialist referrals', ok: false },
      { text: 'Private hospital ward', ok: false },
      { text: 'International coverage', ok: false },
    ],
  },
  {
    id: 2, name: 'Standard', price: 1000,
    tagline: 'Comprehensive care for you and your family',
    icon: 'health_and_safety', iconBg: 'bg-blue-brand', iconColor: 'text-white',
    featured: true,
    features: [
      { text: 'Everything in Basic', ok: true },
      { text: '24/7 virtual consultations', ok: true },
      { text: 'Specialized lab tests', ok: true },
      { text: 'Pharmacy discounts (20%)', ok: true },
      { text: 'Specialist referrals', ok: true },
      { text: 'Mental health support', ok: true },
      { text: 'Private hospital ward', ok: false },
      { text: 'International coverage', ok: false },
      { text: 'Dedicated concierge', ok: false },
    ],
  },
  {
    id: 3, name: 'Premium', price: 2000,
    tagline: 'Full coverage with no compromises',
    icon: 'workspace_premium', iconBg: 'bg-amber-50', iconColor: 'text-amber-600',
    features: [
      { text: 'Everything in Standard', ok: true },
      { text: 'Private hospital ward', ok: true },
      { text: 'International coverage', ok: true },
      { text: 'Dedicated health concierge', ok: true },
      { text: 'Annual full-body checkup', ok: true },
      { text: 'Dental & optical care', ok: true },
      { text: 'Emergency evacuation', ok: true },
      { text: 'Family plan (up to 4)', ok: true },
      { text: 'Priority claim processing', ok: true },
    ],
  },
]

export default function Plans() {
  const { subscription, changePlan } = useApp()
  const navigate = useNavigate()
  const [selected, setSelected] = useState(subscription.plan)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [expanded, setExpanded] = useState(null)

  const selectedPlan = PLANS.find(p => p.name === selected)
  const currentPlan = PLANS.find(p => p.name === subscription.plan)

  const handleConfirm = () => {
    if (selected === subscription.plan) { navigate('/dashboard'); return }
    setSaving(true)
    setTimeout(() => {
      changePlan(selectedPlan.id, selectedPlan.name, selectedPlan.price)
      setSaving(false); setSaved(true)
      setTimeout(() => navigate('/dashboard'), 1200)
    }, 1100)
  }

  const isUpgrade = selectedPlan && currentPlan && selectedPlan.price > currentPlan.price
  const isDowngrade = selectedPlan && currentPlan && selectedPlan.price < currentPlan.price

  return (
    <AppLayout>
      <PageHeader title="Choose a Plan" subtitle="Change takes effect next billing cycle"/>

      <div className="px-4 lg:px-8 pt-5 pb-36 lg:pb-16 max-w-5xl">

        {/* Current plan notice */}
        <div className="bg-blue-light border border-blue-muted rounded-2xl p-3 flex items-center gap-2 mb-5 fu">
          <span className="icon text-blue-brand text-lg">info</span>
          <p className="text-xs font-display font-semibold text-blue-brand">
            You're currently on the <span className="font-black">{subscription.plan}</span> plan · ₦{subscription.planPrice.toLocaleString()}/mo
          </p>
        </div>

        {/* Plan cards — stack on mobile, 3-col on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {PLANS.map((p, idx) => {
            const isSelected = selected === p.name
            const isCurrent = subscription.plan === p.name
            const isOpen = expanded === p.name

            return (
              <div key={p.id}
                className={`bg-white rounded-3xl border-2 overflow-hidden shadow-card transition-all duration-200 fu flex flex-col ${
                  isSelected ? 'border-blue-brand ring-2 ring-blue-brand/20' : 'border-ink-border'
                }`}
                style={{ animationDelay: `${idx * 0.08}s` }}>

                <button className="w-full text-left p-5 flex-1"
                  onClick={() => { setSelected(p.name); setExpanded(isOpen ? null : p.name) }}>

                  {p.featured && (
                    <div className="flex justify-end mb-2">
                      <span className="text-[9px] bg-orange-brand text-white font-display font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-2xl ${p.iconBg} flex items-center justify-center flex-shrink-0`}>
                      <span className={`icon text-2xl ${p.iconColor}`}>{p.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display font-extrabold text-ink text-lg">{p.name}</span>
                        {isCurrent && (
                          <span className="text-[9px] bg-green-light text-green-brand font-display font-bold px-2 py-0.5 rounded-full">Current</span>
                        )}
                      </div>
                      <p className="text-xs text-ink-muted leading-snug">{p.tagline}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-3">
                    <span className="font-display font-black text-3xl text-ink">₦{p.price.toLocaleString()}</span>
                    <span className="text-ink-muted text-sm font-display ml-1">/month</span>
                  </div>

                  {/* Selection indicator */}
                  <div className={`flex items-center justify-between border-t pt-3 ${isSelected ? 'border-blue-brand' : 'border-ink-border'}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected ? 'border-blue-brand bg-blue-brand' : 'border-ink-border'
                      }`}>
                        {isSelected && <span className="icon text-white text-xs">check</span>}
                      </div>
                      <span className={`text-xs font-display font-semibold ${isSelected ? 'text-blue-brand' : 'text-ink-muted'}`}>
                        {isSelected ? 'Selected' : 'Select this plan'}
                      </span>
                    </div>
                    {/* On desktop show features inline, on mobile show toggle */}
                    <span className={`icon-o text-ink-muted text-xl transition-transform duration-200 lg:hidden ${isOpen ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </div>
                </button>

                {/* Features — always shown on desktop, toggle on mobile */}
                <div className={`px-5 pb-5 border-t border-ink-border bg-ink-faint ${isOpen ? 'block' : 'hidden'} lg:block`}>
                  <p className="text-[10px] font-display font-bold text-ink-muted uppercase tracking-wider mt-4 mb-3">
                    What's included
                  </p>
                  <div className="flex flex-col gap-2">
                    {p.features.map((f, i) => (
                      <div key={i} className={`flex items-center gap-2.5 text-xs ${f.ok ? 'text-ink' : 'text-ink-border'}`}>
                        <span className={`icon text-sm flex-shrink-0 ${f.ok ? 'text-green-brand' : 'text-ink-border'}`}>
                          {f.ok ? 'check_circle' : 'remove_circle'}
                        </span>
                        {f.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Upgrade/downgrade notice */}
        {selected !== subscription.plan && (
          <div className={`mt-4 rounded-2xl p-4 flex gap-2 items-start border fu ${
            isUpgrade ? 'bg-green-light border-green-muted' : 'bg-orange-light border-orange-muted'
          }`}>
            <span className={`icon text-xl flex-shrink-0 ${isUpgrade ? 'text-green-brand' : 'text-orange-brand'}`}>
              {isUpgrade ? 'arrow_upward' : 'arrow_downward'}
            </span>
            <p className={`text-xs font-display font-semibold leading-relaxed ${isUpgrade ? 'text-green-brand' : 'text-orange-brand'}`}>
              {isUpgrade
                ? `Upgrading to ${selected}. Your wallet will reset and you'll be charged ₦${selectedPlan?.price.toLocaleString()}/month from next cycle.`
                : `Downgrading to ${selected}. Change takes effect at the start of your next billing cycle.`}
            </p>
          </div>
        )}

        {/* Confirm button — fixed on mobile, inline on desktop */}
        <div className="lg:hidden fixed bottom-20 left-0 right-0 max-w-md mx-auto px-4 z-30">
          <button onClick={handleConfirm} disabled={saving || saved}
            className={`w-full font-display font-bold py-4 rounded-3xl text-white text-base transition-all active:scale-95 flex items-center justify-center gap-2 ${
              saved ? 'bg-green-brand' : 'bg-blue-brand hover:bg-blue-dark shadow-blue'
            } disabled:opacity-70`}>
            <ConfirmLabel saving={saving} saved={saved} selected={selected} subscription={subscription} selectedPlan={selectedPlan} />
          </button>
        </div>

        <button onClick={handleConfirm} disabled={saving || saved}
          className={`hidden lg:flex mt-6 w-full font-display font-bold py-4 rounded-3xl text-white text-base transition-all active:scale-95 items-center justify-center gap-2 ${
            saved ? 'bg-green-brand' : 'bg-blue-brand hover:bg-blue-dark shadow-blue'
          } disabled:opacity-70`}>
          <ConfirmLabel saving={saving} saved={saved} selected={selected} subscription={subscription} selectedPlan={selectedPlan} />
        </button>
      </div>
    </AppLayout>
  )
}

function ConfirmLabel({ saving, saved, selected, subscription, selectedPlan }) {
  if (saving) return <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full spin"/> Saving…</>
  if (saved) return <><span className="icon">check_circle</span> Plan Updated!</>
  if (selected === subscription.plan) return <><span className="icon-o">check</span> Keep {selected} Plan</>
  return <><span className="icon-o">save</span> Confirm — {selected} · ₦{selectedPlan?.price.toLocaleString()}/mo</>
}
