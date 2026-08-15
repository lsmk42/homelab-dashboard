import './Pages.css'

export default function SettingsPage() {
  const handleRefreshInterval = (e: React.ChangeEvent<HTMLSelectElement>) => {
    localStorage.setItem('refreshInterval', e.target.value)
    window.location.reload()
  }

  const handleTheme = (e: React.ChangeEvent<HTMLSelectElement>) => {
    localStorage.setItem('theme', e.target.value)
    window.location.reload()
  }

  const refreshInterval = localStorage.getItem('refreshInterval') || '5000'
  const theme = localStorage.getItem('theme') || 'dark'

  return (
    <div className="page">
      <div className="page-header">
        <h2>Settings</h2>
        <p>Configure your dashboard</p>
      </div>

      <div className="settings-container">
        <div className="settings-section">
          <h3>Display</h3>

          <div className="settings-item">
            <label>Theme</label>
            <select value={theme} onChange={handleTheme}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>

          <div className="settings-item">
            <label>Refresh Interval (ms)</label>
            <select value={refreshInterval} onChange={handleRefreshInterval}>
              <option value="3000">3 seconds</option>
              <option value="5000">5 seconds</option>
              <option value="10000">10 seconds</option>
              <option value="30000">30 seconds</option>
              <option value="60000">1 minute</option>
            </select>
            <small>How often the dashboard updates with fresh data</small>
          </div>
        </div>

        <div className="settings-section">
          <h3>API Configuration</h3>

          <div className="settings-item">
            <label>Backend URL</label>
            <input
              type="text"
              value="http://localhost:5001"
              readOnly
              disabled
            />
            <small>Backend API endpoint</small>
          </div>
        </div>

        <div className="settings-section">
          <h3>About</h3>

          <div className="settings-item">
            <label>Dashboard Version</label>
            <span className="version-text">1.0.0</span>
          </div>

          <div className="settings-item">
            <label>Status</label>
            <span className="status-text">✓ Running</span>
          </div>

          <div className="settings-item">
            <p className="about-text">
              Homelab Dashboard is a modern monitoring solution for your homelab infrastructure.
              Built with React & TypeScript (frontend) and Python Flask (backend).
            </p>
          </div>
        </div>

        <div className="settings-section">
          <h3>Advanced</h3>

          <div className="settings-item">
            <button className="btn-danger" onClick={() => {
              if (confirm('Clear all cached data?')) {
                localStorage.clear()
                window.location.reload()
              }
            }}>
              Clear Cache
            </button>
            <small>Clears all stored settings and cached data</small>
          </div>

          <div className="settings-item">
            <button className="btn-primary" onClick={() => {
              window.location.reload()
            }}>
              Reload Dashboard
            </button>
            <small>Refresh the entire application</small>
          </div>
        </div>
      </div>
    </div>
  )
}
