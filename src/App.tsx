import { useEffect, useState } from 'react'
import './App.css'
import Dashboard from './components/Dashboard'
import ServersPage from './pages/ServersPage'
import ContainersPage from './pages/ContainersPage'
import StoragePage from './pages/StoragePage'
import SettingsPage from './pages/SettingsPage'

function App() {
  const [connected, setConnected] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'servers' | 'containers' | 'storage' | 'settings'>('dashboard')

  useEffect(() => {
    // Check if backend is available
    fetch('/api/health')
      .then(() => setConnected(true))
      .catch(() => setConnected(false))
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case 'servers':
        return <ServersPage />
      case 'containers':
        return <ContainersPage />
      case 'storage':
        return <StoragePage />
      case 'settings':
        return <SettingsPage />
      default:
        return <Dashboard />
    }
  }

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      servers: 'Servers',
      containers: 'Containers',
      storage: 'Storage',
      settings: 'Settings',
    }
    return titles[currentPage] || 'Dashboard'
  }

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">◊</span>
            <span className="logo-text">Homelab</span>
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
        </div>
        <nav className="sidebar-nav">
          <a
            href="#"
            className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setCurrentPage('dashboard') }}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-label">Dashboard</span>
          </a>
          <a
            href="#"
            className={`nav-item ${currentPage === 'servers' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setCurrentPage('servers') }}
          >
            <span className="nav-icon">🖥️</span>
            <span className="nav-label">Servers</span>
          </a>
          <a
            href="#"
            className={`nav-item ${currentPage === 'containers' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setCurrentPage('containers') }}
          >
            <span className="nav-icon">🐳</span>
            <span className="nav-label">Containers</span>
          </a>
          <a
            href="#"
            className={`nav-item ${currentPage === 'storage' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setCurrentPage('storage') }}
          >
            <span className="nav-icon">💾</span>
            <span className="nav-label">Storage</span>
          </a>
          <a
            href="#"
            className={`nav-item ${currentPage === 'settings' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setCurrentPage('settings') }}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-label">Settings</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-container">
        {/* Navbar */}
        <header className="navbar">
          <div className="navbar-left">
            <h1>{getPageTitle()}</h1>
          </div>
          <div className="navbar-right">
            <div className={`status-badge ${connected ? 'connected' : 'disconnected'}`}>
              <span className="status-dot"></span>
              {connected ? 'Connected' : 'Disconnected'}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="content">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

export default App
