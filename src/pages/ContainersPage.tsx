import { useEffect, useState } from 'react'
import './Pages.css'

interface Container {
  id: string
  name: string
  status: string
  image: string
  cpuPercent: number
  memoryPercent: number
  memoryMB: number
  ports: string[]
}

export default function ContainersPage() {
  const [containers, setContainers] = useState<Container[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContainers = async () => {
      try {
        const response = await fetch('/api/docker')
        const data = await response.json()
        setContainers(data.containers || [])
      } catch (err) {
        console.error('Failed to fetch containers:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchContainers()
    const interval = setInterval(fetchContainers, 5000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return '#2ec4b6'
      case 'stopped':
        return '#ff6b6b'
      default:
        return '#ffa502'
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Docker Containers</h2>
        <p>Manage your containerized applications</p>
      </div>

      {loading ? (
        <div className="page-loading">Loading containers...</div>
      ) : containers.length === 0 ? (
        <div className="page-empty">
          <p>No Docker containers found</p>
          <small>Make sure Docker is installed and running</small>
        </div>
      ) : (
        <div className="containers-grid">
          {containers.map((container) => (
            <div key={container.id} className="container-card">
              <div className="container-header">
                <div>
                  <h3>{container.name}</h3>
                  <p className="container-image">{container.image}</p>
                </div>
                <span
                  className="container-status-badge"
                  style={{ borderColor: getStatusColor(container.status) }}
                >
                  {container.status.toUpperCase()}
                </span>
              </div>

              <div className="container-details">
                <div className="detail-item">
                  <span className="detail-label">CPU Usage</span>
                  <span className="detail-value">{container.cpuPercent.toFixed(1)}%</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Memory Usage</span>
                  <span className="detail-value">{container.memoryMB}MB ({container.memoryPercent.toFixed(1)}%)</span>
                </div>

                {container.ports.length > 0 && (
                  <div className="detail-item">
                    <span className="detail-label">Ports</span>
                    <div className="ports-list">
                      {container.ports.map((port, idx) => (
                        <span key={idx} className="port-tag">
                          {port}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="detail-item">
                  <span className="detail-label">Container ID</span>
                  <span className="detail-value container-id">{container.id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
