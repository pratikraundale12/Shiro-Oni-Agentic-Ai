import sys
import os
from unittest.mock import MagicMock

# Mock system-level libraries that require a display or audio hardware
mock_pygame = MagicMock()
mock_edge_tts = MagicMock()
mock_sr = MagicMock()
mock_pyautogui = MagicMock()
mock_mss = MagicMock()
mock_pytesseract = MagicMock()
mock_psutil = MagicMock()

sys.modules['pygame'] = mock_pygame
sys.modules['edge_tts'] = mock_edge_tts
sys.modules['speech_recognition'] = mock_sr
sys.modules['pyautogui'] = mock_pyautogui
sys.modules['mss'] = mock_mss
sys.modules['pytesseract'] = mock_pytesseract
sys.modules['psutil'] = mock_psutil
sys.modules['numexpr'] = MagicMock()
sys.modules['googlesearch'] = MagicMock()

# Ensure the AI_Agent directory is in the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from shiro_oni import ask_shiro_brain

def manual_session():
    print("=== Shiro Oni (White Ghost) 10/10 Brain Manual Test Session ===")
    print("Model: Llama 3.1 8B")
    print("Type your commands below. Type 'exit' to quit.")
    
    while True:
        try:
            user_input = input("\nYou: ").strip()
            if user_input.lower() in ['exit', 'quit']:
                print("Exiting session.")
                break
            
            if not user_input:
                continue
                
            print(f"Shiro Oni is thinking...")
            response = ask_shiro_brain(user_input)
            print(f"\nShiro Oni Result: {response}")
            
        except KeyboardInterrupt:
            break
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    manual_session()
