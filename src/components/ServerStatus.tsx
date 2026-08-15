import './Card.css'

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

interface ServerStatusProps {
  data: {
    servers: Server[]
    onlineCount: number
  }
}

export default function ServerStatus({ data }: ServerStatusProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString()
  }

  return (
    <div className="card">
      <h2 className="card-title">🖥️ Servers</h2>

      <div className="stat">
        <span className="stat-label">Status</span>
        <span className="stat-value">{data.onlineCount} of {data.servers.length} online</span>
      </div>

      <div className="container-list">
        {data.servers.length > 0 ? (
          data.servers.map((server) => (
            <div key={server.hostname} className="container-item">
              <div className="container-name">{server.name}</div>
              <div>
                <span className={`server-badge ${server.online ? 'online' : 'offline'}`}>
                  {server.online ? '🟢 ONLINE' : '🔴 OFFLINE'}
                </span>
              </div>
              <div className="container-info">
                <div>Host: {server.hostname}</div>
                {server.cpu !== undefined && (
                  <div>CPU: {server.cpu.toFixed(1)}%</div>
                )}
                {server.memory && (
                  <div>Memory: {(server.memory.used / 1024 ** 3).toFixed(1)}GB / {(server.memory.total / 1024 ** 3).toFixed(1)}GB ({server.memory.percent.toFixed(1)}%)</div>
                )}
                {server.services && server.services.length > 0 && (
                  <div>Services: {server.services.join(', ')}</div>
                )}
                <div style={{ fontSize: '0.8em', marginTop: '4px', opacity: 0.7 }}>
                  Last checked: {formatDate(server.lastChecked)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: '#a0a0b0', textAlign: 'center', padding: '20px' }}>No servers configured</p>
        )}
      </div>
    </div>
  )
}
