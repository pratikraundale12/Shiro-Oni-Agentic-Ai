import asyncio
import os
import sys
import ctypes
import pygame
import edge_tts
import pyttsx3
from contextlib import contextmanager
from core.config import config

# --- ALSA Error Suppression ---
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

class JarvisVoice:
    def __init__(self):
        pygame.mixer.init()
        self._tts_engine = None
        try:
            self._tts_engine = pyttsx3.init()
            self._tts_engine.setProperty('rate', config.LOCAL_TTS_RATE)
        except Exception:
            pass
            
    def speak(self, text):
        """Unified speak command with fallbacks."""
        print(f"\n{config.APP_NAME}: {text}")
        if not text: return
        
        try:
            # Try Cloud TTS (Premium British Accent)
            with ignore_stderr():
                communicate = edge_tts.Communicate(text, config.VOICE_MODEL, rate=config.VOICE_RATE) 
                asyncio.run(communicate.save("response.mp3"))
            
            pygame.mixer.music.load("response.mp3")
            pygame.mixer.music.play()
            while pygame.mixer.music.get_busy():
                pygame.time.Clock().tick(10)
        except Exception:
            # Fallback to Local TTS (Fastest)
            if self._tts_engine:
                try:
                    self._tts_engine.say(text)
                    self._tts_engine.runAndWait()
                except Exception:
                    pass

# Singleton instance
voice = JarvisVoice()
