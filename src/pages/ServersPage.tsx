import { useEffect, useState } from 'react'
import './Pages.css'

interface Server {
  name: string
  hostname: string
  online: boolean
  lastChecked: string
  cpu?: number
  memory?: {
    used: number
    total: number
    percent: number
  }
  services?: string[]
}

export default function ServersPage() {
  const [servers, setServers] = useState<Server[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await fetch('/api/servers')
        const data = await response.json()
        setServers(data.servers || [])
      } catch (err) {
        console.error('Failed to fetch servers:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchServers()
    const interval = setInterval(fetchServers, 5000)
    return () => clearInterval(interval)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Servers</h2>
        <p>Monitor all your homelab servers</p>
      </div>

      {loading ? (
        <div className="page-loading">Loading servers...</div>
      ) : servers.length === 0 ? (
        <div className="page-empty">
          <p>No servers configured</p>
          <small>Add servers in Settings to start monitoring</small>
        </div>
      ) : (
        <div className="servers-grid">
          {servers.map((server) => (
            <div key={server.hostname} className="server-card">
              <div className="server-header">
                <div>
                  <h3>{server.name}</h3>
                  <p className="server-hostname">{server.hostname}</p>
                </div>
                <span className={`server-status-badge ${server.online ? 'online' : 'offline'}`}>
                  {server.online ? '● Online' : '● Offline'}
                </span>
              </div>

              <div className="server-details">
                {server.cpu !== undefined && (
                  <div className="detail-item">
                    <span className="detail-label">CPU</span>
                    <span className="detail-value">{server.cpu.toFixed(1)}%</span>
                  </div>
                )}

                {server.memory && (
                  <div className="detail-item">
                    <span className="detail-label">Memory</span>
                    <span className="detail-value">
                      {(server.memory.used / 1024 ** 3).toFixed(1)}GB / {(server.memory.total / 1024 ** 3).toFixed(1)}GB
                    </span>
                  </div>
                )}

                {server.services && server.services.length > 0 && (
                  <div className="detail-item">
                    <span className="detail-label">Services</span>
                    <div className="services-list">
                      {server.services.map((svc) => (
                        <span key={svc} className="service-tag">
                          {svc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="detail-item">
                  <span className="detail-label">Last Checked</span>
                  <span className="detail-value" style={{ fontSize: '0.9em' }}>
                    {formatDate(server.lastChecked)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
