import json
import logging
import requests
from core.config import config
from actions.tool_registry import registry
from cognition.llm_service import llm

class Planner:
    def __init__(self):
        self.logger = logging.getLogger("Planner")

    async def plan(self, user_request: str):
        """Breaks a complex request into a multi-step execution plan."""
        tool_schemas = json.dumps(registry.get_tool_schemas(), indent=2)
        
        system_prompt = f"""You are the {config.APP_NAME} Strategic Planner.
Break the user's request into a precise sequence of JSON steps.
ONLY output a JSON array of objects. No explanation.

Available Actions Schema:
{tool_schemas}

Example:
User: Open Brave, go to gmail.com and take a screenshot
Output: [
  {{"action":"open_app","args": {{"app_name":"brave"}}}},
  {{"action":"wait","args": {{"seconds":2}}}},
  {{"action":"open_url","args": {{"url":"gmail.com"}}}},
  {{"action":"wait","args": {{"seconds":2}}}},
  {{"action":"take_screenshot","args": {{}}}}
]"""

        try:
            reply = llm.get_response(user_request, system_prompt)
            
            # Clean up markdown brackets
            if reply.startswith("```json"): reply = reply[7:]
            if reply.startswith("```"): reply = reply[3:]
            if reply.endswith("```"): reply = reply[:-3]
            reply = reply.strip()

            plan_list = json.loads(reply)
            if not isinstance(plan_list, list):
                plan_list = [plan_list]

            self.logger.info(f"Generated plan with {len(plan_list)} steps.")
            return plan_list
        except Exception as e:
            self.logger.error(f"Planner failed: {e}")
            return None

# Singleton instance
planner = Planner()
