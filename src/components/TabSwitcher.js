'use client'

import { useState } from 'react';
import BookSlotForm from './BookSlotForm';
import CheckOutView from './ChechOutView';

export default function TabSwitcher() {
  const [activeTab, setActiveTab] = useState('book')

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-6 dark:bg-gray-600">
      {/* Tab Buttons */}
      <div className="flex justify-center gap-4 mb-4 ">
        <button
          className={`px-4 py-2 rounded-full font-semibold transition ${
            activeTab === 'book'
              ? 'bg-blue-600 text-white dark:bg-gray-200 dark:text-gray-800'
              : 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white'
          }`}
          onClick={() => setActiveTab('book')}
        >
          Book Slot
        </button>
        <button
          className={`px-4 py-2 rounded-full font-semibold transition ${
            activeTab === 'checkout'
              ? 'bg-blue-600 text-white dark:bg-gray-200 dark:text-gray-800'
              : 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white'
          }`}
          onClick={() => setActiveTab('checkout')}
        >
          Check Out
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'book' ? <BookSlotForm /> : <CheckOutView />}
      </div>
    </div>
  )
}
