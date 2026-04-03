"""
Shiro Memory Module - Long-Term Memory & Habit Learning
Stores user preferences, past commands, and workflows in a local SQLite DB.
"""
import sqlite3
import json
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "shiro_memory.db")

def _get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS memory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            key TEXT NOT NULL,
            value TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            UNIQUE(category, key)
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS command_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            command TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS workflows (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            steps TEXT NOT NULL,
            description TEXT,
            created_at TEXT NOT NULL
        )
    """)
    conn.commit()
    return conn

def remember(category, key, value):
    """Saves a preference or fact to long-term memory."""
    conn = _get_conn()
    conn.execute(
        "INSERT OR REPLACE INTO memory (category, key, value, timestamp) VALUES (?, ?, ?, ?)",
        (category, key, str(value), datetime.now().isoformat())
    )
    conn.commit()
    conn.close()
    return f"I will remember that {key} is {value}."

def recall(key):
    """Retrieves a value from long-term memory."""
    conn = _get_conn()
    cursor = conn.cursor()
    # Use fuzzy matching for the key
    cursor.execute("SELECT value FROM memory WHERE key LIKE ?", (f"%{key}%",))
    row = cursor.fetchone()
    conn.close()
    if row:
        return f"I recall that {key} is {row[0]}."
    return f"I don't have a memory for {key}."

def log_command(command):
    """Logs every user command for habit learning."""
    conn = _get_conn()
    conn.execute("INSERT INTO command_log (command, timestamp) VALUES (?, ?)",
                 (command, datetime.now().isoformat()))
    conn.commit()
    conn.close()

def get_frequent_commands(limit=5):
    """Returns the most frequently used commands."""
    conn = _get_conn()
    rows = conn.execute("""
        SELECT command, COUNT(*) as count FROM command_log
        GROUP BY command ORDER BY count DESC LIMIT ?
    """, (limit,)).fetchall()
    conn.close()
    if rows:
        suggestions = ", ".join([f"'{r[0]}'" for r in rows])
        return f"Your most common commands are: {suggestions}."
    return "No command history yet."

def save_workflow(name, steps_list, description=""):
    """Saves a named automation workflow (list of steps)."""
    conn = _get_conn()
    conn.execute(
        "INSERT OR REPLACE INTO workflows (name, steps, description, created_at) VALUES (?, ?, ?, ?)",
        (name, json.dumps(steps_list), description, datetime.now().isoformat())
    )
    conn.commit()
    conn.close()
    return f"Workflow '{name}' saved with {len(steps_list)} steps, sir."

def load_workflow(name):
    """Loads a saved workflow by name."""
    conn = _get_conn()
    row = conn.execute("SELECT steps FROM workflows WHERE name=?", (name,)).fetchone()
    conn.close()
    if row:
        return json.loads(row[0])
    return None

def list_workflows():
    """Lists all saved workflows."""
    conn = _get_conn()
    rows = conn.execute("SELECT name, description FROM workflows").fetchall()
    conn.close()
    if rows:
        return "Saved workflows: " + ", ".join([f"'{r[0]}'" for r in rows])
    return "No workflows saved yet."
