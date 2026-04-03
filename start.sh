#!/bin/bash

echo "Starting Ollama background service..."
nohup ollama serve > ollama.log 2>&1 &

echo "Waiting for Ollama to spin up..."
sleep 3

echo "Pre-loading Shiro Oni's brain..."
# This ensures the model is loaded into memory quickly before the Python script hits it
curl -sf -X POST http://localhost:11434/api/generate -d '{"model": "llama3.1:latest", "prompt": "hi", "stream": false}' > /dev/null &

echo "Starting J.A.R.V.I.S. AI Agent..."
source venv/bin/activate
REAL_DISPLAY=$DISPLAY xvfb-run -a python3 jarvis.py
