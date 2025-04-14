'use client'
import { useEffect, useState } from 'react'
import { isToday, isThisWeek } from 'date-fns'
import { DollarSign, Calendar, CalendarDays } from 'lucide-react'
import { useCurrency } from '@/contexts/currency-context'

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const { formatPrice } = useCurrency()

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('transactions') || '[]')
    setTransactions(data)
  }, [])

  const getRevenue = (filterFn) =>
    transactions
      .filter((t) => filterFn(new Date(t.timestamp)))
      .reduce((sum, t) => sum + t.amount, 0)

  const total = getRevenue(() => true)
  const weekly = getRevenue(isThisWeek)
  const daily = getRevenue(isToday)

  const cards = [
    {
      title: 'Total Revenue',
      value: total,
      icon: <DollarSign className="text-blue-700" />,
      bg: 'bg-gradient-to-r from-blue-500 to-blue-700',
    },
    {
      title: 'This Week',
      value: weekly,
      icon: <Calendar className="text-green-700" />,
      bg: 'bg-gradient-to-r from-green-500 to-green-700',
    },
    {
      title: 'Today',
      value: daily,
      icon: <CalendarDays className="text-orange-700" />,
      bg: 'bg-gradient-to-r from-orange-500 to-orange-700',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-white shadow-md rounded-2xl p-6 dark:bg-gray-600">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">🚗 Welcome!</h2>
        <p className="text-gray-600 mt-2 dark:text-gray-200">
          Manage your parking lot efficiently. Track revenue, book slots, and manage check-outs all in one place.
        </p>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`rounded-2xl shadow-md p-5 text-white flex items-center justify-between ${card.bg}`}
          >
            <div>
              <h3 className="text-lg font-semibold">{card.title}</h3>
              <p className="text-2xl font-bold mt-2">{formatPrice(card.value)}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              {card.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
