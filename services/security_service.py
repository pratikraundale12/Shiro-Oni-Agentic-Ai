import functools
import hashlib
import json
import os
import logging
from datetime import datetime
from core.config import config

class SecurityService:
    def __init__(self):
        self.logger = logging.getLogger("SecurityService")
        self._pin_hash = self._load_pin()
        self.safe_mode = self._load_safe_mode()
        
    def _load_pin(self):
        if config.SECURITY_PREFS_PATH.exists():
            with open(config.SECURITY_PREFS_PATH) as f:
                return json.load(f).get("pin_hash")
        return None

    def _load_safe_mode(self):
        if config.SECURITY_PREFS_PATH.exists():
            with open(config.SECURITY_PREFS_PATH) as f:
                return json.load(f).get("safe_mode", False)
        return False

    def _save_prefs(self):
        prefs = {"pin_hash": self._pin_hash, "safe_mode": self.safe_mode}
        with open(config.SECURITY_PREFS_PATH, "w") as f:
            json.dump(prefs, f, indent=2)

    def set_admin_pin(self, pin: str):
        """Sets or updates the admin PIN."""
        self._pin_hash = hashlib.sha256(pin.encode()).hexdigest()
        self._save_prefs()
        return "Admin PIN updated successfully."

    def verify_pin(self, pin: str) -> bool:
        """Verifies given PIN against stored hash."""
        if not self._pin_hash: return True # allow if no pin set
        return hashlib.sha256(pin.encode()).hexdigest() == self._pin_hash

    def require_auth(self, func):
        """Decorator for tools requiring authentication."""
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            # This will be used in the tool dispatching layer 
            # to check if the user provided the secret.
            # In a real voice JARVIS, this might trigger a prompt.
            action_name = func.__name__
            if action_name in config.ADMIN_ACTIONS or self.safe_mode:
                # For now, let's just log it. The actual prompt will move to main JARVIS loop.
                self.logger.warning(f"Auth required for action: {action_name}")
            return func(*args, **kwargs)
        return wrapper

# Singleton instance
security = SecurityService()
