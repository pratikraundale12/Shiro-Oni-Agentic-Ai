import asyncio
import logging
from typing import Any, Callable, Coroutine, Dict, List, Union

class EventBus:
    def __init__(self):
        self.subscribers: Dict[str, List[Callable]] = {}
        self.logger = logging.getLogger("EventBus")
        
    def subscribe(self, event_type: str, handler: Union[Callable[[Any], None], Callable[[Any], Coroutine]]):
        """Subscribe to an event type. Handler can be sync or async."""
        if event_type not in self.subscribers:
            self.subscribers[event_type] = []
        self.subscribers[event_type].append(handler)
        self.logger.debug(f"Subscribed handler to {event_type}")

    async def publish(self, event_type: str, data: Any = None):
        """Publish an event to all subscribers."""
        if event_type not in self.subscribers:
            return
        
        self.logger.info(f"Publishing event: {event_type}")
        tasks = []
        for handler in self.subscribers[event_type]:
            try:
                if asyncio.iscoroutinefunction(handler):
                    tasks.append(handler(data))
                else:
                    # Run sync handlers in a separate thread if needed, but for now just call
                    handler(data)
            except Exception as e:
                self.logger.error(f"Error in handler for {event_type}: {e}")
        
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)

# Central instance
bus = EventBus()
