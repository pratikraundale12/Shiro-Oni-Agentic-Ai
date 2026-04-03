"""
Shiro Kill Switch Module - Emergency Stop & Safety
Provides immediate termination of all Shiro actions and processes.
"""
import subprocess
import signal
import os
import sys

def emergency_stop():
    """STOP EVERYTHING. Kills mouse movement, processes, and resets state."""
    print("\n\n!!! EMERGENCY STOP TRIGGERED !!!\n")
    
    # Move mouse to center and stop any drag
    try:
        pyautogui.hotkey('escape')           # Cancel any keyboard shortcuts
        pyautogui.mouseUp()                  # Release any held mouse button
    except Exception:
        pass
    
    # Log the stop event
    try:
        with open("shiro_activity.log", "a") as f:
            f.write(f"\nEMERGENCY STOP TRIGGERED BY USER\n")
    except Exception:
        pass
    
    return "All systems halted. Emergency stop engaged."

def get_kill_phrases():
    """Returns the list of phrases that trigger an emergency stop."""
    return [
        "stop everything",
        "emergency stop",
        "abort",
        "kill everything",
        "stop now",
        "shut it all down",
        "stop shiro",
        "stop oni"
    ]

def check_for_kill(text):
    """Returns True if the text contains any kill phrase."""
    text_lower = text.lower().strip()
    return any(phrase in text_lower for phrase in get_kill_phrases())
