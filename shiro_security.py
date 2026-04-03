"""
Shiro Security Module - Permission Gates, Auth, and Activity Undo Log
Confirms dangerous actions before executing, maintains an undo stack,
and enforces admin-level PIN for sensitive operations.
"""
import json
import os
import logging
import hashlib
from datetime import datetime
from pathlib import Path

logging.basicConfig(filename='shiro_activity.log', level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

UNDO_LOG_PATH = os.path.join(os.path.dirname(__file__), "shiro_undo_log.json")
PREFS_PATH = os.path.join(os.path.dirname(__file__), "shiro_security_prefs.json")

# ------------------------------------------------------------
# Actions that require explicit voice/text confirmation
# ------------------------------------------------------------
DANGEROUS_ACTIONS = {
    "delete_file", "manage_file", "execute_terminal",
    "send_email", "bulk_rename", "clean_temp_files",
    "kill_heavy_processes", "close_application"
}

# Actions that require the admin PIN
ADMIN_ACTIONS = {
    "execute_terminal", "send_email"
}

def _load_prefs():
    if os.path.exists(PREFS_PATH):
        with open(PREFS_PATH) as f:
            return json.load(f)
    return {"pin_hash": None, "safe_mode": False}

def _save_prefs(prefs):
    with open(PREFS_PATH, "w") as f:
        json.dump(prefs, f, indent=2)

def set_admin_pin(pin: str):
    """Sets or updates the admin PIN (stored as a SHA-256 hash)."""
    prefs = _load_prefs()
    prefs["pin_hash"] = hashlib.sha256(pin.encode()).hexdigest()
    _save_prefs(prefs)
    logging.info("Action: set_admin_pin | PIN updated")
    return "Admin PIN has been set. I will ask for it before executing sensitive commands."

def verify_pin(pin: str) -> bool:
    """Returns True if the given PIN matches the stored hash."""
    prefs = _load_prefs()
    if not prefs.get("pin_hash"):
        return True  # No PIN set — allow all
    return hashlib.sha256(pin.encode()).hexdigest() == prefs["pin_hash"]

def is_dangerous(action: str) -> bool:
    return action.lower() in DANGEROUS_ACTIONS

def requires_admin(action: str) -> bool:
    return action.lower() in ADMIN_ACTIONS

def enable_safe_mode():
    """Enables safe mode — blocks ALL dangerous actions without confirmation."""
    prefs = _load_prefs()
    prefs["safe_mode"] = True
    _save_prefs(prefs)
    logging.info("Action: safe_mode | ENABLED")
    return "Safe mode enabled. I will block all potentially dangerous actions."

def disable_safe_mode():
    """Disables safe mode."""
    prefs = _load_prefs()
    prefs["safe_mode"] = False
    _save_prefs(prefs)
    logging.info("Action: safe_mode | DISABLED")
    return "Safe mode disabled."

def is_safe_mode() -> bool:
    return _load_prefs().get("safe_mode", False)

# ------------------------------------------------------------
# Undo Log
# ------------------------------------------------------------
def _load_undo_log():
    if os.path.exists(UNDO_LOG_PATH):
        with open(UNDO_LOG_PATH) as f:
            return json.load(f)
    return []

def _save_undo_log(log):
    with open(UNDO_LOG_PATH, "w") as f:
        json.dump(log[-50:], f, indent=2)  # Keep last 50 entries

def log_undo_action(action: str, details: dict, undo_hint: str = ""):
    """Records an action to the undo stack."""
    log = _load_undo_log()
    log.append({
        "action": action,
        "details": details,
        "undo_hint": undo_hint,
        "timestamp": datetime.now().isoformat()
    })
    _save_undo_log(log)

def get_last_action():
    """Returns the last logged action."""
    log = _load_undo_log()
    if log:
        last = log[-1]
        return f"Last action was '{last['action']}' at {last['timestamp']}. Hint: {last.get('undo_hint', 'No undo available')}."
    return "No actions logged yet."

def get_activity_log(limit=10):
    """Returns the most recent actions from the undo log."""
    log = _load_undo_log()
    if not log:
        return "No activity logged."
    recent = log[-limit:][::-1]
    lines = [f"- {e['timestamp'][:19]}: {e['action']} — {e.get('undo_hint','')}" for e in recent]
    return "Recent activity:\n" + "\n".join(lines)
