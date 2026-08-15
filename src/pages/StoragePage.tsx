import { useEffect, useState } from 'react'
import './Pages.css'

interface DiskInfo {
  path: string
  used: number
  total: number
  percent: number
}

export default function StoragePage() {
  const [disks, setDisks] = useState<DiskInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStorage = async () => {
      try {
        const response = await fetch('/api/system')
        const data = await response.json()
        setDisks(data.disk || [])
      } catch (err) {
        console.error('Failed to fetch storage info:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStorage()
    const interval = setInterval(fetchStorage, 5000)
    return () => clearInterval(interval)
  }, [])

  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 ** 3)
    return gb.toFixed(2) + ' GB'
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Storage</h2>
        <p>Monitor your disk usage and storage</p>
      </div>

      {loading ? (
        <div className="page-loading">Loading storage info...</div>
      ) : disks.length === 0 ? (
        <div className="page-empty">
          <p>No storage information available</p>
        </div>
      ) : (
        <div className="storage-container">
          {disks.map((disk) => {
            const barColor = disk.percent > 90 ? '#ff6b6b' : disk.percent > 75 ? '#ffa502' : '#2ec4b6'
            return (
              <div key={disk.path} className="storage-card">
                <div className="storage-header">
                  <h3>{disk.path}</h3>
                  <span className="storage-percent">{disk.percent.toFixed(1)}%</span>
                </div>

                <div className="storage-bar-container">
                  <div className="storage-bar">
                    <div
                      className="storage-fill"
                      style={{
                        width: `${disk.percent}%`,
                        backgroundColor: barColor
                      }}
                    ></div>
                  </div>
                </div>

                <div className="storage-info">
                  <div className="info-row">
                    <span>Used</span>
                    <span className="info-value">{formatBytes(disk.used)}</span>
                  </div>
                  <div className="info-row">
                    <span>Total</span>
                    <span className="info-value">{formatBytes(disk.total)}</span>
                  </div>
                  <div className="info-row">
                    <span>Available</span>
                    <span className="info-value">{formatBytes(disk.total - disk.used)}</span>
                  </div>
                </div>

                <div className="storage-status">
                  {disk.percent > 90 && <span className="status-badge critical">⚠️ Critical</span>}
                  {disk.percent > 75 && disk.percent <= 90 && <span className="status-badge warning">⚠️ Warning</span>}
                  {disk.percent <= 75 && <span className="status-badge healthy">✓ Healthy</span>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
