import { useState, useEffect } from 'react'
import { format, isToday, isThisWeek, isThisMonth } from 'date-fns'
import { useCurrency } from '@/contexts/currency-context'

export default function CheckOutView() {
  const [activeTab, setActiveTab] = useState('booked')
  const [bookings, setBookings] = useState([])
  const [history, setHistory] = useState([])
  const [filter, setFilter] = useState('all')

  const { formatPrice } = useCurrency()

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
                ? 'bg-blue-600 text-white dark:bg-gray-200 dark:text-gray-800'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-white'
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
            <p className="text-gray-500 text-center dark:text-gray-200">No active bookings</p>
          ) : (
            bookings.map((booking, index) => {
              const charges = calculateCharges(booking)
              return (
                <div
                  key={index}
                  className="bg-white border rounded-xl shadow-md p-5 transition hover:shadow-lg dark:bg-gray-400 dark:border-gray-800"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-lg text-blue-900 dark:text-blue-950">
                        Slot {booking.slotId} — {booking.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-700">
                        Plate: {booking.plate} | Phone: {booking.phone}
                      </p>
                      <p className="text-sm mt-1 dark:text-white">
                        Time Parked: <strong>{charges.minutes} mins</strong>
                      </p>
                      <p className='dark:text-white'>
                        Total: <strong>{formatPrice(charges.total)}</strong>{' '}
                        {charges.extra > 0 && (
                          <span className="text-red-500 dark:text-red-700">
                            ({formatPrice(charges.extra)} extra)
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
              className="px-3 py-2 border rounded-lg text-sm dark:bg-gray-400 dark:text-white"
            >
              <option value="all">All</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          <div className="grid gap-4">
            {filteredHistory.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-200">No history available</p>
            ) : (
              filteredHistory
                .slice()
                .reverse()
                .map((record, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 border rounded-lg shadow-sm dark:bg-gray-400 dark:border-gray-800"
                  >
                    <div className="text-blue-800 font-semibold dark:text-blue-950">
                      {record.name} | Plate: {record.plate}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-700">
                      Slot {record.slotId} | {record.duration} mins
                    </div>
                    <div className="text-sm font-medium dark:text-white">
                      Paid: {formatPrice(record.totalPaid)}
                    </div>
                    <div className="text-sm text-gray-400 dark:text-white">
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
