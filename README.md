# 🏠 Homelab Dashboard

A modern, real-time web dashboard for monitoring your homelab infrastructure. Inspired by **Proxmox PULSE** design. Built with React + TypeScript (frontend) and Python Flask (backend).

## Features

- **Real-time System Monitoring** - CPU, Memory, Disk usage with circular gauges
- **Docker Container Management** - View container status, resource usage
- **Server Status** - Monitor multiple servers in your homelab
- **Live Updates** - Auto-refresh every 5 seconds
- **PULSE-Inspired Design** - Modern dark theme with sidebar navigation
- **Responsive Design** - Works on desktop and mobile
- **Status Indicators** - Color-coded health status (green/yellow/red)

## Design

The dashboard features a modern PULSE (Proxmox) inspired design with:
- **Left Sidebar Navigation** - Quick access to different sections
- **Top Navbar** - Status indicators and connection status
- **Circular Gauges** - Visual representation of CPU and Memory usage
- **Color Scheme** - Dark theme with orange/red accent colors
- **Status Badges** - Real-time service status with visual indicators

## Project Structure

```
homelab-dashboard/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx       # Main dashboard component
│   │   ├── SystemStats.tsx     # System metrics with gauges
│   │   ├── DockerContainers.tsx # Docker container list
│   │   ├── ServerStatus.tsx    # Server status display
│   │   └── Card.css            # Shared component styles
│   ├── App.tsx                 # Root component with sidebar
│   ├── App.css                 # App layout and sidebar styles
│   ├── main.tsx                # React entry point
│   └── index.css               # Global styles
├── backend.py                  # Python Flask backend server
├── requirements.txt            # Python dependencies
├── package.json                # Node.js dependencies
├── vite.config.ts              # Vite config
├── tsconfig.json               # TypeScript config
├── index.html                  # HTML entry point
└── README.md                   # This file
```

## Setup

### Prerequisites

- Node.js 14+ and npm
- Python 3.7+
- Docker (optional, for Docker container monitoring)

### Frontend Setup

1. Install Node.js dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. Create a Python virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Start the backend server:
```bash
python backend.py
```

The backend will be available at `http://localhost:5001`

## Configuration

### Adding Custom Servers

Edit the `get_server_status()` function in `backend.py` to add servers you want to monitor:

```python
servers.append({
    'name': 'NAS Server',
    'hostname': '192.168.1.100',
    'online': True,
    'lastChecked': datetime.now().isoformat(),
    'services': ['NFS', 'Plex']
})
```

### Docker Integration

The dashboard automatically detects Docker if it's installed and running. To use Docker monitoring:

1. Ensure Docker daemon is running
2. Make sure the current user has Docker permissions:
   ```bash
   sudo usermod -aG docker $USER
   ```

### Environment Variables

Create a `.env` file (optional):
```
VITE_API_URL=http://localhost:5001
VITE_REFRESH_INTERVAL=5000
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/dashboard` - All dashboard data
- `GET /api/system` - System stats only
- `GET /api/docker` - Docker containers only
- `GET /api/servers` - Server status only

## Building for Production

### Frontend Build
```bash
npm run build
```

Output will be in the `dist/` directory. Serve with any static web server.

### Backend Deployment

For production, use a WSGI server like Gunicorn:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5001 backend:app
```

## Customization

### Adding New Metrics

1. Add data collection in `backend.py`
2. Create a new component in `src/components/`
3. Import and add it to `Dashboard.tsx`

### Styling

- Global styles: `src/index.css`
- Component-specific: Each component has its own `.css` file
- Shared component styles: `src/components/Card.css`
- Color variables are defined in `:root` in `App.css`

### Color Scheme

Customize the colors by editing the CSS variables in `src/App.css`:

```css
:root {
  --primary: #ff6b35;        /* Orange accent */
  --secondary: #ff9e40;      /* Light orange */
  --success: #2ec4b6;        /* Teal/Green */
  --warning: #ffa502;        /* Amber */
  --danger: #ff6b6b;         /* Red */
  --dark-bg: #0f1419;        /* Background */
  --dark-surface: #1a1f2e;   /* Surface */
  --dark-card: #242d3f;      /* Card background */
}
```

## Troubleshooting

**Dashboard shows "Disconnected"**
- Ensure backend is running: `python backend.py`
- Check if port 5001 is accessible (was previously 5000 but changed due to macOS AirPlay)
- Look for CORS issues in browser console

**Docker containers not showing**
- Verify Docker daemon is running: `docker ps`
- Check Docker permissions for current user
- Backend will gracefully handle missing Docker

**High CPU/Memory usage**
- Increase refresh interval in `Dashboard.tsx` (currently 5 seconds)
- Optimize backend queries for large container counts

## Future Enhancements

- [ ] WebSocket support for true real-time updates
- [ ] Persistent storage for historical data
- [ ] Grafana integration
- [ ] Container control (start/stop/restart)
- [ ] NAS/SMB monitoring
- [ ] Alerting and notifications
- [ ] Multi-user support with authentication
- [ ] Custom dashboard layouts
- [ ] Dark/Light theme toggle
- [ ] Export metrics to Prometheus

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!
