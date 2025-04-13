'use client'

import { useState } from 'react';
import BookSlotForm from './BookSlotForm';
import CheckOutView from './ChechOutView';

export default function TabSwitcher() {
  const [activeTab, setActiveTab] = useState('book')

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-6">
      {/* Tab Buttons */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded-full font-semibold transition ${
            activeTab === 'book'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}
          onClick={() => setActiveTab('book')}
        >
          Book Slot
        </button>
        <button
          className={`px-4 py-2 rounded-full font-semibold transition ${
            activeTab === 'checkout'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800'
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
