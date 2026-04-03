"""
Shiro Recorder - Watch & Learn
Captures tool execution sequences and saves them as named Ghost Workflows.
"""
import json
import logging
from shiro_memory import save_workflow

LOG_FILE = "shiro_activity.log"

logging.basicConfig(filename=LOG_FILE, level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

class ShiroRecorder:
    def __init__(self):
        self.is_recording = False
        self.current_workflow_name = ""
        self.steps = []

    def start_recording(self, name):
        self.is_recording = True
        self.current_workflow_name = name
        self.steps = []
        logging.info(f"Action: start_recording | Name: {name}")
        return f"Recording started for workflow: {name}. I am watching, master."

    def add_step(self, intent_json):
        """Adds a captured tool intent to the current workflow."""
        if not self.is_recording:
            return
        try:
            step = json.loads(intent_json)
            self.steps.append(step)
            logging.info(f"Recorder: Added step to '{self.current_workflow_name}'")
        except Exception as e:
            logging.error(f"Recorder Error adding step: {e}")

    def stop_recording(self):
        if not self.is_recording:
            return "Not currently recording."
        
        if not self.steps:
            self.is_recording = False
            return "Recording stopped, but no steps were captured."

        save_workflow(self.current_workflow_name, self.steps, f"Auto-recorded workflow '{self.current_workflow_name}'")
        self.is_recording = False
        name = self.current_workflow_name
        count = len(self.steps)
        self.current_workflow_name = ""
        self.steps = []
        logging.info(f"Action: stop_recording | Name: {name} | Steps: {count}")
        return f"Workflow '{name}' saved with {count} steps. I have learned it, master."

# Singleton
recorder = ShiroRecorder()
