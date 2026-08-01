import { useState, useEffect } from 'react'
import axios from 'axios'
import './Admin.css'

export default function AdminDashboard() {
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formTab, setFormTab] = useState('create-station')
  const [newStation, setNewStation] = useState({ name: '', location: '' })
  const [announcement, setAnnouncement] = useState({ stationId: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await axios.get('/api/stations', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setStations(response.data.stations)
      } catch (err) {
        setError('Failed to load stations')
      } finally {
        setLoading(false)
      }
    }

    fetchStations()
  }, [token])

  const handleCreateStation = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const response = await axios.post('/api/stations', newStation, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setStations([...stations, response.data.station])
      setNewStation({ name: '', location: '' })
      setSuccess('Station created successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create station')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddAnnouncement = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const response = await axios.post(
        `/api/stations/${announcement.stationId}/announcements`,
        { message: announcement.message },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setStations(stations.map(s => s._id === announcement.stationId ? response.data.station : s))
      setAnnouncement({ stationId: '', message: '' })
      setSuccess('Announcement added successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add announcement')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main>
        <div className="loading">Loading admin dashboard...</div>
      </main>
    )
  }

  return (
    <main>
      <div className="admin-header">
        <h1>⚙️ Admin Dashboard</h1>
        <p>Manage stations and announcements</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="admin-container">
        <div className="admin-tabs">
          <button
            className={`tab-btn ${formTab === 'create-station' ? 'active' : ''}`}
            onClick={() => setFormTab('create-station')}
          >
            ➕ Create Station
          </button>
          <button
            className={`tab-btn ${formTab === 'add-announcement' ? 'active' : ''}`}
            onClick={() => setFormTab('add-announcement')}
          >
            📢 Add Announcement
          </button>
        </div>

        <div className="admin-content">
          {formTab === 'create-station' && (
            <div className="admin-form">
              <h2>Create New Station</h2>
              <form onSubmit={handleCreateStation}>
                <div className="form-group">
                  <label>Station Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., Central Station"
                    value={newStation.name}
                    onChange={(e) => setNewStation({ ...newStation, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    placeholder="e.g., Downtown District"
                    value={newStation.location}
                    onChange={(e) => setNewStation({ ...newStation, location: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Station'}
                </button>
              </form>
            </div>
          )}

          {formTab === 'add-announcement' && (
            <div className="admin-form">
              <h2>Add Announcement</h2>
              <form onSubmit={handleAddAnnouncement}>
                <div className="form-group">
                  <label>Select Station *</label>
                  <select
                    value={announcement.stationId}
                    onChange={(e) => setAnnouncement({ ...announcement, stationId: e.target.value })}
                    required
                  >
                    <option value="">-- Select a Station --</option>
                    {stations.map((station) => (
                      <option key={station._id} value={station._id}>
                        {station.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Announcement Message *</label>
                  <textarea
                    placeholder="Enter announcement message..."
                    value={announcement.message}
                    onChange={(e) => setAnnouncement({ ...announcement, message: e.target.value })}
                    rows="4"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Add Announcement'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <div className="stations-overview">
        <h2>📋 All Stations</h2>
        <div className="stations-table-container">
          <table className="stations-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Announcements</th>
              </tr>
            </thead>
            <tbody>
              {stations.length === 0 ? (
                <tr>
                  <td colSpan="3" className="no-data">No stations yet</td>
                </tr>
              ) : (
                stations.map((station) => (
                  <tr key={station._id}>
                    <td>{station.name}</td>
                    <td>{station.location || '--'}</td>
                    <td>{station.announcements?.length || 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
