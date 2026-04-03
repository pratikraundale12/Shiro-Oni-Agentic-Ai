import sqlite3
import json
import os
import logging
from datetime import datetime
from core.config import config

class MemoryService:
    def __init__(self):
        self.logger = logging.getLogger("MemoryService")
        self._init_db()

    def _get_conn(self):
        return sqlite3.connect(config.MEMORY_DB_PATH)

    def _init_db(self):
        conn = self._get_conn()
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
        conn.close()

    def remember(self, category: str, key: str, value: str):
        """Saves a preference or fact to long-term memory."""
        conn = self._get_conn()
        conn.execute(
            "INSERT OR REPLACE INTO memory (category, key, value, timestamp) VALUES (?, ?, ?, ?)",
            (category, key, str(value), datetime.now().isoformat())
        )
        conn.commit()
        conn.close()
        return f"I will remember that {key} is {value}, sir."

    def recall(self, key: str):
        """Retrieves a value from long-term memory."""
        conn = self._get_conn()
        cursor = conn.cursor()
        cursor.execute("SELECT value FROM memory WHERE key LIKE ?", (f"%{key}%",))
        row = cursor.fetchone()
        conn.close()
        if row:
            return f"I recall that {key} is {row[0]}."
        return f"I don't have a memory for {key}."

    def log_command(self, command: str):
        """Logs every user command for habit learning."""
        conn = self._get_conn()
        conn.execute("INSERT INTO command_log (command, timestamp) VALUES (?, ?)",
                     (command, datetime.now().isoformat()))
        conn.commit()
        conn.close()

    def get_context_for(self, prompt: str):
        """Injects relevant memories into the cognition layer context."""
        # Simple fuzzy search for keywords in prompt
        # In a real JARVIS, this would use vector embeddings.
        keywords = prompt.split()
        relevant_memories = []
        conn = self._get_conn()
        cursor = conn.cursor()
        for kw in keywords:
            if len(kw) < 4: continue
            cursor.execute("SELECT key, value FROM memory WHERE key LIKE ?", (f"%{kw}%",))
            res = cursor.fetchall()
            for r in res:
                relevant_memories.append(f"{r[0]}: {r[1]}")
        conn.close()
        if relevant_memories:
            return "\n[Relevant Memories]:\n" + "\n".join(list(set(relevant_memories)))
        return ""

# Singleton instance
memory = MemoryService()
