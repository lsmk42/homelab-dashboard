import './Card.css'

interface Container {
  id: string
  name: string
  status: 'running' | 'stopped' | 'paused'
  image: string
  cpuPercent: number
  memoryPercent: number
  memoryMB: number
  ports: string[]
}

interface DockerContainersProps {
  data: {
    containers: Container[]
    totalCount: number
    runningCount: number
  }
}

export default function DockerContainers({ data }: DockerContainersProps) {
  return (
    <div className="card">
      <h2 className="card-title">🐳 Docker Containers</h2>

      <div className="stat">
        <span className="stat-label">Total Containers</span>
        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <div style={{ flex: 1 }}>
            <span className="stat-value">{data.runningCount} running</span>
          </div>
          <div style={{ flex: 1 }}>
            <span className="stat-value">{data.totalCount - data.runningCount} stopped</span>
          </div>
        </div>
      </div>

      <div className="container-list">
        {data.containers.length > 0 ? (
          data.containers.map((container) => (
            <div key={container.id} className="container-item">
              <div className="container-name">{container.name}</div>
              <div>
                <span className={`container-status ${container.status}`}>
                  {container.status.toUpperCase()}
                </span>
              </div>
              <div className="container-info">
                <div>Image: {container.image}</div>
                <div>CPU: {container.cpuPercent.toFixed(1)}% | Memory: {container.memoryMB}MB ({container.memoryPercent.toFixed(1)}%)</div>
                {container.ports.length > 0 && (
                  <div>Ports: {container.ports.join(', ')}</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: '#a0a0b0', textAlign: 'center', padding: '20px' }}>No containers found</p>
        )}
      </div>
    </div>
  )
}
