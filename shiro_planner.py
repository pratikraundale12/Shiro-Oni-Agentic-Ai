"""
Shiro Planner - Multi-Agent Command Planning Engine
Uses a smarter "Planner" model to break complex requests into structured steps,
then hands off to the fast Executor for individual tool dispatch.
"""
import requests
import json
import logging

logging.basicConfig(filename='shiro_activity.log', level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

OLLAMA_URL = "http://localhost:11434/api/generate"

# Planner uses the fastest available model for speed
PLANNER_MODEL = "llama3.1:latest"

PLANNER_PROMPT = """You are Shiro Oni, an elite autonomous AI agent. Break the user's request into a precise sequence of JSON steps.
ONLY output a JSON array. No explanation.

Available actions: open_app, close_app, open_url_in_browser, open_new_tab, search_browser,
type_text, press_key, click, click_text, wait, mute_volume, take_screenshot,
solve_math, manage_file, create_folder, organize_desktop, find_file, bulk_rename, 
backup_file, find_duplicates, read_screen, control_media, control_brightness,
get_system_report, kill_heavy_processes, clean_temp_files, get_alerts,
ask_knowledge_base, index_document, list_docs, talk.

Example: User: Open Brave, go to gmail.com and take a screenshot
Output: [
  {{"action":"open_app","app":"brave"}},
  {{"action":"wait","seconds":2}},
  {{"action":"open_url_in_browser","url":"gmail.com","browser":"brave"}},
  {{"action":"wait","seconds":2}},
  {{"action":"take_screenshot"}}
]

User: {prompt}
Output:"""

def plan(prompt):
    """
    Uses the planner model to generate a multi-step execution plan.
    Returns a list of step dicts, or None on failure.
    """
    full_prompt = PLANNER_PROMPT.format(prompt=prompt)
    try:
        r = requests.post(OLLAMA_URL, json={
            "model": PLANNER_MODEL,
            "prompt": full_prompt,
            "stream": False,
            "options": {"num_predict": 400, "temperature": 0.0, "num_thread": 8}
        }, timeout=30)
        reply = r.json().get("response", "").strip()

        # Clean up markdown brackets
        if reply.startswith("```json"): reply = reply[7:]
        if reply.startswith("```"): reply = reply[3:]
        if reply.endswith("```"): reply = reply[:-3]
        reply = reply.strip()

        plan = json.loads(reply)
        if not isinstance(plan, list):
            plan = [plan]

        logging.info(f"Action: plan | Steps: {len(plan)} for '{prompt}'")
        return plan
    except Exception as e:
        logging.warning(f"Planner failed for '{prompt}': {e}")
        return None
