import os
import time
import logging
import asyncio
from core.event_bus import bus
from core.config import config
from cognition.llm_service import llm

class HealerDaemon:
    def __init__(self):
        self.logger = logging.getLogger("HealerDaemon")
        self.last_pos = 0
        if config.ACTIVITY_LOG_PATH.exists():
            self.last_pos = config.ACTIVITY_LOG_PATH.stat().st_size
        
        # Subscribe to system alerts
        # asyncio.run_coroutine_threadsafe(bus.subscribe("system_alert", self.on_system_alert), asyncio.get_event_loop())

    def on_system_alert(self, alert: str):
        """Reacts to system alerts from the monitor."""
        self.logger.info(f"Healer investigating alert: {alert}")
        # JARVIS-level self-healing logic can be added here
        pass

    def scan_for_errors(self):
        """Scans the activity log for recurring errors since last boot."""
        if not config.ACTIVITY_LOG_PATH.exists():
            return []

        errors = []
        with open(config.ACTIVITY_LOG_PATH, "r") as f:
            f.seek(self.last_pos)
            lines = f.readlines()
            self.last_pos = f.tell()

            for line in lines:
                if "ERROR" in line or "CRITICAL" in line or "Exception" in line:
                    errors.append(line.strip())
        return errors

    def analyze_and_fix(self, error_line: str):
        """Asks the brain to analyze the and provide a fix."""
        prompt = f"I detected this error in my logs: '{error_line}'. Analyze what went wrong and provide a concise 1-sentence explanation plus a JSON command if a fix is possible."
        system_prompt = f"You are the {config.APP_NAME} Healer Subcommittee. Be technical and precise. Output a short explanation followed by a JSON array of fix actions if applicable."
        
        analysis = llm.get_response(prompt, system_prompt)
        self.logger.info(f"Healer Analysis: {analysis}")
        return analysis

# Singleton instance
healer = HealerDaemon()
