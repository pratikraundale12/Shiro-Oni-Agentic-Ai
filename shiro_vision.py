"""
Shiro Vision Module - Screen Reading & OCR Intelligence
Gives Shiro Oni/Shiro the ability to see and interact with the screen via text.
"""
import mss
import pytesseract
from PIL import Image
import subprocess
import os
import logging

logging.basicConfig(filename='shiro_activity.log', level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

def capture_screen():
    """Captures the entire screen and returns a PIL Image."""
    env = os.environ.copy()
    if "REAL_DISPLAY" in env:
        os.environ["DISPLAY"] = env["REAL_DISPLAY"]
    with mss.mss() as sct:
        monitor = sct.monitors[1]
        screenshot = sct.grab(monitor)
        img = Image.frombytes("RGB", screenshot.size, screenshot.bgra, "raw", "BGRX")
        return img

def read_screen_text():
    """Reads all visible text on the screen using OCR."""
    logging.info("Action: read_screen_text | Reading screen content")
    try:
        img = capture_screen()
        text = pytesseract.image_to_string(img)
        return f"I can see the following on screen: {text[:500]}"
    except Exception as e:
        return f"OCR failed: {e}"

def find_icon(icon_name):
    """Searches for an icon image on screen and returns its coordinates."""
    icon_path = os.path.join(os.path.dirname(__file__), "shiro_icons", f"{icon_name}.png")
    if not os.path.exists(icon_path):
        return f"Icon reference for '{icon_name}' not found at {icon_path}."
    
    try:
        location = pyautogui.locateOnScreen(icon_path, confidence=0.8)
        if location:
            center = pyautogui.center(location)
            logging.info(f"Action: find_icon | Found {icon_name} at {center}")
            return f"Found {icon_name} at {center.x}, {center.y}."
        return f"Could not find {icon_name} on the screen."
    except Exception as e:
        return f"Visual search error: {e}"

def click_text_on_screen(target_text):
    """Finds text on screen and clicks it."""
    logging.info(f"Action: click_text | Target: {target_text}")
    try:
        img = capture_screen()
        data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)
        for i, word in enumerate(data['text']):
            if target_text.lower() in word.lower():
                x = data['left'][i] + data['width'][i] // 2
                y = data['top'][i] + data['height'][i] // 2
                pyautogui.click(x, y)
                return f"Clicked on '{target_text}' at ({x}, {y})."
        return f"'{target_text}' was not found on screen, sir."
    except Exception as e:
        return f"Screen click failed: {e}"

def find_text_on_screen(target_text):
    """Checks if text is visible on screen, returns True/False."""
    try:
        img = capture_screen()
        text = pytesseract.image_to_string(img)
        return target_text.lower() in text.lower()
    except Exception:
        return False
