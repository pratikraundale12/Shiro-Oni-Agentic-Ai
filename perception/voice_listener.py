import speech_recognition as sr
import threading
import logging
from core.event_bus import bus
from core.config import config
from jarvis_voice import ignore_stderr

class VoiceListener:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.logger = logging.getLogger("VoiceListener")
        self._stop_listening = False
        
        # Hyper-responsive thresholds from config
        self.recognizer.dynamic_energy_threshold = True
        self.recognizer.energy_threshold = 300
        self.recognizer.pause_threshold = config.STT_PAUSE_THRESHOLD
        self.recognizer.non_speaking_duration = config.STT_NON_SPEAKING_DURATION

    def start(self):
        """Start listening in a background thread."""
        thread = threading.Thread(target=self._listen_loop, daemon=True)
        thread.start()
        self.logger.info("VoiceListener started.")

    def _listen_loop(self):
        with ignore_stderr():
            mic = sr.Microphone()
            with mic as source:
                self.recognizer.adjust_for_ambient_noise(source, duration=0.2)
        
        while not self._stop_listening:
            try:
                with ignore_stderr():
                    with mic as source:
                        audio = self.recognizer.listen(source, timeout=None, phrase_time_limit=config.STT_PHRASE_TIME_LIMIT)
                
                # Transcribe
                text = self._transcribe(audio)
                if text:
                    self._on_speech(text)
                    
            except sr.WaitTimeoutError:
                continue
            except Exception as e:
                self.logger.error(f"Error in listen loop: {e}")

    def _transcribe(self, audio):
        try:
            return self.recognizer.recognize_google(audio).lower()
        except sr.UnknownValueError:
            return ""
        except sr.RequestError:
            self.logger.error("Network error with STT.")
            return ""

    def _on_speech(self, text):
        """Immediately publish speech to the event bus."""
        import asyncio
        asyncio.run_coroutine_threadsafe(bus.publish("user_speech", text), asyncio.get_event_loop())

# Singleton instance
listener = VoiceListener()
