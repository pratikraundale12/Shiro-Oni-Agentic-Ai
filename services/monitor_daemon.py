import threading
import time
import psutil
import logging
import asyncio
from core.event_bus import bus
from core.config import config

class MonitorDaemon:
    def __init__(self):
        self.logger = logging.getLogger("MonitorDaemon")
        self._running = False
        self._thread = None
        
    def start(self, interval=config.MONITOR_INTERVAL):
        """Starts background system monitoring."""
        if self._running: return
        self._running = True
        self._thread = threading.Thread(target=self._monitor_loop, args=(interval,), daemon=True)
        self._thread.start()
        self.logger.info("MonitorDaemon started.")

    def _monitor_loop(self, interval):
        while self._running:
            try:
                self._check_system()
            except Exception as e:
                self.logger.error(f"Execution error in monitor loop: {e}")
            time.sleep(interval)

    def _check_system(self):
        cpu = psutil.cpu_percent(interval=1)
        ram = psutil.virtual_memory().percent
        disk = psutil.disk_usage('/').percent
        
        alerts = []
        if cpu > config.MONITOR_THRESHOLDS["cpu"]:
            alerts.append(f"CPU at {cpu:.0f}% — critical!")
        if ram > config.MONITOR_THRESHOLDS["ram"]:
            alerts.append(f"RAM at {ram:.0f}% — memory pressure!")
        if disk > config.MONITOR_THRESHOLDS["disk"]:
            alerts.append(f"Disk at {disk:.0f}% — running low!")

        for alert in alerts:
            self.logger.warning(f"System Alert: {alert}")
            # Immediately publish to the bus for reactive modules
            asyncio.run_coroutine_threadsafe(bus.publish("system_alert", alert), asyncio.get_event_loop())

# Singleton instance
monitor = MonitorDaemon()
