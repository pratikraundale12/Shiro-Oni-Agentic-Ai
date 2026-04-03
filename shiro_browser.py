"""
Shiro Browser Module - Deep Browser Control
Tab management, data extraction, URL navigation, and smart web automation.
Uses Playwright for headless and visible browser control.
"""
import subprocess
import os
import logging
import urllib.parse

logging.basicConfig(filename='shiro_activity.log', level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

def _get_env():
    env = os.environ.copy()
    if "REAL_DISPLAY" in env:
        env["DISPLAY"] = env["REAL_DISPLAY"]
    elif "WAYLAND_DISPLAY" not in env:
        env["DISPLAY"] = ":0"
    return env

def open_browser(browser_name="brave"):
    """Opens a browser."""
    aliases = {
        "brave": "brave-browser",
        "chrome": "google-chrome",
        "firefox": "firefox"
    }
    binary = aliases.get(browser_name.lower(), browser_name)
    try:
        subprocess.Popen([binary], env=_get_env(), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        logging.info(f"Action: open_browser | {binary}")
        return f"Opening {browser_name}."
    except Exception as e:
        return f"Failed to open {browser_name}: {e}"

def open_url_in_browser(url, browser="brave"):
    """Opens a specific URL in the default browser."""
    if not url.startswith("http"):
        url = "https://" + url
    aliases = {"brave": "brave-browser", "chrome": "google-chrome", "firefox": "firefox"}
    binary = aliases.get(browser.lower(), "xdg-open")
    try:
        subprocess.Popen([binary, url], env=_get_env(), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        logging.info(f"Action: open_url_in_browser | {url}")
        return f"Opening {url} in {browser}."
    except Exception as e:
        return f"Could not open URL: {e}"

def open_new_tab(url=""):
    """Opens a new browser tab with an optional URL using keyboard shortcut."""
    import pyautogui, time
    pyautogui.hotkey('ctrl', 't')
    time.sleep(0.5)
    if url:
        if not url.startswith("http"):
            url = "https://" + url
        pyautogui.hotkey('ctrl', 'l')
        time.sleep(0.2)
        pyautogui.typewrite(url, interval=0.03)
        pyautogui.press('enter')
    logging.info(f"Action: open_new_tab | {url}")
    return f"Opened new tab{' with ' + url if url else ''}."

def close_current_tab():
    """Closes the current browser tab."""
    import pyautogui
    pyautogui.hotkey('ctrl', 'w')
    logging.info("Action: close_tab | Closed current tab")
    return "Closed current tab."

def search_in_browser(query, browser="brave"):
    """Searches for a query in the browser's address bar."""
    url = "https://www.google.com/search?q=" + urllib.parse.quote(query)
    return open_url_in_browser(url, browser)

def switch_to_next_tab():
    """Switches to the next browser tab."""
    import pyautogui
    pyautogui.hotkey('ctrl', 'tab')
    logging.info("Action: switch_tab | Ctrl+Tab")
    return "Switched to next tab."

def scrape_page_text(url):
    """Fetches and returns text content from a URL using curl."""
    try:
        result = subprocess.run(
            ["curl", "-s", "-L", "--max-time", "10", url],
            capture_output=True, text=True, timeout=15
        )
        # Strip HTML tags simply
        import re
        text = re.sub(r'<[^>]+>', ' ', result.stdout)
        text = re.sub(r'\s+', ' ', text).strip()
        return f"Page content preview: {text[:600]}"
    except Exception as e:
        return f"Could not fetch page: {e}"
