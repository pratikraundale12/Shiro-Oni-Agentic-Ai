"""
Shiro Sandbox - Agentic Coding Environment
Allows Shiro Oni to write and run Python code safely to perform complex calculations or data processing.
"""
import subprocess
import os
import tempfile
import logging

LOG_FILE = "shiro_activity.log"
logging.basicConfig(filename=LOG_FILE, level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

class ShiroSandbox:
    def __init__(self):
        self.temp_dir = tempfile.gettempdir()

    def run_code(self, code):
        """Writes code to a temp file and executes it with restricted permissions (simulated)."""
        temp_file = os.path.join(self.temp_dir, f"shiro_task_{os.getpid()}.py")
        
        # Add basic safety imports or boilerplate if needed
        full_code = f"import os, sys, json, math\n\n{code}"
        
        try:
            with open(temp_file, "w") as f:
                f.write(full_code)
            
            logging.info(f"Action: run_sandbox_code | Length: {len(code)}")
            
            # Execute the code
            # Note: In a real production system, we would use a Docker container or a highly restricted user.
            result = subprocess.run(
                ["python3", temp_file],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            output = result.stdout
            errors = result.stderr
            
            if result.returncode == 0:
                return f"Execution successful:\n{output}"
            else:
                return f"Execution failed:\n{errors}"
                
        except Exception as e:
            logging.error(f"Sandbox Error: {e}")
            return f"Critical failure in Sandbox: {e}"
        finally:
            if os.path.exists(temp_file):
                os.remove(temp_file)

# Singleton
sandbox = ShiroSandbox()

def execute_in_sandbox(code):
    return sandbox.run_code(code)
