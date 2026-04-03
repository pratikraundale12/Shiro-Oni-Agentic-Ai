import asyncio
import logging
import sys
import os
import signal
from core.config import config
from core.event_bus import bus
from jarvis_voice import voice
from perception.voice_listener import listener
from cognition.intent_router import router
from cognition.planner import planner
from cognition.llm_service import llm
from services.memory_service import memory
from services.monitor_daemon import monitor
from services.healer_daemon import healer
from services.scheduler_service import scheduler
from services.security_service import security
from actions.tool_registry import registry
import actions.system_tools # Trigger tool registration

# --- Status Boot Sequence ---
def show_boot_sequence():
    print(f"\n[ {config.APP_NAME} v{config.VERSION} - ARC REACTOR STABLE ]")
    print(f" > Core Logic:      [ ONLINE ]")
    print(f" > Memory Bank:     [ {len(memory.get_context_for('test')) > 0 or 'READY'} ]")
    print(f" > Tool Registry:   [ {len(registry.tools)} GATES OPEN ]")
    print(f" > System Monitor:  [ SHIELD ACTIVE ]")
    voice.speak(f"System boot complete. {config.APP_NAME} is online and at your service, sir.")

# --- Event Handlers ---

async def handle_user_speech(text):
    """Reacts to user voice input."""
    if not text or len(text) < 3: return
    
    print(f"\nUser: {text}")
    
    # Check for exit commands
    if any(p in text for p in ["shut down", "goodbye", "sleep jarvis", "exit"]):
        voice.speak("Fading into the shadows. Goodbye, sir.")
        os.kill(os.getpid(), signal.SIGINT)
        return

    # 1. Log to memory
    memory.log_command(text)
    
    # 2. Add context to LLM
    context = memory.get_context_for(text)
    
    # 3. Route Intent
    intent = await router.route(text)
    
    # 4. Handle Intent
    action = intent.get("action", "talk")
    if action == "talk":
        voice.speak(intent.get("args", {}).get("text", "I'm listening, sir."))
    else:
        # Check if it's a complex multi-step plan
        if action == "complex_plan" or "plan" in text:
             p = await planner.plan(text)
             if p:
                 voice.speak(f"Initiating sequence, sir. {len(p)} steps calculated.")
                 for step in p:
                     res = registry.dispatch(step)
                     print(f" -> {res}")
                 voice.speak("Sequence complete.")
             else:
                 voice.speak("I encountered an error formulating the plan.")
        else:
            # Simple single tool dispatch
            result = registry.dispatch(intent)
            voice.speak(result)

async def handle_system_alert(alert):
    """Reacts to system warnings."""
    voice.speak(f"Pardon me, sir. {alert}")

# --- Main Entry Point ---

async def main():
    # Setup Logging
    logging.basicConfig(
        filename=config.ACTIVITY_LOG_PATH,
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Signal handlers for clean shutdown
    loop = asyncio.get_running_loop()
    for sig in (signal.SIGINT, signal.SIGTERM):
        loop.add_signal_handler(sig, lambda: asyncio.create_task(shutdown()))

    # Subscribe to events
    bus.subscribe("user_speech", handle_user_speech)
    bus.subscribe("system_alert", handle_system_alert)
    
    # Start background daemons
    monitor.start()
    listener.start()
    
    # Proactive scheduler checker (background loop)
    async def scheduler_loop():
        while True:
            alerts = scheduler.check_for_proactive_alerts()
            for alert in alerts:
                await bus.publish("system_alert", alert)
            await asyncio.sleep(300) # Check every 5 mins

    asyncio.create_task(scheduler_loop())
    
    # Welcome
    show_boot_sequence()
    
    # Keep the main loop alive
    while True:
        await asyncio.sleep(1)

async def shutdown():
    print("\n[ ARC REACTOR POWERING DOWN ]")
    # Add cleanup logic here
    sys.exit(0)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
