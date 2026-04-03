import json
import os
import logging
from datetime import datetime, timedelta
from core.config import config

class SchedulerService:
    def __init__(self):
        self.logger = logging.getLogger("SchedulerService")
        self._init_schedule()

    def _init_schedule(self):
        if not config.SCHEDULE_FILE.exists():
            with open(config.SCHEDULE_FILE, "w") as f:
                json.dump([], f)

    def add_event(self, title, time_str, description=""):
        """Adds an event. time_str format: YYYY-MM-DD HH:MM"""
        with open(config.SCHEDULE_FILE, "r") as f:
            schedule = json.load(f)
        
        schedule.append({
            "title": title,
            "time": time_str,
            "description": description,
            "notified": False
        })
        
        with open(config.SCHEDULE_FILE, "w") as f:
            json.dump(schedule, f, indent=2)
        return f"Event '{title}' scheduled for {time_str}, sir."

    def check_for_proactive_alerts(self):
        """Checks if any events are happening in the next 15 minutes."""
        if not config.SCHEDULE_FILE.exists(): return []
        
        with open(config.SCHEDULE_FILE, "r") as f:
            schedule = json.load(f)
        
        now = datetime.now()
        threshold = now + timedelta(minutes=15)
        
        alerts = []
        updated = False
        for event in schedule:
            if not event["notified"]:
                try:
                    event_time = datetime.strptime(event["time"], "%Y-%m-%d %H:%M")
                    if now <= event_time <= threshold:
                        alerts.append(f"Master, you have a meeting: '{event['title']}' in {int((event_time - now).total_seconds() // 60)} minutes.")
                        event["notified"] = True
                        updated = True
                except ValueError:
                    continue
        
        if updated:
            with open(config.SCHEDULE_FILE, "w") as f:
                json.dump(schedule, f, indent=2)
        
        return alerts

# Singleton instance
scheduler = SchedulerService()
