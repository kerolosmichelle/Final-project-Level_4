import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Stations.css'

export default function StationDetail() {
  const { id } = useParams()
  const [station, setStation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchStation = async () => {
      try {
        const response = await axios.get(`/api/stations/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setStation(response.data.station)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load station')
      } finally {
        setLoading(false)
      }
    }

    fetchStation()
  }, [id, token])

  if (loading) {
    return (
      <main>
        <div className="loading">Loading station...</div>
      </main>
    )
  }

  if (!station) {
    return (
      <main>
        <div className="error-state">
          <p>Station not found</p>
          <button className="btn btn-primary" onClick={() => navigate('/stations')}>
            Back to Stations
          </button>
        </div>
      </main>
    )
  }

  return (
    <main>
      <button className="btn-back" onClick={() => navigate('/stations')}>← Back</button>

      <div className="station-detail">
        <div className="detail-header">
          <div className="detail-icon">🏢</div>
          <div>
            <h1>{station.name}</h1>
            <p className="detail-location">{station.location || 'Location TBA'}</p>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="announcements-section">
          <h2>📢 Announcements</h2>
          {station.announcements && station.announcements.length > 0 ? (
            <div className="announcements-list">
              {station.announcements.map((announcement, idx) => (
                <div key={idx} className="announcement-item">
                  <p className="announcement-message">{announcement.message}</p>
                  <span className="announcement-time">
                    {new Date(announcement.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-announcements">
              <p>No announcements at this station</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
