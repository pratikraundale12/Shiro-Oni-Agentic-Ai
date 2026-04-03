import functools
import inspect
import json
import logging
from typing import Any, Callable, Dict, List, Optional

class ToolRegistry:
    def __init__(self):
        self.tools: Dict[str, Dict[str, Any]] = {}
        self.logger = logging.getLogger("ToolRegistry")

    def tool(self, name: str, description: str):
        """Decorator to register a function as a JARVIS tool."""
        def decorator(func: Callable):
            sig = inspect.signature(func)
            params = {
                k: {
                    "type": str(v.annotation) if v.annotation != inspect.Parameter.empty else "string",
                    "default": v.default if v.default != inspect.Parameter.empty else None,
                    "required": v.default == inspect.Parameter.empty
                }
                for k, v in sig.parameters.items()
            }
            
            self.tools[name.lower()] = {
                "name": name,
                "description": description,
                "function": func,
                "parameters": params
            }
            
            @functools.wraps(func)
            def wrapper(*args, **kwargs):
                return func(*args, **kwargs)
            return wrapper
        return decorator

    def dispatch(self, intent: Dict[str, Any]) -> str:
        """
        Parses a JSON intent from the Cognition layer and routes it to the tool.
        Expects: {"action": "open_app", "args": {"app_name": "firefox"}}
        """
        action = str(intent.get("action", "")).lower()
        args = intent.get("args", {})
        
        if action not in self.tools:
            return f"I don't have a tool for '{action}', sir."

        tool_info = self.tools[action]
        func = tool_info["function"]
        
        # KEY-AGNOSTIC EXTRACTION (from shiro_tools)
        # This part handles varied LLM naming conventions
        def omni_get(target_keys):
            # 1. Check direct args
            for k, v in args.items():
                if any(tk in k.lower() for tk in target_keys):
                    return v
            # 2. Check top level
            for k, v in intent.items():
                if k != "action" and any(tk in k.lower() for tk in target_keys):
                    return v
            return None

        # Build kwargs for the function call
        kwargs = {}
        param_specs = tool_info["parameters"]
        
        for param_name, spec in param_specs.items():
            val = omni_get([param_name.lower()])
            if val is not None:
                kwargs[param_name] = val
            elif spec["required"]:
                # If required but not found by name, try to map from first found key
                # This fallback is for very loose LLM outputs
                pass

        try:
            self.logger.info(f"Dispatching tool: {action} with args: {kwargs}")
            result = func(**kwargs)
            return str(result)
        except Exception as e:
            self.logger.error(f"Error executing tool {action}: {e}")
            import traceback
            self.logger.error(traceback.format_exc())
            return f"Failed to execute {action}: {str(e)}"

    def get_tool_schemas(self) -> List[Dict[str, Any]]:
        """Returns schemas for all registered tools (for LLM context)."""
        schemas = []
        for name, info in self.tools.items():
            schemas.append({
                "name": name,
                "description": info["description"],
                "parameters": info["parameters"]
            })
        return schemas

# Global shared registry
registry = ToolRegistry()
tool = registry.tool
