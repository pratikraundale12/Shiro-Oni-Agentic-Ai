import os
import smtplib
from email.message import EmailMessage
import psutil
import pyautogui
from googlesearch import search
import subprocess
import logging
import json
import threading

# Setup Activity Log
logging.basicConfig(filename='shiro_activity.log', level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s - %(message)s')

from shiro_recorder import recorder
from shiro_security_guard import verify_action

def log_action(action, details):
    logging.info(f"Action: {action} | Details: {details}")

def get_system_status():
    """Returns CPU, RAM, and Disk usage."""
    cpu = psutil.cpu_percent(interval=1)
    ram = psutil.virtual_memory().percent
    disk = psutil.disk_usage('/').percent
    stats = f"CPU is at {cpu} percent, Memory is at {ram} percent, and Disk usage is {disk} percent."
    log_action("get_system_status", stats)
    return stats

def open_application(app_name):
    """Opens a known application on Linux."""
    import shutil
    import os
    
    aliases = {
        "chrome": "google-chrome",
        "google chrome": "google-chrome",
        "brave": "brave-browser",
        "bra": "brave-browser",
        "firefox": "firefox",
        "calculator": "gnome-calculator",
        "calendar": "gnome-calendar",
        "terminal": "gnome-terminal",
        "files": "nautilus",
        "editor": "gedit"
    }
    
    app_lower = app_name.lower().strip()
    binary_name = aliases.get(app_lower, app_lower)
    
    if not shutil.which(binary_name):
        # Fallback 1: Check browser suffix
        if shutil.which(f"{binary_name}-browser"):
            binary_name = f"{binary_name}-browser"
        # Fallback 2: Check for any binary starting with this name (Prefix search)
        else:
            import os
            found = False
            for path in os.environ["PATH"].split(os.pathsep):
                if os.path.isdir(path):
                    for file in os.listdir(path):
                        if file.startswith(binary_name) and os.access(os.path.join(path, file), os.X_OK):
                            binary_name = file
                            found = True
                            break
                if found: break
            
            if not found:
                return f"I could not find the application {app_name} on your system, sir."
            
    try:
        # Popen doesn't block the Python script
        # Restore real display to prevent it opening invisibly inside Xvfb
        env = os.environ.copy()
        if "REAL_DISPLAY" in env:
            env["DISPLAY"] = env["REAL_DISPLAY"]
        elif "WAYLAND_DISPLAY" not in env:
            env["DISPLAY"] = ":0" 
            
        subprocess.Popen([binary_name], env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        log_action("open_application", f"Started {binary_name}")
        
        # Give browsers time to open and take focus before the next step types into them
        browser_binaries = {"google-chrome", "brave-browser", "firefox", "chromium-browser", "chromium"}
        if binary_name in browser_binaries:
            import time as _t
            _t.sleep(2.5)
        
        return f"Opening {app_name} now."
    except Exception as e:
        return f"Failed to open {app_name}."

def execute_terminal(command, secret=""):
    """Executes a bash terminal command. DANGEROUS."""
    if not verify_action("execute_terminal", secret):
        return "Unauthorized: Terminal access requires the Secret Word, sir."
    
    log_action("execute_terminal", f"Running: {command}")
    try:
        result = subprocess.run(command, shell=True, text=True, capture_output=True, timeout=10)
        return "Command executed successfully. " + (result.stdout[:100] if result.stdout else "")
    except subprocess.TimeoutExpired:
         return "The command took too long to execute and was killed."
    except Exception as e:
        return f"Error executing command: {e}"

def close_application(app_name):
    """Closes a known application on Linux."""
    aliases = {
        "chrome": "chrome",
        "google chrome": "chrome",
        "brave": "brave",
        "firefox": "firefox",
        "calculator": "gnome-calculator",
        "calendar": "gnome-calendar",
        "terminal": "gnome-terminal",
        "files": "nautilus"
    }
    app_lower = app_name.lower().strip()
    process_name = aliases.get(app_lower, app_lower)
    
    try:
        subprocess.run(["pkill", "-f", process_name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        log_action("close_application", f"Killed {process_name}")
        return f"I have closed {app_name}."
    except Exception as e:
        return f"Failed to close {app_name}."

def search_google(query):
    """Searches the web visually by opening a new browser tab."""
    import urllib.parse
    log_action("search_google", f"Query: {query}")
    try:
        url = "https://www.google.com/search?q=" + urllib.parse.quote(query)
        env = os.environ.copy()
        if "REAL_DISPLAY" in env:
            env["DISPLAY"] = env["REAL_DISPLAY"]
        elif "WAYLAND_DISPLAY" not in env:
            env["DISPLAY"] = ":0"
            
        subprocess.Popen(["xdg-open", url], env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return f"I am opening a search for {query} now."
    except Exception as e:
        return "I am having trouble accessing the internet to search right now."

def kill_heavy_processes(threshold_percent=50, secret=""):
    """Finds and kills non-essential processes using more than threshold% CPU."""
    if not verify_action("kill_heavy_processes", secret):
        return "Unauthorized: Killing processes requires the Secret Word, sir."
        
    safe = {"python3", "python", "ollama", "bash", "sshd", "systemd", "Xorg"}
    try:
        subprocess.run(["amixer", "-D", "pulse", "sset", "Master", "1+", "toggle"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return "I have toggled your system audio."
    except Exception as e:
        return "I encountered an error trying to adjust your audio."
        
def mute_volume():
    """Toggles the system volume mute state using AMixer."""
    log_action("mute_volume", "Toggled system audio")
    try:
        subprocess.run(["amixer", "-D", "pulse", "sset", "Master", "1+", "toggle"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return "I have toggled your system audio."
    except Exception as e:
        return "I encountered an error trying to adjust your audio."
        
def take_screenshot():
    """Takes a screenshot of the main display."""
    log_action("take_screenshot", "Captured screen")
    try:
        # Check display env to make sure it captures the real screen, not the virtual one
        env = os.environ.copy()
        if "REAL_DISPLAY" in env:
            env["DISPLAY"] = env["REAL_DISPLAY"]
        elif "WAYLAND_DISPLAY" not in env:
            env["DISPLAY"] = ":0"
            
        # Using gnome-screenshot as it is standard on Ubuntu
        subprocess.Popen(["gnome-screenshot"], env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return "Screenshot captured, sir."
    except Exception:
        return "Failed to trigger the screenshot."

def control_media(action):
    """Controls media playback (play, pause, next, previous)."""
    log_action("control_media", action)
    try:
        if action in ["play-pause", "next", "previous", "stop"]:
            subprocess.run(["playerctl", action], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            return f"Media {action} successful."
        else:
            return "Unknown media action."
    except Exception:
        return "Failed to control media. Make sure a player is active."

def control_brightness(action, level=None):
    """Controls screen brightness."""
    log_action("control_brightness", f"{action} {level if level else ''}")
    try:
        if action == "increase":
            subprocess.run(["brightnessctl", "set", "+10%"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            return "Brightness increased."
        elif action == "decrease":
            subprocess.run(["brightnessctl", "set", "10%-"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            return "Brightness decreased."
        elif action == "set" and level:
            subprocess.run(["brightnessctl", "set", f"{level}%"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            return f"Brightness set to {level} percent."
        else:
            return "Unknown brightness action."
    except Exception:
        return "Failed to adjust brightness."

def solve_math(expression):
    """Safely evaluates a math expression string."""
    import numexpr
    try:
        result = numexpr.evaluate(expression)
        return f"The answer to {expression} is {result}."
    except Exception:
        return f"I was unable to calculate {expression}."

def send_email(to_address, subject, content):
    """Sends a basic email using SMTP. Requires configuration."""
    # Placeholder credentials - User should fill these or we can ask later
    SMTP_SERVER = "smtp.gmail.com"
    SMTP_PORT = 587
    SENDER_EMAIL = "your-email@gmail.com"
    SENDER_PASSWORD = "your-app-password"
    
    msg = EmailMessage()
    msg.set_content(content)
    msg['Subject'] = subject
    msg['From'] = SENDER_EMAIL
    msg['To'] = to_address

    try:
        # Commenting out actual send until user provides credentials
        # with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        #     server.starttls()
        #     server.login(SENDER_EMAIL, SENDER_PASSWORD)
        #     server.send_message(msg)
        log_action("send_email", f"Drafted email to {to_address}")
        return f"Email to {to_address} has been drafted. Please configure your SMTP credentials to send it automatically, sir."
    except Exception as e:
        return f"Failed to send email: {e}"

def schedule_task(task_description, delay_seconds):
    """Schedules a basic task to run after a delay."""
    import time
    def delayed_task():
        time.sleep(delay_seconds)
        log_action("schedule_task", f"Executed: {task_description}")
        print(f"\n[SCHEDULED TASK] {task_description}")
        
    threading.Thread(target=delayed_task).start()
    return f"I have scheduled that task for {delay_seconds} seconds from now, sir."

def switch_window():
    """Switches between windows using Alt+Tab."""
    log_action("switch_window", "Triggered Alt+Tab")
    pyautogui.hotkey('alt', 'tab')
    return "Switching windows now."

def open_url(url):
    """Opens a specific URL directly."""
    log_action("open_url", url)
    try:
        env = os.environ.copy()
        if "REAL_DISPLAY" in env:
            env["DISPLAY"] = env["REAL_DISPLAY"]
        subprocess.Popen(["xdg-open", url], env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return f"Opening {url}."
    except Exception:
        return "Failed to open URL."

def press_key(key):
    """Presses a single key."""
    log_action("press_key", key)
    try:
        pyautogui.press(key)
        return f"Pressed {key}."
    except Exception:
        return f"Failed to press {key}."

def type_text(text):
    """Types text using the keyboard."""
    log_action("type_text", text)
    try:
        pyautogui.write(text)
        return f"Typed: {text}"
    except Exception:
        return f"Failed to type: {text}"

def wait(seconds):
    """Waits for a specified duration."""
    import time
    log_action("wait", f"{seconds}s")
    time.sleep(float(seconds))
    return f"Waited {seconds} seconds."

def click(x=None, y=None):
    """Clicks at current or specific location."""
    log_action("click", f"at {x},{y}" if x else "at current pos")
    try:
        if x and y:
            pyautogui.click(int(x), int(y))
        else:
            pyautogui.click()
        return "Clicked."
    except Exception:
        return "Failed to click."

def manage_file(action, file_path, content="", secret=""):
    """Creates, or deletes files."""
    if action == "delete" and not verify_action("manage_file (delete)", secret):
        return "Unauthorized: Deleting files requires the Secret Word, sir."
        
    log_action("manage_file", f"{action} on {file_path}")
    try:
        if action == "create":
            with open(file_path, "w") as f:
                f.write(content)
            return f"I have created the file at {file_path}, sir."
        elif action == "delete":
            if os.path.exists(file_path):
                os.remove(file_path)
                return f"I have deleted the file at {file_path}, sir."
            else:
                return "That file does not exist, sir."
        else:
            return "Unknown file operation."
    except Exception as e:
        return f"File operation failed: {e}"

def map_intent_to_tool(json_intent):
    """
    Parses a JSON intent from the LLM and routes it to the correct Python automation tool.
    Expected JSON schema: {"action": "open_app", "args": {"app_name": "firefox"}}
    """
    try:
        # Capture for Watch & Learn (Phase 3)
        recorder.add_step(json_intent)
        
        intent = json.loads(json_intent)
        action = str(intent.get("action", "")).lower()
        args = intent.get("args", {})
        
        # KEY-AGNOSTIC EXTRACTION
        # Check top-level, then nested args/params/kwargs for diverse models
        def omni_get(target_keys):
            # 1. Top level
            raw_val = None
            for k, v in intent.items():
                if k != "action" and any(tk == k.lower() for tk in target_keys):
                    raw_val = v
                    break
            
            # 2. Nested containers
            if not raw_val:
                for container_key in ["args", "params", "parameters", "kwargs", "data", "inputs"]:
                    container = intent.get(container_key, {})
                    if isinstance(container, dict):
                        for k, v in container.items():
                            if any(tk in k.lower() for tk in target_keys):
                                raw_val = v
                                break
                    if raw_val: break

            # 3. Path Normalization (10/10 Polish)
            if raw_val and any(tk in ["path", "file", "folder", "dir"] for tk in target_keys):
                import os
                home = os.path.expanduser("~")
                # Swap common hallucinations for the real HOME
                hallucinated_prefixes = ["/home/user", "/Users/username", "/home/username"]
                for p in hallucinated_prefixes:
                    if str(raw_val).startswith(p):
                        raw_val = str(raw_val).replace(p, home)
            
            return raw_val
        
        def normalize_app(name):
            """Strip .exe and normalize Windows-style names to Linux equivalents."""
            if not name: return ""
            name = str(name).strip()
            if name.endswith(".exe"): name = name[:-4]
            win_to_linux = {
                "chrome": "google-chrome", "brave": "brave-browser",
                "explorer": "nautilus", "notepad": "gedit",
                "cmd": "gnome-terminal", "search_browser": "brave-browser",
            }
            return win_to_linux.get(name.lower(), name)


        app = omni_get(["app", "application", "binary", "program", "target"])
        text_val = omni_get(["res", "text", "msg", "say", "talk", "response"])
        cmd = omni_get(["command", "cmd", "terminal", "script", "bash"])
        query = omni_get(["query", "search", "google", "find", "q"])
        
        if action in ["talk", "chat", "respond", "name", "say", "answer"]:
            return text_val if text_val else "Yes, sir?"
            
        elif action in ["open_application", "open_app", "open", "run", "launch", "start", "switch", "go to"]:
            return open_application(normalize_app(app))
            
        elif action in ["close_application", "close_app", "close", "kill", "stop", "exit", "terminate"]:
            return close_application(normalize_app(app))
            
        elif action in ["execute_terminal", "execute_command", "terminal", "cmd", "run_command", "bash"]:
            return execute_terminal(cmd, omni_get(["secret", "password", "code"]))
            
        elif action in ["search_google", "search", "google", "web", "find", "search_browser"]:
             return search_google(query or text_val)
             
        elif action in ["mute_volume", "mute", "unmute", "volume", "sound", "audio"]:
             return mute_volume()
             
        elif action in ["take_screenshot", "screenshot", "capture", "snap", "camera"]:
             return take_screenshot()
             
        elif action in ["solve_math", "math", "calculate", "compute"]:
             return solve_math(omni_get(["expr", "math", "calc"]))
             
        elif action in ["manage_file", "file", "create_file", "delete_file"]:
             from shiro_filesystem import manage_file
             return manage_file(omni_get(["op", "action", "command"]), omni_get(["path", "file"]), omni_get(["content", "text"]), omni_get(["secret", "password"]))
             
        elif action in ["control_media", "media", "music", "play", "pause", "player"]:
             return control_media(omni_get(["op", "action", "cmd", "play"]))
             
        elif action in ["control_brightness", "brightness", "dim", "light", "screen"]:
             return control_brightness(omni_get(["op", "action", "cmd"]), omni_get(["level", "percent", "val"]))
             
        elif action in ["open_url", "url", "link"]:
             return open_url(omni_get(["url", "link", "target"]))
             
        elif action in ["type_text", "type", "write", "input"]:
             return type_text(text_val or omni_get(["text", "input", "content"]))
             
        elif action in ["press_key", "press", "key"]:
             return press_key(omni_get(["key", "button", "press"]))
             
        elif action in ["wait", "sleep", "pause"]:
             secs = omni_get(["seconds", "time", "duration"])
             return wait(float(secs) if secs else 1)
             
        elif action in ["click", "tap"]:
             return click(omni_get(["x"]), omni_get(["y"]))
             
        elif action in ["open_app", "open_application"]:
             return open_application(app)

        # --- Shiro Vision Actions ---
        elif action in ["read_screen", "read_screen_text", "ocr", "what_on_screen"]:
             from shiro_vision import read_screen_text
             return read_screen_text()
             
        elif action in ["click_text", "click_button"]:
             from shiro_vision import click_text_on_screen
             return click_text_on_screen(omni_get(["text", "target", "button"]))
             
        elif action in ["find_icon", "locate_icon", "visual_search"]:
             from shiro_vision import find_icon
             return find_icon(omni_get(["icon", "name", "target"]))
             
        # --- Shiro Memory Actions ---
        elif action in ["remember", "save_preference"]:
             from shiro_memory import remember
             return remember(omni_get(["cat", "category"]) or "general", omni_get(["key"]), omni_get(["val", "value"]))
             
        elif action in ["list_workflows", "show_workflows"]:
             from shiro_memory import list_workflows
             return list_workflows()
             
        elif action in ["frequent_commands", "habits", "suggest"]:
             from shiro_memory import get_frequent_commands
             return get_frequent_commands()

        elif action in ["recall", "get_memory", "what_is", "who_is"]:
             from shiro_memory import recall
             return recall(omni_get(["key", "name", "query"]))

        # --- Shiro Browser Actions ---
        elif action in ["open_url_in_browser", "open_in_browser", "browse"]:
             from shiro_browser import open_url_in_browser
             return open_url_in_browser(omni_get(["url", "link"]), omni_get(["browser"]) or "brave")

        elif action in ["open_new_tab", "new_tab"]:
             from shiro_browser import open_new_tab
             return open_new_tab(omni_get(["url", "link"]))

        elif action in ["close_tab", "close_current_tab"]:
             from shiro_browser import close_current_tab
             return close_current_tab()

        elif action in ["switch_tab", "next_tab"]:
             from shiro_browser import switch_to_next_tab
             return switch_to_next_tab()

        elif action in ["scrape_page", "extract_web", "read_page"]:
             from shiro_browser import scrape_page_text
             return scrape_page_text(omni_get(["url", "link"]))

        # --- Shiro File System Actions ---
        elif action in ["organize_desktop", "clean_desktop"]:
             from shiro_filesystem import organize_desktop
             return organize_desktop()

        elif action in ["create_folder", "mkdir"]:
             from shiro_filesystem import create_folder
             return create_folder(omni_get(["path", "folder", "name"]))

        elif action in ["smart_file_search", "find_file", "search_file"]:
             from shiro_filesystem import smart_file_search
             return smart_file_search(omni_get(["name", "query", "file"]))

        elif action in ["bulk_rename", "rename_files"]:
             from shiro_filesystem import bulk_rename
             return bulk_rename(omni_get(["folder", "path"]), omni_get(["prefix", "name"]))

        elif action in ["find_duplicates", "detect_duplicates"]:
             from shiro_filesystem import find_duplicates
             return find_duplicates(omni_get(["folder", "path"]) or "~")

        elif action in ["backup_file", "backup"]:
             from shiro_filesystem import backup_file
             return backup_file(omni_get(["source", "file", "path"]))

        # --- Shiro Monitor Actions ---
        elif action in ["get_system_report", "system_status", "health_check", "how_is_system"]:
             from shiro_monitor import get_system_report
             return get_system_report()

        elif action in ["get_alerts", "check_alerts", "warnings", "system_warnings"]:
             from shiro_monitor import get_alerts
             return get_alerts()

        elif action in ["kill_heavy_processes", "free_memory", "kill_heavy"]:
             from shiro_monitor import kill_heavy_processes
             return kill_heavy_processes(secret=omni_get(["secret", "password"]))

        elif action in ["clean_temp_files", "clean_temp", "free_disk", "cleanup"]:
             from shiro_monitor import clean_temp_files
             return clean_temp_files()

        # --- Shiro Knowledge Base Actions ---
        elif action in ["ask_knowledge_base", "ask_docs", "search_docs", "ask_document"]:
             from shiro_knowledge import ask_knowledge_base
             return ask_knowledge_base(omni_get(["question", "query", "q", "ask"]) or query)

        elif action in ["index_document", "add_document", "learn_document"]:
             from shiro_knowledge import index_document
             return index_document(omni_get(["path", "file"]))

        elif action in ["list_docs", "list_documents", "show_knowledge"]:
             from shiro_knowledge import list_indexed_docs
             return list_indexed_docs()

        # --- Shiro Security Actions ---
        elif action in ["set_pin", "set_admin_pin", "change_pin"]:
             from shiro_security import set_admin_pin
             return set_admin_pin(omni_get(["pin", "code", "password"]))

        elif action in ["enable_safe_mode", "safe_mode_on"]:
             from shiro_security import enable_safe_mode
             return enable_safe_mode()

        elif action in ["disable_safe_mode", "safe_mode_off"]:
             from shiro_security import disable_safe_mode
             return disable_safe_mode()

        elif action in ["get_activity_log", "show_log", "what_did_you_do", "history"]:
             from shiro_security import get_activity_log
             return get_activity_log()

        elif action in ["last_action", "undo_hint", "what_was_last"]:
             from shiro_security import get_last_action
             return get_last_action()

        # --- Shiro Performance Actions ---
        elif action in ["list_startup_apps", "startup_apps", "what_starts_up"]:
             from shiro_performance import list_startup_apps
             return list_startup_apps()

        elif action in ["disable_startup_app", "remove_startup"]:
             from shiro_performance import disable_startup_app
             return disable_startup_app(app)

        elif action in ["optimize_memory", "clear_memory", "free_ram"]:
             from shiro_performance import optimize_memory
             return optimize_memory()

        elif action in ["get_top_processes", "top_processes", "what_is_running"]:
             from shiro_performance import get_top_processes
             return get_top_processes()

        elif action in ["start_auto_clean", "schedule_cleanup"]:
             from shiro_performance import start_auto_clean
             return start_auto_clean()

        elif action in ["execute_in_sandbox", "run_code", "python_task"]:
             from shiro_sandbox import execute_in_sandbox
             return execute_in_sandbox(omni_get(["code", "script", "text"]))

        # --- Shiro Recording Actions (Watch & Learn) ---
        elif action in ["start_recording", "watch_and_learn", "learn_this"]:
             return recorder.start_recording(omni_get(["name", "workflow", "label"]) or "unsaved_workflow")

        elif action in ["stop_recording", "save_learned", "finish_learning"]:
             return recorder.stop_recording()

        else:
             # Universal Fallback
             if app: return open_application(app)
             return "I am here, sir. How can I help?"

             
    except json.JSONDecodeError:
        logging.error(f"Failed to parse JSON intent: {json_intent}")
        if isinstance(json_intent, str) and not json_intent.strip().startswith("{") and not json_intent.strip().startswith("["):
            return f"I understand your intent, but I could not translate '{json_intent}' into a system command directly."
        return "I encountered a formatting error connecting my brain to the system tools, sir."
    except Exception as e:
        import traceback
        logging.error(f"Critical error in map_intent_to_tool: {e}\n{traceback.format_exc()}")
        return f"A critical error occurred: {str(e)}"
