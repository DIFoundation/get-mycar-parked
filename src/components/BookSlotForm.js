'use client'

import { useState, useEffect } from 'react'

export default function BookSlotForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    plate: '',
    license: '',
    slot: '',
  })

  const [availableSlots, setAvailableSlots] = useState([])

  useEffect(() => {
    const allSlots = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      price: i < 10 ? 60 : 100,
      type: i < 10 ? 'Small only' : 'Small or Big',
    }))

    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]')
    const bookedIds = bookings.map((b) => b.slotId)
    const filtered = allSlots.filter((slot) => !bookedIds.includes(slot.id))
    setAvailableSlots(filtered)
  }, [])

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.slot) return alert('Please select a slot.')

    const slotData = availableSlots.find(
      (slot) => slot.id === parseInt(formData.slot)
    )
    const newBooking = {
      ...formData,
      slotId: parseInt(formData.slot),
      startTime: new Date(),
      fee: slotData.price,
    }

    const existing = JSON.parse(localStorage.getItem('bookings') || '[]')
    localStorage.setItem(
      'bookings',
      JSON.stringify([...existing, newBooking])
    )
    alert(`Slot ${formData.slot} booked successfully!`)
    window.location.reload()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="input"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          className="input"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="plate"
          placeholder="Plate Number"
          className="input"
          value={formData.plate}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="license"
          placeholder="License Number"
          className="input"
          value={formData.license}
          onChange={handleChange}
          required
        />
      </div>

      <select
        name="slot"
        value={formData.slot}
        onChange={handleChange}
        required
        className="input w-full"
      >
        <option value="">Select Available Slot</option>
        {availableSlots.map((slot) => (
          <option key={slot.id} value={slot.id}>
            Slot {slot.id} — {slot.type} — ${slot.price}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
      >
        Book Slot
      </button>
    </form>
  )
}
