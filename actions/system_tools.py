import os
import subprocess
import shutil
import psutil
import pyautogui
import logging
import json
import threading
import time
from urllib.parse import quote
from actions.tool_registry import tool
from core.config import config

# --- Application Management ---

@tool("open_app", "Opens any application on Linux (e.g. chrome, terminal, files).")
def open_app(app_name: str):
    """Opens a known application on Linux."""
    aliases = {
        "chrome": "google-chrome",
        "google chrome": "google-chrome",
        "brave": "brave-browser",
        "firefox": "firefox",
        "calculator": "gnome-calculator",
        "calendar": "gnome-calendar",
        "terminal": "gnome-terminal",
        "files": "nautilus",
        "editor": "gedit"
    }
    
    app_lower = app_name.lower().strip()
    binary_name = aliases.get(app_lower, app_lower)
    
    if not shutil.which(binary_name):
        # Fallback 1: Check browser suffix
        if shutil.which(f"{binary_name}-browser"):
            binary_name = f"{binary_name}-browser"
        else:
            # Fallback 2: Prefix search
            found = False
            for path in os.environ["PATH"].split(os.pathsep):
                if os.path.isdir(path):
                    for file in os.listdir(path):
                        if file.startswith(binary_name) and os.access(os.path.join(path, file), os.X_OK):
                            binary_name = file
                            found = True
                            break
                if found: break
            if not found:
                return f"I could not find {app_name} on your system, sir."
            
    try:
        env = os.environ.copy()
        # Ensure display is correct
        if "REAL_DISPLAY" in env:
            env["DISPLAY"] = env["REAL_DISPLAY"]
        elif "WAYLAND_DISPLAY" not in env:
            env["DISPLAY"] = ":0" 
            
        subprocess.Popen([binary_name], env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        # Buffer for browser focus
        if any(b in binary_name for b in ["chrome", "brave", "firefox"]):
            time.sleep(2.5)
            
        return f"Opening {app_name} now."
    except Exception as e:
        return f"Failed to open {app_name}: {e}"

@tool("close_app", "Closes a running application (e.g. chrome, firefox).")
def close_app(app_name: str):
    """Closes a known application on Linux."""
    aliases = {
        "chrome": "chrome",
        "google chrome": "chrome",
        "brave": "brave",
        "firefox": "firefox",
        "terminal": "gnome-terminal"
    }
    app_lower = app_name.lower().strip()
    process_name = aliases.get(app_lower, app_lower)
    
    try:
        subprocess.run(["pkill", "-f", process_name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return f"I have closed {app_name}."
    except Exception as e:
        return f"Failed to close {app_name}: {e}"

# --- Web & Browser ---

@tool("search_google", "Searches the web for a given query.")
def search_google(query: str):
    """Searches the web visually by opening a new browser tab."""
    try:
        url = "https://www.google.com/search?q=" + quote(query)
        env = os.environ.copy()
        if "REAL_DISPLAY" in env: env["DISPLAY"] = env["REAL_DISPLAY"]
        subprocess.Popen(["xdg-open", url], env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return f"Searching for {query} now."
    except Exception as e:
        return "I encountered an error accessing the web."

@tool("open_url", "Opens a specific URL directly in the default browser.")
def open_url(url: str):
    """Opens a specific URL directly."""
    try:
        if not url.startswith("http"): url = "https://" + url
        env = os.environ.copy()
        if "REAL_DISPLAY" in env: env["DISPLAY"] = env["REAL_DISPLAY"]
        subprocess.Popen(["xdg-open", url], env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return f"Opening {url}."
    except Exception:
        return "Failed to open URL."

# --- System Controls ---

@tool("get_system_report", "Returns current system CPU, RAM, and Disk health.")
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

@tool("take_screenshot", "Captures a screenshot of the main display.")
def take_screenshot():
    """Takes a screenshot using standard Linux tools."""
    try:
        env = os.environ.copy()
        if "REAL_DISPLAY" in env: env["DISPLAY"] = env["REAL_DISPLAY"]
        subprocess.Popen(["gnome-screenshot"], env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return "Screenshot captured, sir."
    except Exception:
        return "Failed to trigger the screenshot."

@tool("mute_volume", "Toggles the system volume mute/unmute state.")
def mute_volume():
    """Toggles system audio via AMixer."""
    try:
        subprocess.run(["amixer", "-D", "pulse", "sset", "Master", "1+", "toggle"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return "System audio toggled."
    except Exception:
        return "Error adjusting audio."

# --- Keyboard & Mouse ---

@tool("type_text", "Types text into the active window.")
def type_text(text: str):
    """Types text using the keyboard."""
    try:
        pyautogui.write(text)
        return f"Typed content successfully."
    except Exception:
        return "Failed to type."

@tool("press_key", "Presses a specific key (e.g. enter, space, tab).")
def press_key(key: str):
    """Presses a single key."""
    try:
        pyautogui.press(key)
        return f"Pressed '{key}'."
    except Exception:
        return f"Failed to press '{key}'."

@tool("wait", "Waits for a specified duration in seconds.")
def wait(seconds: float):
    """Waits for a duration."""
    time.sleep(float(seconds))
    return f"Waited {seconds} seconds."

# --- Terminal ---

@tool("execute_terminal", "Runs a shell command. DANGEROUS - Requires confirmation.")
def execute_terminal(command: str):
    """Executes a bash terminal command."""
    try:
        result = subprocess.run(command, shell=True, text=True, capture_output=True, timeout=10)
        return "Command executed. Status: " + ("Success" if result.returncode == 0 else "Error") + "\n" + result.stdout[:200]
    except Exception as e:
        return f"Execution failed: {str(e)}"
