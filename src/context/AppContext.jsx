import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const Ctx = createContext(null)

// --- defaults ---
const MOCK_USER = null

const DEFAULT_SUB = {
  id: 'sub_001',
  plan: 'Standard',
  planId: 2,
  status: 'active',
  coverageUntil: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
  walletBalance: 350,
  planPrice: 1000,
  policyNumber: 'PAYG-2026-004821',
  nextPaymentDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
}

const MOCK_TRANSACTIONS = []
const MOCK_NOTIFICATIONS = []
const MOCK_CLAIMS = []

// --- helpers (localStorage) ---
const load = (key, fallback) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}

export function AppProvider({ children }) {

  // --- STATE (with persistence) ---
  const [user, setUser] = useState(MOCK_USER)

  const [subscription, setSubscription] = useState(() =>
    load('subscription', DEFAULT_SUB)
  )

  const [transactions, setTransactions] = useState(() =>
    load('transactions', MOCK_TRANSACTIONS)
  )

  const [notifications, setNotifications] = useState(() =>
    load('notifications', MOCK_NOTIFICATIONS)
  )

  const [claims, setClaims] = useState(() =>
    load('claims', MOCK_CLAIMS)
  )

  // --- persist on change ---
  useEffect(() => {
    localStorage.setItem('subscription', JSON.stringify(subscription))
  }, [subscription])

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications))
  }, [notifications])

  useEffect(() => {
    localStorage.setItem('claims', JSON.stringify(claims))
  }, [claims])

  // ---------------- AUTH ----------------
  const login = useCallback((userData) => {
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.clear()
  }, [])

  // ---------------- PAYMENTS (FIXED CORE) ----------------
  const addPayment = useCallback((amount, reference) => {

    setSubscription(prev => {
      const newBalance = Number(prev.walletBalance) + Number(amount)
      const cappedBalance = Math.min(newBalance, prev.planPrice)

      return {
        ...prev,
        walletBalance: cappedBalance,
        status: cappedBalance >= prev.planPrice ? 'active' : prev.status,
      }
    })

    setTransactions(prev => [
      {
        id: `t${Date.now()}`,
        amount,
        type: 'Payment',
        date: new Date().toISOString(),
        status: 'success',
        reference,
      },
      ...prev
    ])

    setNotifications(prev => [
      {
        id: `n${Date.now()}`,
        type: 'payment',
        title: 'Payment received',
        body: `₦${Number(amount).toLocaleString()} added to your wallet.`,
        time: new Date().toISOString(),
        read: false,
      },
      ...prev
    ])
  }, [])

  // ---------------- PLANS ----------------
  const changePlan = useCallback((planId, planName, planPrice) => {
    setSubscription({
      ...DEFAULT_SUB,
      planId,
      plan: planName,
      planPrice,
      walletBalance: 0,
      status: 'pending',
    })
  }, [])

  const cancelSubscription = useCallback(() => {
    setSubscription(prev => ({ ...prev, status: 'inactive' }))
  }, [])

  // ---------------- CLAIMS ----------------
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

  // ---------------- NOTIFICATIONS ----------------
  const markRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    )
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <Ctx.Provider value={{
      user, login, logout,
      subscription,
      setSubscription,
      changePlan, cancelSubscription,
      transactions,
      addPayment,
      notifications,
      markRead,
      markAllRead,
      unreadCount,
      claims,
      submitClaim,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useApp = () => useContext(Ctx)