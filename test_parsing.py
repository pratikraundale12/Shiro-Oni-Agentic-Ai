import unittest
from unittest.mock import patch, MagicMock
import json
import sys
import os

# Create dummy modules for things that might fail to import or have side effects
mock_modules = [
    'pyautogui', 'psutil', 'googlesearch', 'shiro_recorder', 
    'shiro_security_guard', 'shiro_vision', 'shiro_memory', 
    'shiro_browser', 'shiro_filesystem', 'shiro_monitor', 
    'shiro_knowledge', 'shiro_security', 'shiro_performance',
    'shiro_sandbox'
]

for mod in mock_modules:
    sys.modules[mod] = MagicMock()

# Now we can import the modules to test
from shiro_llm import ShiroLLM
# We need to import ask_shiro_brain after mocking shiro_tools because shiro_oni imports from it
import shiro_oni
from shiro_oni import ask_shiro_brain
import shiro_tools
from shiro_tools import map_intent_to_tool

class TestShiroParsing(unittest.TestCase):
    
    @patch('requests.post')
    def test_llm_error_response(self, mock_post):
        # Mock Ollama returning an error JSON
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"error": "model 'llama3.1:latest' not found"}
        mock_post.return_value = mock_response
        
        llm = ShiroLLM()
        result = llm.get_response("hi", "system")
        self.assertEqual(result, "ERROR: Ollama says: model 'llama3.1:latest' not found")

    @patch('shiro_llm.brain.get_response')
    def test_oni_handles_llm_error(self, mock_get_response):
        # Mock LLM returning an error string
        mock_get_response.return_value = "ERROR: connection failed"
        
        result = ask_shiro_brain("hello")
        self.assertIn("I had an issue communicating with my brain", result)
        self.assertIn("connection failed", result)

    def test_oni_handles_empty_reply(self):
        with patch('shiro_llm.brain.get_response', return_value=""):
            result = ask_shiro_brain("hello")
            self.assertEqual(result, "My consciousness momentarily faded. I have no response for that, sir.")

    def test_tools_parsing_graceful_fail(self):
        # Mock the logging and recorder to avoid side effects
        with patch('logging.error'), patch('shiro_tools.recorder'):
            # Test with plain text that isn't JSON
            result = map_intent_to_tool("Hello master, I am here.")
            self.assertIn("I understand your intent, but I could not translate 'Hello master, I am here.' into a system command directly.", result)
            
            # Test with malformed JSON
            result = map_intent_to_tool('{"action": "open_app"')
            self.assertIn("I encountered a formatting error connecting my brain to the system tools, sir.", result)

if __name__ == '__main__':
    unittest.main()
