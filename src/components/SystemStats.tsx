import './Card.css'

interface SystemStatsProps {
  data: {
    cpu: number
    memory: {
      used: number
      total: number
      percent: number
    }
    disk: Array<{
      path: string
      used: number
      total: number
      percent: number
    }>
    uptime: number
    temperature?: number
  }
}

// Circular Gauge Component
function CircularGauge({ value, label, unit = '%', max = 100 }: { value: number; label: string; unit?: string; max?: number }) {
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (value / max) * circumference;

  let fillClass = 'low';
  if (value > 75) fillClass = 'high';
  else if (value > 50) fillClass = 'medium';

  return (
    <div className="gauge-container">
      <div className="gauge">
        <svg viewBox="0 0 100 100">
          <circle className="gauge-background" cx="50" cy="50" r="42" />
          <circle
            className={`gauge-fill ${fillClass}`}
            cx="50"
            cy="50"
            r="42"
            style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
          />
        </svg>
        <div className="gauge-label">
          <div className="gauge-value">{value.toFixed(1)}</div>
          <div className="gauge-unit">{unit}</div>
        </div>
      </div>
      <span style={{ fontSize: '0.85em', color: '#a0a3a8' }}>{label}</span>
    </div>
  )
}

export default function SystemStats({ data }: SystemStatsProps) {
  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 ** 3)
    return gb.toFixed(2) + ' GB'
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${minutes}m`
  }

  return (
    <div className="card">
      <h2 className="card-title">📊 System Stats</h2>

      {/* Top row: CPU and Memory Gauges */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <CircularGauge value={data.cpu} label="CPU Usage" unit="%" />
        <CircularGauge value={data.memory.percent} label="Memory" unit="%" />
      </div>

      {/* Divider */}
      <div style={{ borderBottom: '1px solid #3a3f4f', marginBottom: '16px' }}></div>

      {/* Uptime & Temperature */}
      <div className="stat">
        <span className="stat-label">System Uptime</span>
        <span className="stat-value">{formatUptime(data.uptime)}</span>
      </div>

      {data.temperature && (
        <div className="stat">
          <span className="stat-label">CPU Temperature</span>
          <span className="stat-value">{data.temperature.toFixed(1)}°C</span>
        </div>
      )}

      {/* Memory Details */}
      <div className="stat">
        <span className="stat-label">Memory Usage Details</span>
        <div style={{ fontSize: '0.9em', color: '#a0a3a8', marginTop: '8px' }}>
          {formatBytes(data.memory.used)} / {formatBytes(data.memory.total)}
        </div>
      </div>

      {/* Disk Usage */}
      {data.disk.length > 0 && (
        <div className="stat">
          <span className="stat-label">Disk Usage</span>
          {data.disk.map((disk, idx) => (
            <div key={idx} style={{ marginTop: idx === 0 ? '12px' : '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9em' }}>
                <span>{disk.path}</span>
                <span style={{ color: '#e4e6eb', fontWeight: 600 }}>{disk.percent.toFixed(1)}%</span>
              </div>
              <div className="stat-bar">
                <div
                  className="stat-fill"
                  style={{ width: `${disk.percent}%` }}
                ></div>
              </div>
              <div style={{ fontSize: '0.85em', color: '#a0a3a8' }}>
                {formatBytes(disk.used)} / {formatBytes(disk.total)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
