# J.A.R.V.I.S. (Shiro Oni v2.0)

> *"Sir, I've just finished the system calibration. The Arc Reactor is stable."*

**J.A.R.V.I.S.** (Just A Rather Very Intelligent System) is a modular, event-driven, autonomous AI agent designed for Linux environments. Transformed from the original *Shiro Oni* codebase, this version represents a complete architectural overhaul inspired by JARVIS from the Marvel Cinematic Universe.

---

## ⚡ Key Features

- **🧠 Advanced Cognition**: Features a dual-path Intent Router.
  - **Fast Path**: Resolves common commands in **<100ms** (regex-based).
  - **Slow Path**: Uses local LLMs (Ollama/Llama 3.1) for complex reasoning and strategic planning.
- **🎙️ Sentient Voice UI**: High-quality British accent using Edge TTS with local fallback (pyttsx3).
- **🛰️ Proactive Monitoring**: Background daemons watch your CPU, RAM, and Disk health, providing proactive voice alerts before issues escalate.
- **🩹 Self-Healing**: Monitors system logs for errors and uses the LLM to analyze and suggest fixes automatically.
- **📚 Multi-Turn Memory**: Rolling 10-turn conversation history ensures JARVIS remembers context across several exchanges.
- **🛡️ Secure Action Layer**: Sensitive commands (like terminal execution or file deletion) are protected by a PIN-based security gate.

---

## 🏗️ Architecture

JARVIS is built on a clean, decoupled architecture using an **Asynchronous EventBus**:

- **Perception Layer (`perception/`)**: Handles voice capture and transcription.
- **Cognition Layer (`cognition/`)**: The decision-making hub. Routes intents and creates multi-step plans.
- **Action Layer (`actions/`)**: A registry of capabilities. New tools are added via a simple `@tool` decorator.
- **Services Layer (`services/`)**: Background daemons for memory, monitoring, healing, and scheduling.
- **Core (`core/`)**: Centralized configuration and the async messaging backbone.

---

## 🚀 Installation

### 1. Prerequisites
- **Linux OS** (Ubuntu recommended)
- **Python 3.10+**
- **Ollama** (Running locally with `llama3.1:latest`)
- **System Dependencies**:
  ```bash
  sudo apt update
  sudo apt install ffmpeg xvfb libasound2-dev espeak xdg-utils gnome-screenshot playerctl brightnessctl
  ```

### 2. Setup
```bash
git clone https://github.com/pratikraundale12/Shiro-Oni-Agentic-Ai.git
cd Shiro-Oni-Agentic-Ai
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Environment
Create a `.env` file for cloud fallbacks (optional):
```env
SHIRO_CLOUD_API_KEY=your_groq_key
SHIRO_CLOUD_PROVIDER=groq
```

---

## 🕹️ Usage

Run the JARVIS entry point:
```bash
./start.sh
```

### Common Voice Commands:
- *"Open Chrome and go to YouTube"*
- *"What is my system status?"*
- *"Open the terminal and list files in my home directory"*
- *"Remember that my favorite programming language is Python"*
- *"Check the system health and fix any errors"*
- *"Goodbye, Jarvis"* (to shut down)

---

## 🛠️ Extending JARVIS

Adding new capabilities is easy. Simply use the `@tool` decorator in `actions/system_tools.py`:

```python
from actions.tool_registry import tool

@tool("your_tool_name", "Description for the LLM to understand when to use it")
def your_function(arg1: str):
    # Your logic here
    return "Result for JARVIS to speak"
```

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! If you have ideas for new tools or better cognition logic, feel free to open a PR or Issue.

> *"I'm sorry, sir, but 'the truth' is a matter of circumstance. It's not all things to all people all the time. And neither am I."* — JARVIS
