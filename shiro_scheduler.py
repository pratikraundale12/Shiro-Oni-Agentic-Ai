"""
Shiro Scheduler - Proactive Alert System
Manages a local schedule and provides proactive reminders to the master.
"""
import json
import os
import logging
from datetime import datetime, timedelta

SCHEDULE_FILE = "shiro_schedule.json"
logging.basicConfig(filename='shiro_activity.log', level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

class ShiroScheduler:
    def __init__(self):
        if not os.path.exists(SCHEDULE_FILE):
            with open(SCHEDULE_FILE, "w") as f:
                json.dump([], f)

    def add_event(self, title, time_str, description=""):
        """Adds an event. time_str format: YYYY-MM-DD HH:MM"""
        with open(SCHEDULE_FILE, "r") as f:
            schedule = json.load(f)
        
        schedule.append({
            "title": title,
            "time": time_str,
            "description": description,
            "notified": False
        })
        
        with open(SCHEDULE_FILE, "w") as f:
            json.dump(schedule, f, indent=2)
        return f"Event '{title}' scheduled for {time_str}."

    def check_for_proactive_alerts(self):
        """Checks if any events are happening in the next 15 minutes."""
        with open(SCHEDULE_FILE, "r") as f:
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
            with open(SCHEDULE_FILE, "w") as f:
                json.dump(schedule, f, indent=2)
        
        return alerts

def get_proactive_reminders():
    scheduler = ShiroScheduler()
    return scheduler.check_for_proactive_alerts()

if __name__ == "__main__":
    s = ShiroScheduler()
    # Add a mock event for testing (10 mins from now)
    test_time = (datetime.now() + timedelta(minutes=10)).strftime("%Y-%m-%d %H:%M")
    print(s.add_event("Focus Session", test_time, "Work on Shiro Oni v1.2"))
    print(f"Alerts: {s.check_for_proactive_alerts()}")
