// components/CheckOutView.js

import { useState, useEffect } from 'react'

export default function CheckOutView() {
  const [activeTab, setActiveTab] = useState('booked')
  const [bookings, setBookings] = useState([])
  const [history, setHistory] = useState([])

  useEffect(() => {
    const current = JSON.parse(localStorage.getItem('bookings') || '[]')
    const previous = JSON.parse(localStorage.getItem('history') || '[]')
    setBookings(current)
    setHistory(previous)
  }, [])

  const calculateCharges = (booking) => {
    const startTime = new Date(booking.startTime)
    const now = new Date()
    const durationMinutes = Math.floor((now - startTime) / (1000 * 60))

    let extraCharge = 0
    if (durationMinutes > 30) {
      const extraHours = Math.ceil((durationMinutes - 30) / 60)
      extraCharge = extraHours * 15
    }

    return {
      total: booking.fee + extraCharge,
      extra: extraCharge,
      minutes: durationMinutes,
    }
  }

  const handleCheckout = (index) => {
    const booking = bookings[index]
    const charges = calculateCharges(booking)

    const updatedBookings = bookings.filter((_, i) => i !== index)
    const newHistory = [
      ...history,
      {
        ...booking,
        endTime: new Date(),
        totalPaid: charges.total,
        duration: charges.minutes,
      },
    ]

    localStorage.setItem('bookings', JSON.stringify(updatedBookings))
    localStorage.setItem('history', JSON.stringify(newHistory))
    localStorage.setItem(
      'transactions',
      JSON.stringify([
        ...(JSON.parse(localStorage.getItem('transactions') || '[]')),
        { amount: charges.total, timestamp: new Date() },
      ])
    )

    alert(`Slot ${booking.slotId} checked out. Total charge: $${charges.total}`)
    setBookings(updatedBookings)
    setHistory(newHistory)
  }

  return (
    <div className="mt-4">
      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setActiveTab('booked')}
          className={`px-4 py-2 font-semibold rounded-full ${
            activeTab === 'booked' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Active Bookings
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 font-semibold rounded-full ${
            activeTab === 'history' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          History
        </button>
      </div>

      {/* Booked List */}
      {activeTab === 'booked' && (
        <div className="grid gap-4">
          {bookings.length === 0 ? (
            <p className="text-gray-500 text-center">No active bookings</p>
          ) : (
            bookings.map((booking, index) => {
              const charges = calculateCharges(booking)
              return (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow border"
                >
                  <div className="font-semibold text-lg">
                    Slot {booking.slotId}
                  </div>
                  <div className="text-sm text-gray-600">
                    {booking.name} — {booking.plate}
                  </div>
                  <div className="mt-2">
                    <p>
                      Time Parked: <b>{charges.minutes} mins</b>
                    </p>
                    <p>
                      Total Charge: <b>${charges.total}</b>{' '}
                      {charges.extra > 0 && (
                        <span className="text-red-500">
                          (incl. ${charges.extra} extra)
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCheckout(index)}
                    className="mt-3 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                  >
                    Check Out
                  </button>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* History List */}
      {activeTab === 'history' && (
        <div className="grid gap-4">
          {history.length === 0 ? (
            <p className="text-gray-500 text-center">No checkout history</p>
          ) : (
            history
              .slice()
              .reverse()
              .map((record, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-4 rounded-md shadow-sm"
                >
                  <div className="text-sm text-gray-800 font-medium">
                    {record.name} | Plate: {record.plate}
                  </div>
                  <div className="text-sm text-gray-600">
                    Slot {record.slotId} | Duration: {record.duration} mins
                  </div>
                  <div className="text-sm font-bold">
                    Paid: ${record.totalPaid}
                  </div>
                  <div className="text-xs text-gray-400">
                    Checked out at:{' '}
                    {new Date(record.endTime).toLocaleString()}
                  </div>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  )
}
