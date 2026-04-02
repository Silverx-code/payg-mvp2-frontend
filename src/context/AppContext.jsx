import { createContext, useContext, useState, useCallback } from 'react'

const Ctx = createContext(null)

const MOCK_USER = null
const MOCK_SUB = {
  id: 'sub_001',
  plan: 'Standard',
  planId: 2,
  status: 'active',          // active | pending | inactive
  coverageUntil: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days from now
  walletBalance: 350,
  planPrice: 1000,
  policyNumber: 'PAYG-2026-004821',
  nextPaymentDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
}
const MOCK_TRANSACTIONS = [
  { id: 't1', amount: 500, type: 'Payment', date: '2026-03-20T10:30:00Z', status: 'success', reference: 'payg_ref_001' },
  { id: 't2', amount: 200, type: 'Payment', date: '2026-03-25T14:15:00Z', status: 'success', reference: 'payg_ref_002' },
  { id: 't3', amount: 150, type: 'Payment', date: '2026-03-28T09:00:00Z', status: 'success', reference: 'payg_ref_003' },
]
const MOCK_NOTIFICATIONS = [
  { id: 'n1', type: 'payment', title: 'Payment received', body: '₦500 added to your wallet.', time: '2026-03-20T10:30:00Z', read: true },
  { id: 'n2', type: 'coverage', title: 'Coverage reminder', body: 'You need ₦300 more to stay covered next month.', time: '2026-03-27T08:00:00Z', read: false },
  { id: 'n3', type: 'claim', title: 'Claim update', body: 'Your claim CLM-001 is under review.', time: '2026-03-29T12:00:00Z', read: false },
]
const MOCK_CLAIMS = [
  { id: 'c1', ref: 'CLM-2026-001', type: 'Outpatient', description: 'Clinic visit — fever treatment', amount: 8500, status: 'under_review', date: '2026-03-18T09:00:00Z' },
]

export function AppProvider({ children }) {
  const [user, setUser] = useState(MOCK_USER)
  const [subscription, setSubscription] = useState(MOCK_SUB)
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS)
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const [claims, setClaims] = useState(MOCK_CLAIMS)

  // --- Auth ---
  const login = useCallback((userData) => {
    setUser(userData)
    // When backend is ready: localStorage.setItem('payg_token', userData.token)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('payg_token')
  }, [])

  // --- Payments ---
  const addPayment = useCallback((amount, reference) => {
    const newTx = {
      id: `t${Date.now()}`,
      amount,
      type: 'Payment',
      date: new Date().toISOString(),
      status: 'success',
      reference,
    }
    setTransactions(prev => [newTx, ...prev])
    setSubscription(prev => ({
      ...prev,
      walletBalance: Math.min(prev.walletBalance + amount, prev.planPrice),
      status: prev.walletBalance + amount >= prev.planPrice ? 'active' : prev.status,
    }))
    // Add notification
    setNotifications(prev => [{
      id: `n${Date.now()}`,
      type: 'payment',
      title: 'Payment received',
      body: `₦${amount.toLocaleString()} added to your insurance wallet.`,
      time: new Date().toISOString(),
      read: false,
    }, ...prev])
  }, [])

  // --- Plans ---
  const changePlan = useCallback((planId, planName, planPrice) => {
    setSubscription(prev => ({
      ...prev,
      plan: planName,
      planId,
      planPrice,
      walletBalance: 0, // reset wallet on plan change
      status: 'pending',
    }))
  }, [])

  const cancelSubscription = useCallback(() => {
    setSubscription(prev => ({ ...prev, status: 'inactive' }))
  }, [])

  // --- Claims ---
  const submitClaim = useCallback((claimData) => {
    const newClaim = {
      id: `c${Date.now()}`,
      ref: `CLM-2026-${String(claims.length + 2).padStart(3, '0')}`,
      status: 'submitted',
      date: new Date().toISOString(),
      ...claimData,
    }
    setClaims(prev => [newClaim, ...prev])
    return newClaim
  }, [claims.length])

  // --- Notifications ---
  const markRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }, [])
  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <Ctx.Provider value={{
      user, login, logout,
      subscription, setSubscription, changePlan, cancelSubscription,
      transactions, addPayment,
      notifications, markRead, markAllRead, unreadCount,
      claims, submitClaim,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useApp = () => useContext(Ctx)
