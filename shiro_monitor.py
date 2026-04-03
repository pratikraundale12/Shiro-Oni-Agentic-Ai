"""
Shiro Monitor - Autonomous Background System Watcher
Continuously tracks CPU, RAM, Disk, and Temperature.
Auto-alerts when usage spikes and can kill heavy processes.
"""
import threading
import time
import psutil
import logging
import subprocess
import os

logging.basicConfig(filename='shiro_activity.log', level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

# Global state
_monitor_thread = None
_running = False
_alerts = []

# Thresholds
THRESHOLDS = {
    "cpu": 85,     # % CPU
    "ram": 88,     # % RAM
    "disk": 90,    # % Disk
    "temp": 85,    # °C CPU temperature
}

def _check_system():
    global _alerts
    alerts = []

    cpu = psutil.cpu_percent(interval=1)
    ram = psutil.virtual_memory().percent
    disk = psutil.disk_usage('/').percent

    if cpu > THRESHOLDS["cpu"]:
        alerts.append(f"CPU at {cpu:.0f}% — critical!")
    if ram > THRESHOLDS["ram"]:
        alerts.append(f"RAM at {ram:.0f}% — memory pressure!")
        # Proactive: Optimize memory
        from shiro_performance import optimize_memory
        optimize_memory()
        
    if disk > THRESHOLDS["disk"]:
        alerts.append(f"Disk at {disk:.0f}% — running low!")
        # Proactive: Clean temp files
        clean_temp_files()

    # Temperature (Linux)
    try:
        temps = psutil.sensors_temperatures()
        if temps:
            for key in ["coretemp", "cpu-thermal", "acpitz"]:
                if key in temps:
                    t = temps[key][0].current
                    if t > THRESHOLDS["temp"]:
                        alerts.append(f"CPU temperature at {t}°C — overheating!")
                    break
    except Exception:
        pass

    _alerts = alerts
    if alerts:
        logging.warning(f"Monitor Alerts: {alerts}")

def _monitor_loop(interval=30):
    global _running
    while _running:
        _check_system()
        time.sleep(interval)

def start_monitoring(interval=30):
    """Starts the background system monitor thread."""
    global _monitor_thread, _running
    if _running:
        return "System monitor is already running."
    _running = True
    _monitor_thread = threading.Thread(target=_monitor_loop, args=(interval,), daemon=True)
    _monitor_thread.start()
    logging.info("Action: start_monitoring | Monitor started")
    return f"Background system monitor started. Checking every {interval} seconds."

def stop_monitoring():
    """Stops the background monitor."""
    global _running
    _running = False
    logging.info("Action: stop_monitoring | Monitor stopped")
    return "System monitor stopped."

def get_alerts():
    """Returns current system alerts."""
    if not _alerts:
        return "All systems nominal. CPU, RAM, and Disk are within safe limits."
    return "System warnings: " + "; ".join(_alerts)

def get_system_report():
    """Returns a full system health snapshot."""
    cpu = psutil.cpu_percent(interval=0.5)
    ram = psutil.virtual_memory()
    disk = psutil.disk_usage('/')
    battery = psutil.sensors_battery()

    report = (
        f"CPU: {cpu:.0f}% | "
        f"RAM: {ram.percent:.0f}% ({ram.used // (1024**3):.1f}GB used of {ram.total // (1024**3):.1f}GB) | "
        f"Disk: {disk.percent:.0f}% used"
    )
    if battery:
        report += f" | Battery: {battery.percent:.0f}%{'  (charging)' if battery.power_plugged else ''}"
    return report

def kill_heavy_processes(threshold_percent=50):
    """Finds and kills non-essential processes using more than threshold% CPU."""
    safe = {"python3", "python", "ollama", "bash", "sshd", "systemd", "Xorg"}
    killed = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent']):
        try:
            if proc.info['cpu_percent'] > threshold_percent:
                if proc.info['name'] not in safe:
                    proc.kill()
                    killed.append(proc.info['name'])
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
    if killed:
        logging.info(f"Action: kill_heavy_processes | Killed: {killed}")
        return f"Terminated heavy processes: {', '.join(killed)}."
    return "No unusually heavy processes found."

def clean_temp_files():
    """Cleans common temp file locations to free disk space."""
    locations = ["/tmp", os.path.expanduser("~/.cache/thumbnails")]
    freed = 0
    for loc in locations:
        if os.path.exists(loc):
            for root, dirs, files in os.walk(loc):
                for f in files:
                    try:
                        path = os.path.join(root, f)
                        freed += os.path.getsize(path)
                        os.remove(path)
                    except Exception:
                        pass
    mb = freed / (1024 * 1024)
    logging.info(f"Action: clean_temp_files | Freed {mb:.1f} MB")
    return f"Temp cleanup complete. Freed approximately {mb:.1f} MB."
