import { useState, useEffect } from 'react'
import { format, isToday, isThisWeek, isThisMonth } from 'date-fns'

export default function CheckOutView() {
  const [activeTab, setActiveTab] = useState('booked')
  const [bookings, setBookings] = useState([])
  const [history, setHistory] = useState([])
  const [filter, setFilter] = useState('all')

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

  const filteredHistory = history.filter((item) => {
    const date = new Date(item.endTime)
    if (filter === 'today') return isToday(date)
    if (filter === 'week') return isThisWeek(date)
    if (filter === 'month') return isThisMonth(date)
    return true
  })

  return (
    <div className="mt-6">
      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        {['booked', 'history'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold rounded-full transition ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {tab === 'booked' ? 'Active Bookings' : 'History'}
          </button>
        ))}
      </div>

      {/* Booked List */}
      {activeTab === 'booked' && (
        <div className="grid gap-5">
          {bookings.length === 0 ? (
            <p className="text-gray-500 text-center">No active bookings</p>
          ) : (
            bookings.map((booking, index) => {
              const charges = calculateCharges(booking)
              return (
                <div
                  key={index}
                  className="bg-white border rounded-xl shadow-md p-5 transition hover:shadow-lg"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-lg text-blue-900">
                        Slot {booking.slotId} — {booking.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Plate: {booking.plate} | Phone: {booking.phone}
                      </p>
                      <p className="text-sm mt-1">
                        Time Parked: <strong>{charges.minutes} mins</strong>
                      </p>
                      <p>
                        Total: <strong>${charges.total}</strong>{' '}
                        {charges.extra > 0 && (
                          <span className="text-red-500">
                            (+${charges.extra} extra)
                          </span>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCheckout(index)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Check Out
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* History List */}
      {activeTab === 'history' && (
        <div>
          <div className="flex justify-end mb-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          <div className="grid gap-4">
            {filteredHistory.length === 0 ? (
              <p className="text-center text-gray-500">No history available</p>
            ) : (
              filteredHistory
                .slice()
                .reverse()
                .map((record, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 border rounded-md shadow-sm"
                  >
                    <div className="text-blue-800 font-semibold">
                      {record.name} | Plate: {record.plate}
                    </div>
                    <div className="text-sm text-gray-600">
                      Slot {record.slotId} | {record.duration} mins
                    </div>
                    <div className="text-sm font-medium">
                      Paid: ${record.totalPaid}
                    </div>
                    <div className="text-xs text-gray-400">
                      {format(new Date(record.endTime), 'PPpp')}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
