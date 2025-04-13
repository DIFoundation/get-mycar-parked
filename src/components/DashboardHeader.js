'use client'

import { useEffect, useState } from 'react'

export default function DashboardHeader() {
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [weeklyRevenue, setWeeklyRevenue] = useState(0)
  const [dailyRevenue, setDailyRevenue] = useState(0)

  useEffect(() => {
    // Fetch from localStorage or mock persistent data
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]')
    const now = new Date()

    const total = transactions.reduce((sum, tx) => sum + tx.amount, 0)

    const weekly = transactions
      .filter((tx) => {
        const date = new Date(tx.timestamp)
        const oneWeekAgo = new Date(now)
        oneWeekAgo.setDate(now.getDate() - 7)
        return date >= oneWeekAgo
      })
      .reduce((sum, tx) => sum + tx.amount, 0)

    const daily = transactions
      .filter((tx) => {
        const date = new Date(tx.timestamp)
        return (
          date.getDate() === now.getDate() &&
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        )
      })
      .reduce((sum, tx) => sum + tx.amount, 0)

    setTotalRevenue(total)
    setWeeklyRevenue(weekly)
    setDailyRevenue(daily)
  }, [])

  return (
    <div className="mb-6">
      {/* Welcome Card */}
      <div className="bg-white p-6 rounded-xl shadow mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome to the Parking Lot Manager 🚗
        </h1>
        <p className="text-gray-600 mt-2">
          Manage bookings, track revenue, and monitor vehicle activity.
        </p>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded-xl shadow">
          <h2 className="text-sm">Total Revenue</h2>
          <p className="text-2xl font-bold">${totalRevenue}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-xl shadow">
          <h2 className="text-sm">Weekly Revenue</h2>
          <p className="text-2xl font-bold">${weeklyRevenue}</p>
        </div>
        <div className="bg-orange-500 text-white p-4 rounded-xl shadow">
          <h2 className="text-sm">Daily Revenue</h2>
          <p className="text-2xl font-bold">${dailyRevenue}</p>
        </div>
      </div>
    </div>
  )
}
