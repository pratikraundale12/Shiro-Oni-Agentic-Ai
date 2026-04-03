import requests
import json
import os
import logging
from typing import List, Dict, Union
from core.config import config

class LLMService:
    def __init__(self):
        self.logger = logging.getLogger("LLMService")
        # Rolling conversation history (10 turns)
        self.history: List[Dict[str, str]] = []
        self.max_history = 10
        
    def add_to_history(self, role: str, content: str):
        self.history.append({"role": role, "content": content})
        if len(self.history) > self.max_history * 2:
            self.history = self.history[-self.max_history * 2:]

    def get_response(self, prompt: str, system_prompt: str, use_cloud: bool = False) -> str:
        """Routes the prompt to the appropriate model (Local or Cloud)."""
        if use_cloud and config.CLOUD_API_KEY:
            return self._call_cloud(prompt, system_prompt)
        return self._call_local(prompt, system_prompt)

    def _call_local(self, prompt: str, system_prompt: str) -> str:
        """Calls the local Ollama instance with full conversation context."""
        # Build history context as a single string for Ollama (Llama 3 style)
        history_text = "\n".join([f"{h['role'].upper()}: {h['content']}" for h in self.history])
        
        full_prompt = f"{system_prompt}\n\nRecent History:\n{history_text}\n\nUser: {prompt}\nJarvis:"
        
        payload = {
            "model": config.LOCAL_MODEL,
            "prompt": full_prompt,
            "stream": False,
            "options": {
                "num_predict": 256,
                "temperature": 0.0,
                "num_thread": 8
            }
        }
        
        try:
            r = requests.post(config.OLLAMA_URL, json=payload, timeout=60)
            r.raise_for_status()
            data = r.json()
            reply = data.get("response", "").strip()
            
            # Clean up JSON formatting
            if reply.startswith("```json"): reply = reply[7:-3]
            elif reply.startswith("```"): reply = reply[3:-3]
            
            return reply.strip()
            
        except Exception as e:
            self.logger.error(f"Local LLM Error: {e}")
            return f"ERROR: Connection to local brain failed: {e}"

    def _call_cloud(self, prompt: str, system_prompt: str) -> str:
        """Calls Groq for hyper-intelligence."""
        if config.CLOUD_PROVIDER == "groq":
            url = "https://api.groq.com/openai/v1/chat/completions"
            headers = {"Authorization": f"Bearer {config.CLOUD_API_KEY}"}
            
            # Use real message format for cloud
            messages = [{"role": "system", "content": system_prompt}]
            messages.extend(self.history)
            messages.append({"role": "user", "content": prompt})
            
            payload = {
                "model": "llama-3.3-70b-versatile",
                "messages": messages,
                "temperature": 0.0
            }
            try:
                r = requests.post(url, json=payload, headers=headers, timeout=20)
                return r.json()['choices'][0]['message']['content'].strip()
            except Exception as e:
                self.logger.error(f"Cloud LLM Failure: {e}")
                return self._call_local(prompt, system_prompt)
        
        return self._call_local(prompt, system_prompt)

# Singleton instance
llm = LLMService()
brain = llm # Alias for backward compatibility
