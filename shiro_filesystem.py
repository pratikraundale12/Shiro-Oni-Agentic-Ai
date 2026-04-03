"""
Shiro File System Module - Smart File Control
Bulk rename, organize desktop, duplicate detection, smart search, backup.
"""
import os
import shutil
import hashlib
import logging
from datetime import datetime
from pathlib import Path

logging.basicConfig(filename='shiro_activity.log', level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

HOME = Path.home()

def create_folder(path):
    """Creates a folder at the given path."""
    full_path = Path(path).expanduser()
    full_path.mkdir(parents=True, exist_ok=True)
    logging.info(f"Action: create_folder | {full_path}")
    return f"Folder created at {full_path}."

def smart_file_search(name, search_dir="~"):
    """Searches for files matching a name pattern recursively."""
    root = Path(search_dir).expanduser()
    results = list(root.rglob(f"*{name}*"))[:10]
    if results:
        found = "\n".join(str(r) for r in results)
        logging.info(f"Action: smart_file_search | {name} — found {len(results)}")
        return f"Found {len(results)} files matching '{name}':\n{found}"
    return f"No files matching '{name}' were found."

def organize_desktop():
    """Auto-organizes Desktop files into categorized folders."""
    desktop = HOME / "Desktop"
    categories = {
        "Images": [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp"],
        "Videos": [".mp4", ".mkv", ".avi", ".mov"],
        "Documents": [".pdf", ".doc", ".docx", ".txt", ".xlsx", ".pptx"],
        "Archives": [".zip", ".tar", ".gz", ".rar"],
        "Code": [".py", ".js", ".html", ".css", ".sh", ".json"],
    }
    moved = 0
    for item in desktop.iterdir():
        if item.is_file():
            ext = item.suffix.lower()
            for folder, exts in categories.items():
                if ext in exts:
                    dest = desktop / folder
                    dest.mkdir(exist_ok=True)
                    shutil.move(str(item), str(dest / item.name))
                    moved += 1
                    break
    logging.info(f"Action: organize_desktop | Moved {moved} files")
    return f"Desktop organized. Moved {moved} files into categorized folders."

def bulk_rename(folder, prefix):
    """Renames all files in a folder with a numbered prefix."""
    folder_path = Path(folder).expanduser()
    files = sorted(f for f in folder_path.iterdir() if f.is_file())
    for i, f in enumerate(files):
        new_name = f"{prefix}_{i+1:03d}{f.suffix}"
        f.rename(folder_path / new_name)
    logging.info(f"Action: bulk_rename | {len(files)} files renamed in {folder_path}")
    return f"Renamed {len(files)} files with prefix '{prefix}'."

def find_duplicates(directory="~"):
    """Detects duplicate files by hash in a directory."""
    root = Path(directory).expanduser()
    hashes = {}
    duplicates = []
    for file in root.rglob("*"):
        if file.is_file():
            try:
                h = hashlib.md5(file.read_bytes()).hexdigest()
                if h in hashes:
                    duplicates.append(str(file))
                else:
                    hashes[h] = str(file)
            except Exception:
                pass
    logging.info(f"Action: find_duplicates | Found {len(duplicates)} duplicates")
    if duplicates:
        return f"Found {len(duplicates)} duplicate files:\n" + "\n".join(duplicates[:5])
    return "No duplicate files found."

def backup_file(source, dest="~/Backups"):
    """Backs up a file to the Backups folder with a timestamp."""
    src = Path(source).expanduser()
    dst_dir = Path(dest).expanduser()
    dst_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    dst = dst_dir / f"{src.stem}_{timestamp}{src.suffix}"
    shutil.copy2(str(src), str(dst))
    logging.info(f"Action: backup_file | {src} -> {dst}")
    return f"Backed up '{src.name}' to {dst}."
