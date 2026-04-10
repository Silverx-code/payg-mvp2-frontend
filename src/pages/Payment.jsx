import { useState } from 'react'
import AppLayout from '../components/AppLayout.jsx'
import { useApp } from '../context/AppContext.jsx'

export default function Payment() {
  const { user } = useApp()

  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePay = async (e) => {
    e.preventDefault()

    if (!amount || Number(amount) <= 0) return

    try {
      setLoading(true)

      // TODO: integrate payment API (Paystack / Flutterwave)
      console.log('Processing payment for:', amount)

      setTimeout(() => {
        setLoading(false)
        alert('Payment successful (mock)')
        setAmount('')
      }, 1500)

    } catch (err) {
      console.error(err)
      setLoading(false)
      alert('Payment failed')
    }
  }

  return (
    <AppLayout>
      <div className="min-h-screen px-4 pt-6 pb-24 md:pb-10 md:pt-20">
        
        <h1 className="text-2xl font-bold mb-2">Top Up Wallet</h1>
        <p className="text-gray-500 mb-6">
          Fund your account to continue using services
        </p>

        <form
          onSubmit={handlePay}
          className="bg-white p-4 rounded-xl shadow space-y-4 max-w-md"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              Amount (₦)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring"
              placeholder="Enter amount"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </form>

      </div>
    </AppLayout>
  )
}