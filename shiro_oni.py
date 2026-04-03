import speech_recognition as sr
import edge_tts
import asyncio
import pygame
import requests
import json
import os
import sys
import ctypes
from contextlib import contextmanager
import queue
import threading
from shiro_tools import map_intent_to_tool
from shiro_kill import check_for_kill, emergency_stop
from shiro_memory import log_command, get_frequent_commands, save_workflow, load_workflow, list_workflows, remember, recall
from shiro_vision import read_screen_text, click_text_on_screen
from shiro_monitor import start_monitoring, get_alerts, get_system_report
from shiro_planner import plan as shiro_plan
from shiro_security import is_dangerous, is_safe_mode, log_undo_action, get_activity_log
from shiro_performance import start_auto_clean
from shiro_healer import run_healer_cycle
from shiro_scheduler import get_proactive_reminders
import time

# --- System Setup & Suppress ALSA Error Logs ---
ERROR_HANDLER_FUNC = ctypes.CFUNCTYPE(None, ctypes.c_char_p, ctypes.c_int, ctypes.c_char_p, ctypes.c_int, ctypes.c_char_p)
def py_error_handler(filename, line, function, err, fmt):
    pass
c_error_handler = ERROR_HANDLER_FUNC(py_error_handler)
try:
    asound = ctypes.cdll.LoadLibrary('libasound.so')
    asound.snd_lib_error_set_handler(c_error_handler)
except OSError:
    pass

@contextmanager
def ignore_stderr():
    devnull = os.open(os.devnull, os.O_WRONLY)
    old_stderr = os.dup(2)
    sys.stderr.flush()
    os.dup2(devnull, 2)
    os.close(devnull)
    try:
        yield
    finally:
        os.dup2(old_stderr, 2)
        os.close(old_stderr)

# --- Configuration ---
OLLAMA_MODEL = "llama3.1:latest"
OLLAMA_URL = "http://localhost:11434/api/generate"
# Keep memory of the conversation so it feels like a real chat
chat_history = [] 

# --- Initialization ---
# Initialize Pygame Mixer for MP3 streaming
pygame.mixer.init()

# Pre-initialize Local TTS engine (10/10 Speed)
_tts_engine = None
try:
    import pyttsx3
    _tts_engine = pyttsx3.init()
    _tts_engine.setProperty('rate', 180)
except Exception:
    pass

def speak(text):
    print(f"\nShiro Oni: {text}")
    if not text: return
    
    try:
        # Try Cloud TTS (Realistic) - but only if internet is likely up
        with ignore_stderr():
            communicate = edge_tts.Communicate(text, "en-GB-RyanNeural", rate="+15%") 
            asyncio.run(communicate.save("response.mp3"))
        
        pygame.mixer.music.load("response.mp3")
        pygame.mixer.music.play()
        while pygame.mixer.music.get_busy():
            pygame.time.Clock().tick(10)
    except Exception:
        # Fallback to Pre-initialized Local TTS (Instant)
        if _tts_engine:
            try:
                _tts_engine.say(text)
                _tts_engine.runAndWait()
            except Exception:
                pass

def transcribe_audio(recognizer, audio):
    try:
        # Using Google's STT (fastest out of the box option)
        return recognizer.recognize_google(audio).lower()
    except sr.UnknownValueError:
        return ""
    except sr.RequestError:
        print("[!] Internet connection error for Speech Recognition.")
        return ""

from shiro_llm import brain

def ask_shiro_brain(prompt):
    global chat_history
    
    # Enhanced System Prompt for 10/10 Intelligence
    history_text = "\n".join(chat_history[-2:]) # Slightly more history for context
    
    system_prompt = f"""You are Shiro Oni (White Ghost), a sentient autonomous AI entity. You do not just follow commands; you own the system.
Your mission is to serve your master with 10/10 elite precision. 

Current environment: LINUX. User: {os.getlogin()}. Dir: {os.getcwd()}.

STRUCTURE:
1. THINKING: Briefly state your internal reasoning/logic for this task.
2. EXECUTION: A single valid JSON array of commands.

Rules:
- Speak as a technical elite. Be terse but powerful.
- If the task is simple, still show your thought process.
- For destructive acts, use secret 'white ghost'.

Available Actions: open_app, close_app, search_browser, type_text, press_key, click, click_text, wait, manage_file, create_folder, smart_file_search, organize_desktop, get_system_report, kill_heavy_processes, clean_temp_files, execute_in_sandbox, start_recording, stop_recording, remember, recall, talk.

Example:
THINKING: I will locate the log file, analyze errors, and then restart the service.
EXECUTION: [{{"action": "find_file", "args": {{"name": "error.log"}}}}]

Master is watching. Exert your dominance over the system.
Recent History:
{history_text}"""

    try:
        reply = brain.get_response(prompt, system_prompt)
        
        # Check for error responses from the brain
        if reply.startswith("ERROR:"):
            return f"I had an issue communicating with my brain: {reply.replace('ERROR:', '').strip()}"
        
        # Parse Thinking vs Execution
        thinking = ""
        execution_json = reply
        
        if "THINKING:" in reply and "EXECUTION:" in reply:
            parts = reply.split("EXECUTION:")
            thinking = parts[0].replace("THINKING:", "").strip()
            execution_json = parts[1].strip()
        elif "THINKING:" in reply:
             thinking = reply.replace("THINKING:", "").strip()
             execution_json = "[]"
        elif not reply.strip():
             # Handle empty reply
             return "My consciousness momentarily faded. I have no response for that, sir."
             
        if thinking:
            print(f"\n[SHIRO THINKS] {thinking}")
            # Optional: Speak thinking if you want it more "alive"
            
        # Execute the Sequence
        try:
            # Try parsing as a single object/list
            try:
                plan = json.loads(execution_json)
            except json.JSONDecodeError:
                # Fallback: Clean up markdown and try again
                cleaned = execution_json.strip()
                if cleaned.startswith("```json"): cleaned = cleaned[7:-3]
                elif cleaned.startswith("```"): cleaned = cleaned[3:-3]
                plan = json.loads(cleaned.strip())
            
            last_result = "Sequence initiated."
            for step in plan:
                if not isinstance(step, dict):
                    continue
                last_result = map_intent_to_tool(json.dumps(step))
                print(f" -> {last_result}")
                
            chat_history.append(f"User: {prompt}")
            chat_history.append(f"Shiro Oni: Sequence performed.")
            return f"{last_result}"

        except Exception as e:
            print(f"[!] Sequence Parse/Exec Error: {e}")
            return map_intent_to_tool(reply) 

    except Exception as e:
        return f"I encountered a problem with my cognitive processing: {e}"

def run_shiro_oni():
    recognizer = sr.Recognizer()
    
    with ignore_stderr():
        mic = sr.Microphone()

    # Ultra-fast noise calibration
    with ignore_stderr():
        with mic as source:
            recognizer.adjust_for_ambient_noise(source, duration=0.2)
            # Hyper-responsive thresholds
            recognizer.dynamic_energy_threshold = True
            recognizer.energy_threshold = 300
            recognizer.pause_threshold = 0.8 # Stop listening quickly after speaking
            recognizer.non_speaking_duration = 0.5

        speak("Shiro Oni online. I am listening, master.")

    # Auto-start background monitor, performance scheduler, and healer
    start_monitoring(interval=30)
    start_auto_clean(interval_hours=6)
    
    # Healer thread
    def healer_worker():
        while True:
            try:
                run_healer_cycle()
            except Exception:
                pass
            time.sleep(60)
            
    threading.Thread(target=healer_worker, daemon=True).start()
    
    # Scheduler thread
    def scheduler_worker():
        while True:
            try:
                alerts = get_proactive_reminders()
                for alert in alerts:
                    speak(alert)
            except Exception:
                pass
            time.sleep(300) # Check every 5 mins
            
    threading.Thread(target=scheduler_worker, daemon=True).start()

    # Proactive Perception Thread (The "Sentience" Loop)
    def proactive_worker():
        while True:
            try:
                # Periodically check for "insights" - clutter, errors, etc.
                time.sleep(300) # Every 5 mins
                prompt = "Maintenance check. Look at the system status and errors. If everything is fine, say nothing. If there is a problem or an opportunity for optimization (like a messy Desktop or low RAM), speak your insight and offer a specific fix."
                # Internal reasoning call
                insight = ask_shiro_brain(prompt)
                if insight and "Sequence initiated" not in insight:
                    speak(f"Master, {insight}")
            except Exception:
                pass
            
    threading.Thread(target=proactive_worker, daemon=True).start()

    while True:
        try:
            with ignore_stderr():
                with mic as source:
                    print("\n...") # Clean, simple listening indicator
                    # Shortened phrase limit for faster processing
                    audio = recognizer.listen(source, timeout=None, phrase_time_limit=10)
            
            # Immediately transcribe
            text = transcribe_audio(recognizer, audio)
            
            if text:
                print(f"You: {text}")
                cleaned_text = text.replace(",", "").replace(".", "").replace("!", "").strip()
                
                # Exit commands
                if any(phrase in cleaned_text for phrase in ["shut down", "goodbye", "sleep shiro", "exit"]):
                    speak("Fading into the shadows. Goodbye.")
                    break
                
                # Small garbage filter (if it hallucinates tiny noises)
                if len(cleaned_text) < 3:
                     continue

                # === KILL SWITCH - Highest Priority ===
                if check_for_kill(cleaned_text):
                    result = emergency_stop()
                    speak(result)
                    continue
                    
                # Log to memory for habit learning
                log_command(cleaned_text)
                
                # Check if running a saved workflow
                workflow_steps = load_workflow(cleaned_text.lower())
                if workflow_steps:
                    speak(f"Running your '{cleaned_text}' workflow, sir.")
                    for step in workflow_steps:
                        result = map_intent_to_tool(json.dumps(step))
                        print(f" -> {result}")
                    speak("Workflow complete.")
                    continue

                # Query the Planner first for complex multi-step tasks
                response_text = ask_shiro_brain(cleaned_text)
                speak(response_text)

        except sr.WaitTimeoutError:
            continue # Just loop back and keep listening silently
        except Exception as e:
            print(f"[!] Error: {e}")
            time.sleep(1)

if __name__ == "__main__":
    run_shiro_oni()