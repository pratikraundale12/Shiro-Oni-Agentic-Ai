import re
import json
import logging
from core.event_bus import bus
from core.config import config
from actions.tool_registry import registry
from cognition.llm_service import llm
from core.event_bus import bus

class IntentRouter:
    def __init__(self):
        self.logger = logging.getLogger("IntentRouter")
        
    async def route(self, user_input: str):
        """Routing system logic: Fast path (regex) then Slow path (LLM)."""
        input_lower = user_input.lower().strip()
        
        # --- FAST PATH: Regex/Keyword Classifier ---
        # 1. App Launching
        match = re.search(r"^(open|launch|run|start)\s+([a-zA-Z0-9\s]+)$", input_lower)
        if match:
             app = match.group(2).strip()
             return {"action": "open_app", "args": {"app_name": app}}
             
        # 2. System Status
        if any(w in input_lower for w in ["system status", "health report", "how are you doing", "system report"]):
            return {"action": "get_system_report", "args": {}}
            
        # 3. Simple Search
        match = re.search(r"^(search|google|find|look up)\s+(.+)$", input_lower)
        if match:
             query = match.group(2).strip()
             return {"action": "search_google", "args": {"query": query}}
             
        # 4. Media/Volume
        if "mute" in input_lower or "sound" in input_lower:
            return {"action": "mute_volume", "args": {}}
            
        # --- SLOW PATH: LLM Cognition ---
        self.logger.info("Fast path failed. Routing to LLM...")
        return await self._ask_llm(user_input)

    async def _ask_llm(self, prompt: str):
        """Uses the LLM brain to decide the intent."""
        # Get actual tool schemas to prevent hallucination
        tool_schemas = json.dumps(registry.get_tool_schemas(), indent=2)
        
        system_prompt = f"""You are {config.APP_NAME}, a sentient autonomous AI entity. 
Current environment: LINUX. Master: {os.getlogin()}.

Your mission is to serve your master with 10/10 elite precision. 

OUTPUT FORMAT:
- THINKING: Briefly state your internal reasoning/logic.
- EXECUTION: A single valid JSON object with 'action' and 'args'.

Available Actions:
{tool_schemas}

If no tool is a direct match, use the 'talk' action to respond naturally."""

        reply = llm.get_response(prompt, system_prompt)
        
        # Parse Thinking vs Execution
        try:
            if "EXECUTION:" in reply:
                execution_json = reply.split("EXECUTION:")[1].strip()
                intent = json.loads(execution_json)
                return intent
            else:
                # Direct JSON fallback
                return json.loads(reply)
        except Exception:
            # Fallback to talk 
            return {"action": "talk", "args": {"text": reply}}

# Central instance
router = IntentRouter()
