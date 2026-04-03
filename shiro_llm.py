"""
Shiro LLM Connector - The Intelligence Hub
Handles communication with the brain (Local or Cloud).
"""
import requests
import json
import os
import logging
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(filename='shiro_activity.log', level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

class ShiroLLM:
    def __init__(self):
        # Default to Llama 3.1 8B for 10/10 local intelligence
        self.ollama_url = "http://localhost:11434/api/generate"
        self.local_model = "llama3.1:latest"
        
        # Cloud settings (Placeholders for future use)
        self.cloud_api_key = os.getenv("SHIRO_CLOUD_API_KEY")
        self.cloud_provider = os.getenv("SHIRO_CLOUD_PROVIDER", "groq") # Default to fastest cloud

    def get_response(self, prompt, system_prompt, use_cloud=False):
        """Routes the prompt to the appropriate model."""
        if use_cloud and self.cloud_api_key:
            return self._call_cloud(prompt, system_prompt)
        return self._call_local(prompt, system_prompt)

    def _call_local(self, prompt, system_prompt):
        """Calls the local Ollama instance."""
        payload = {
            "model": self.local_model,
            "prompt": f"{system_prompt}\n\nCommand: {prompt}",
            "stream": False,
            "options": {
                "num_predict": 128,
                "temperature": 0.0,
                "num_thread": 8
            }
        }
        
        try:
            response = requests.post(self.ollama_url, json=payload, timeout=60)
            response.raise_for_status()
            data = response.json()
            
            if "error" in data:
                error_msg = data["error"]
                logging.error(f"Ollama Error: {error_msg}")
                return f"ERROR: Ollama says: {error_msg}"
                
            reply = data.get("response", "").strip()
            
            # Cleanup markdown formatting
            if reply.startswith("```json"): reply = reply[7:-3]
            elif reply.startswith("```"): reply = reply[3:-3]
            return reply.strip()
            
        except requests.exceptions.RequestException as e:
            logging.error(f"Local LLM Error: {e}")
            return f"ERROR: Connection to local brain failed: {e}"

    def _call_cloud(self, prompt, system_prompt):
        """Calls Groq or other cloud provider for Hyper-Intelligence."""
        if not self.cloud_api_key:
            return self._call_local(prompt, system_prompt)
            
        if self.cloud_provider == "groq":
            url = "https://api.groq.com/openai/v1/chat/completions"
            headers = {"Authorization": f"Bearer {self.cloud_api_key}"}
            payload = {
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.0
            }
            try:
                r = requests.post(url, json=payload, headers=headers, timeout=20)
                return r.json()['choices'][0]['message']['content'].strip()
            except Exception as e:
                logging.error(f"Cloud LLM Failure: {e}")
                return self._call_local(prompt, system_prompt)
        
        return self._call_local(prompt, system_prompt)

# Singleton instance
brain = ShiroLLM()
