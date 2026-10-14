import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'

const defaults = { roomNumber: '', startDate: '', endDate: '', purpose: '' }

export default function BookingForm() {
  const nav = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState(defaults)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    
    api.get(`/bookings/${id}`)
      .then(res => {
        const data = res.data
        setForm({
          roomNumber: data.roomNumber || '',
          startDate: data.startDate ? data.startDate.split('T')[0] : '',
          endDate: data.endDate ? data.endDate.split('T')[0] : '',
          purpose: data.purpose || ''
        })
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to load booking.')
      })
  }, [id])

  function onChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    
    try {
      if (id) {
        await api.patch(`/bookings/${id}`, form)
      } else {
        await api.post('/bookings', form)
      }
      
      nav('/bookings')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save booking.')
    }
  }

  return (
    <div className="max-w-lg mx-auto card">
      <h1 className="text-xl font-semibold mb-4">{id ? 'Edit' : 'New'} Booking</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        
        <div>
          <label className="block text-sm font-medium mb-1">Room Number</label>
          <input
            type="text"
            name="roomNumber"
            value={form.roomNumber}
            onChange={onChange}
            required
            placeholder="e.g. B2-104"
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex gap-3">
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={onChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={onChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Purpose</label>
          <textarea
            name="purpose"
            value={form.purpose}
            onChange={onChange}
            className="w-full border p-2 rounded"
            rows="3"
          />
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="btn" type="submit">Save</button>
      </form>
    </div>
  )
}