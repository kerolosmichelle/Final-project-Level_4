import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Stations.css'

export default function StationList() {
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await axios.get('/api/stations', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setStations(response.data.stations)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load stations')
      } finally {
        setLoading(false)
      }
    }

    fetchStations()
  }, [token])

  if (loading) {
    return (
      <main>
        <div className="loading">Loading stations...</div>
      </main>
    )
  }

  return (
    <main>
      <div className="stations-header">
        <h1>🚇 Metro Stations</h1>
        <p>Select a station to view announcements and details</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="stations-grid">
        {stations.length === 0 ? (
          <div className="empty-state">
            <p>No stations available</p>
          </div>
        ) : (
          stations.map((station) => (
            <div
              key={station._id}
              className="station-card"
              onClick={() => navigate(`/stations/${station._id}`)}
            >
              <div className="station-icon">🏢</div>
              <h3>{station.name}</h3>
              <p className="station-location">{station.location || 'Location TBA'}</p>
              <div className="station-announcements">
                <strong>{station.announcements?.length || 0}</strong>
                <span>announcements</span>
              </div>
              <button className="btn btn-secondary">View Details →</button>
            </div>
          ))
        )}
      </div>
    </main>
  )
}
