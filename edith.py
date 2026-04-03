import speech_recognition as sr
import pyttsx3
import requests
import json
import time
import os
import sys
import ctypes

# Suppress ALSA Error logs
from contextlib import contextmanager

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

import requests
import json
import time
import os
import ctypes

# Suppress ALSA Error logs
ERROR_HANDLER_FUNC = ctypes.CFUNCTYPE(None, ctypes.c_char_p, ctypes.c_int, ctypes.c_char_p, ctypes.c_int, ctypes.c_char_p)
def py_error_handler(filename, line, function, err, fmt):
    pass
c_error_handler = ERROR_HANDLER_FUNC(py_error_handler)
asound = ctypes.cdll.LoadLibrary('libasound.so')
asound.snd_lib_error_set_handler(c_error_handler)

# --- Configuration ---
WAKE_WORD = "hi edith"
OLLAMA_MODEL = "llama3" # or phi3, whatever model you pull
OLLAMA_URL = "http://localhost:11434/api/generate"

# --- Initialization ---
# Initialize Text-to-Speech engine
tts_engine = pyttsx3.init()
# Try to find a female voice (often index 1 on Linux/espeak, but varies)
voices = tts_engine.getProperty('voices')
for voice in voices:
    if 'female' in voice.name.lower() or 'zira' in voice.name.lower():
        tts_engine.setProperty('voice', voice.id)
        break
tts_engine.setProperty('rate', 160) # Slightly slower for natural feel

def speak(text):
    print(f"Edith: {text}")
    tts_engine.say(text)
    tts_engine.runAndWait()

def listen_for_audio(recognizer, mic, timeout=None):
    with mic as source:
        print("\nListening...")
        recognizer.dynamic_energy_threshold = True 
        recognizer.energy_threshold = 300 
        recognizer.adjust_for_ambient_noise(source, duration=0.5)
        try:
            audio = recognizer.listen(source, timeout=timeout, phrase_time_limit=10)
            return audio
        except sr.WaitTimeoutError:
            return None

def transcribe_audio(recognizer, audio):
    if not audio:
        return ""
    try:
        # Using Google's free API for STT out of the box (requires internet).
        # We can switch to Vosk later for 100% offline STT.
        text = recognizer.recognize_google(audio).lower()
        print(f"You: {text}")
        return text
    except sr.UnknownValueError:
        return ""
    except sr.RequestError as e:
        print(f"[!] Could not request STT results; {e}")
        return ""

def ask_ollama(prompt):
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False # Set to true later for faster streaming responses
    }
    try:
        response = requests.post(OLLAMA_URL, json=payload)
        response.raise_for_status()
        return response.json().get("response", "")
    except requests.exceptions.RequestException as e:
        print(f"[!] Error communicating with Ollama: {e}")
        return "I'm having trouble connecting to my brain right now."

def run_agent():
    recognizer = sr.Recognizer()
    
    with ignore_stderr():
        mic = sr.Microphone()

    speak("System initializing. Edith is online.")

    while True:
        # 1. Listen for User Input
        audio = listen_for_audio(recognizer, mic)
        text = transcribe_audio(recognizer, audio)
        
        # Clean up the text
        cleaned_text = text.replace(",", "").replace(".", "").replace("!", "").strip()
        
        if cleaned_text:
            if "shut down" in cleaned_text or "goodbye" in cleaned_text:
                speak("Goodbye. Shutting down.")
                break
                
            # 2. Give the command to Ollama immediately (no wake word)
            print("Edith is thinking...")
            full_prompt = f"You are Edith, a helpful, friendly, and concise AI assistant. Keep responses brief. User says: {cleaned_text}"
            response_text = ask_ollama(full_prompt)
            
            # 3. Speak the response
            speak(response_text)

if __name__ == "__main__":
    run_agent()
