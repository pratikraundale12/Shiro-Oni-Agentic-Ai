"""
Shiro Healer - The Auto-Debugger & Fixer
Monitors logs for errors and uses the brain to suggest or apply fixes.
"""
import os
import time
import logging
from shiro_llm import brain

LOG_FILE = "shiro_activity.log"

logging.basicConfig(filename=LOG_FILE, level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

class ShiroHealer:
    def __init__(self):
        self.last_pos = 0
        if os.path.exists(LOG_FILE):
             self.last_pos = os.path.getsize(LOG_FILE)

    def scan_for_errors(self):
        """Scans the log for new error entries since the last check."""
        if not os.path.exists(LOG_FILE):
            return []

        errors = []
        with open(LOG_FILE, "r") as f:
            f.seek(self.last_pos)
            lines = f.readlines()
            self.last_pos = f.tell()

            for line in lines:
                if "ERROR" in line or "CRITICAL" in line or "Exception" in line:
                    errors.append(line.strip())
        return errors

    def analyze_and_fix(self, error_line):
        """Asks the brain to analyze the error and provide a fix or explanation."""
        print(f"\n[SHIRO HEALER] Detecting anomaly: {error_line}")
        
        prompt = f"I detected this error in my logs: '{error_line}'. Analyze what went wrong and provide a concise 1-sentence explanation plus a JSON command if a fix is possible (e.g., restart a service or clean a directory)."
        
        system_prompt = "You are the Shiro Healer subcommittee. Be technical and precise. Output a short explanation followed by a JSON array of fix actions if applicable."
        
        analysis = brain.get_response(prompt, system_prompt)
        print(f"[SHIRO HEALER] Analysis: {analysis}")
        return analysis

def run_healer_cycle():
    """A single cycle of log scanning and healing."""
    healer = ShiroHealer()
    errors = healer.scan_for_errors()
    for err in errors:
        healer.analyze_and_fix(err)

if __name__ == "__main__":
    # Test cycle
    run_healer_cycle()
