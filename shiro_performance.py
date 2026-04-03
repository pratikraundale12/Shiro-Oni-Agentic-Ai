"""
Shiro Performance Module - Auto-optimization and Startup Management
Scheduled cleanup, startup app management, and system optimization routines.
"""
import os
import subprocess
import logging
import threading
import time
import psutil
from pathlib import Path

logging.basicConfig(filename='shiro_activity.log', level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

_scheduler_thread = None
_scheduler_running = False

# -------------------------------------------------------
# Startup Optimization
# -------------------------------------------------------
def list_startup_apps():
    """Lists apps that launch at startup (autostart entries on Ubuntu)."""
    autostart_dir = Path.home() / ".config" / "autostart"
    if not autostart_dir.exists():
        return "No custom autostart applications found."
    apps = [f.stem for f in autostart_dir.glob("*.desktop")]
    if apps:
        return "Startup applications: " + ", ".join(apps)
    return "No custom startup apps found."

def disable_startup_app(app_name):
    """Disables a startup application by removing its .desktop entry."""
    autostart_dir = Path.home() / ".config" / "autostart"
    target = autostart_dir / f"{app_name}.desktop"
    if target.exists():
        target.unlink()
        logging.info(f"Action: disable_startup_app | {app_name}")
        return f"Disabled '{app_name}' from startup."
    return f"No startup entry found for '{app_name}'."

# -------------------------------------------------------
# Memory & CPU Optimization
# -------------------------------------------------------
def optimize_memory():
    """Drops filesystem cache to free up RAM (requires sudo or drops page cache)."""
    try:
        # Try user-level memory pressure reduction first
        result = subprocess.run(
            ["bash", "-c", "sync && echo 3 | sudo -n tee /proc/sys/vm/drop_caches 2>/dev/null || true"],
            capture_output=True, text=True, timeout=5
        )
        ram = psutil.virtual_memory()
        logging.info("Action: optimize_memory | Done")
        return f"Memory optimization attempted. RAM now at {ram.percent:.0f}%."
    except Exception as e:
        return f"Memory optimization encountered an issue: {e}"

def get_top_processes(limit=5):
    """Returns the top CPU-consuming processes."""
    procs = []
    for p in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
        try:
            procs.append(p.info)
        except Exception:
            pass
    # Sort by CPU
    procs = sorted(procs, key=lambda x: x.get('cpu_percent', 0), reverse=True)[:limit]
    lines = [f"{p['name']} (PID {p['pid']}): CPU {p['cpu_percent']:.1f}% | RAM {p['memory_percent']:.1f}%"
             for p in procs]
    return "Top processes:\n" + "\n".join(lines)

# -------------------------------------------------------
# Scheduled Auto-Clean
# -------------------------------------------------------
def _auto_clean_loop(interval_hours=6):
    """Background thread that auto-cleans temp files on a schedule."""
    global _scheduler_running
    while _scheduler_running:
        time.sleep(interval_hours * 3600)
        if _scheduler_running:
            from shiro_monitor import clean_temp_files
            result = clean_temp_files()
            logging.info(f"Scheduled auto-clean: {result}")

def start_auto_clean(interval_hours=6):
    """Starts the scheduled auto-clean background task."""
    global _scheduler_thread, _scheduler_running
    if _scheduler_running:
        return "Auto-clean scheduler is already running."
    _scheduler_running = True
    _scheduler_thread = threading.Thread(
        target=_auto_clean_loop, args=(interval_hours,), daemon=True
    )
    _scheduler_thread.start()
    logging.info(f"Action: start_auto_clean | every {interval_hours}h")
    return f"Auto-clean scheduled every {interval_hours} hours."

def stop_auto_clean():
    """Stops the scheduled auto-clean."""
    global _scheduler_running
    _scheduler_running = False
    logging.info("Action: stop_auto_clean | Stopped")
    return "Auto-clean scheduler stopped."
