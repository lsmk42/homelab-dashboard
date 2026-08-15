import { useEffect, useState } from 'react'
import './Dashboard.css'
import SystemStats from './SystemStats'
import DockerContainers from './DockerContainers'
import ServerStatus from './ServerStatus'

interface DashboardData {
  system: any
  docker: any
  servers: any
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard')
        if (!response.ok) throw new Error('Failed to fetch dashboard data')
        const dashboardData = await response.json()
        setData(dashboardData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setData(null)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5000) // Refresh every 5 seconds

    return () => clearInterval(interval)
  }, [])

  if (error) {
    return <div className="dashboard-error">Error: {error}</div>
  }

  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        {data?.system && <SystemStats data={data.system} />}
        {data?.docker && <DockerContainers data={data.docker} />}
        {data?.servers && <ServerStatus data={data.servers} />}
      </div>
    </div>
  )
}
