import os
import json
import psutil
import shutil
import subprocess
from datetime import datetime
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_system_stats():
    """Get CPU, memory, disk, and temperature stats"""
    try:
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()

        disk_stats = []
        for partition in psutil.disk_partitions():
            try:
                usage = psutil.disk_usage(partition.mountpoint)
                disk_stats.append({
                    'path': partition.mountpoint,
                    'used': usage.used,
                    'total': usage.total,
                    'percent': usage.percent
                })
            except PermissionError:
                continue

        uptime = datetime.now().timestamp() - psutil.boot_time()

        # Try to get temperature (Linux only)
        temperature = None
        try:
            temps = psutil.sensors_temperatures()
            if temps:
                cpu_temps = temps.get('coretemp') or temps.get('acpitz')
                if cpu_temps:
                    temperature = cpu_temps[0].current
        except:
            pass

        return {
            'cpu': cpu_percent,
            'memory': {
                'used': memory.used,
                'total': memory.total,
                'percent': memory.percent
            },
            'disk': disk_stats,
            'uptime': int(uptime),
            'temperature': temperature
        }
    except Exception as e:
        print(f"Error getting system stats: {e}")
        return {}

def get_docker_containers():
    """Get Docker container information"""
    try:
        docker_executable = shutil.which('docker') or os.path.join(
            os.environ.get('LOCALAPPDATA', ''),
            'Programs', 'DockerDesktop', 'resources', 'bin', 'docker.exe'
        )
        result = subprocess.run([docker_executable, 'ps', '-a', '--format', '{{json .}}'],
                              capture_output=True, text=True, timeout=5)

        containers = []
        running_count = 0

        if result.returncode == 0 and result.stdout:
            for line in result.stdout.strip().split('\n'):
                if not line:
                    continue
                try:
                    container = json.loads(line)
                    status = 'running' if container['State'] == 'running' else 'stopped' if container['State'] == 'exited' else 'paused'
                    if status == 'running':
                        running_count += 1

                    containers.append({
                        'id': container['ID'][:12],
                        'name': container['Names'].split(',')[0] if ',' in container['Names'] else container['Names'],
                        'status': status,
                        'image': container['Image'],
                        'cpuPercent': 0.0,  # Would need docker stats for real values
                        'memoryPercent': 0.0,
                        'memoryMB': 0,
                        'ports': container['Ports'].split(', ') if container['Ports'] else []
                    })
                except json.JSONDecodeError:
                    continue

        return {
            'containers': containers,
            'totalCount': len(containers),
            'runningCount': running_count
        }
    except (FileNotFoundError, subprocess.TimeoutExpired):
        return {'containers': [], 'totalCount': 0, 'runningCount': 0}
    except Exception as e:
        print(f"Error getting docker containers: {e}")
        return {'containers': [], 'totalCount': 0, 'runningCount': 0}

def get_server_status():
    """Get status of configured servers (via ping or API)"""
    # This is a placeholder - you can configure servers in a config file
    servers = []

    # Example: Check localhost
    servers.append({
        'name': 'Local Machine',
        'hostname': 'localhost',
        'online': True,
        'lastChecked': datetime.now().isoformat(),
        'services': ['Docker', 'System']
    })

    return {
        'servers': servers,
        'onlineCount': sum(1 for s in servers if s['online'])
    }

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

@app.route('/api/dashboard', methods=['GET'])
def dashboard():
    return jsonify({
        'system': get_system_stats(),
        'docker': get_docker_containers(),
        'servers': get_server_status()
    })

@app.route('/api/system', methods=['GET'])
def system():
    return jsonify(get_system_stats())

@app.route('/api/docker', methods=['GET'])
def docker():
    return jsonify(get_docker_containers())

@app.route('/api/servers', methods=['GET'])
def servers():
    return jsonify(get_server_status())

if __name__ == '__main__':
    print("Starting Homelab Dashboard Backend...")
    print("Server running at http://localhost:5001")
    app.run(debug=True, host='0.0.0.0', port=5001)
