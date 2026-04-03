import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env at the very beginning
load_dotenv()

class Config:
    # --- System & Directories ---
    BASE_DIR = Path(__file__).resolve().parent.parent
    APP_NAME = "J.A.R.V.I.S."
    VERSION = "2.0.0"
    
    # --- LLM Settings ---
    OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
    LOCAL_MODEL = os.getenv("LOCAL_MODEL", "llama3.1:latest")
    CLOUD_PROVIDER = os.getenv("SHIRO_CLOUD_PROVIDER", "groq")
    CLOUD_API_KEY = os.getenv("SHIRO_CLOUD_API_KEY")
    
    # --- Speech Settings ---
    VOICE_MODEL = "en-GB-RyanNeural" # Premium British accent
    VOICE_RATE = "+15%"
    LOCAL_TTS_RATE = 180
    STT_PAUSE_THRESHOLD = 0.8
    STT_NON_SPEAKING_DURATION = 0.5
    STT_PHRASE_TIME_LIMIT = 10
    
    # --- Monitor Thresholds ---
    MONITOR_THRESHOLDS = {
        "cpu": 85,     # % CPU
        "ram": 88,     # % RAM
        "disk": 90,    # % Disk
        "temp": 85,    # °C CPU temperature
    }
    MONITOR_INTERVAL = 30 # seconds
    
    # --- Performance Settings ---
    AUTO_CLEAN_INTERVAL_HOURS = 6
    TOP_PROCESS_LIMIT = 5
    
    # --- Security & Paths ---
    UNDO_LOG_PATH = BASE_DIR / "shiro_undo_log.json"
    SECURITY_PREFS_PATH = BASE_DIR / "shiro_security_prefs.json"
    ACTIVITY_LOG_PATH = BASE_DIR / "shiro_activity.log"
    MEMORY_DB_PATH = BASE_DIR / "shiro_memory.db"
    SCHEDULE_FILE = BASE_DIR / "shiro_schedule.json"
    
    # --- Dangerous Actions (from shiro_security) ---
    DANGEROUS_ACTIONS = {
        "delete_file", "manage_file", "execute_terminal",
        "send_email", "bulk_rename", "clean_temp_files",
        "kill_heavy_processes", "close_application"
    }
    
    ADMIN_ACTIONS = {
        "execute_terminal", "send_email"
    }

# Global config instance
config = Config()
