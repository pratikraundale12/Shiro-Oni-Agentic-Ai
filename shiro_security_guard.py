"""
Shiro Security Guard
Protects destructive actions (delete, kill, terminal) with a Secret Word challenge.
"""
import logging
import os

LOG_FILE = "shiro_activity.log"
logging.basicConfig(filename=LOG_FILE, level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

class ShiroSecurityGuard:
    def __init__(self):
        self.secret_word = "white ghost" # Default secret word
        self.is_authenticated = False

    def challenge(self, user_input):
        """Verifies if the user input matches the secret word."""
        if user_input.lower().strip() == self.secret_word:
            self.is_authenticated = True
            return True
        return False

    def reset(self):
        self.is_authenticated = False

    def is_protected(self, action):
        """Returns True if the action requires authentication."""
        protected_actions = ["delete_file", "kill_heavy_processes", "execute_terminal", "manage_file (delete)"]
        return action in protected_actions

# Singleton
security_guard = ShiroSecurityGuard()

def verify_action(action, user_provided_secret=""):
    if security_guard.is_protected(action):
        if security_guard.challenge(user_provided_secret):
            logging.info(f"Security: Action '{action}' authorized.")
            return True
        logging.warning(f"Security: Unauthorized attempt at '{action}'.")
        return False
    return True
