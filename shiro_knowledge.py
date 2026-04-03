"""
Shiro Knowledge Base - Local Document Q&A (RAG)
Indexes local PDFs and TXT files into a searchable vector store.
Allows asking questions against your own documents.
"""
import os
import json
import logging
import requests

logging.basicConfig(filename='shiro_activity.log', level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

KB_INDEX_FILE = os.path.join(os.path.dirname(__file__), "shiro_kb_index.json")
OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3.2:1b"

def _load_index():
    if os.path.exists(KB_INDEX_FILE):
        with open(KB_INDEX_FILE, "r") as f:
            return json.load(f)
    return {}

def _save_index(index):
    with open(KB_INDEX_FILE, "w") as f:
        json.dump(index, f, indent=2)

def index_document(file_path):
    """Reads a text or PDF file and adds it to the knowledge base index."""
    path = os.path.expanduser(file_path)
    if not os.path.exists(path):
        return f"File not found: {path}"

    text = ""
    if path.endswith(".pdf"):
        try:
            import PyPDF2
            with open(path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                text = "\n".join(page.extract_text() or "" for page in reader.pages)
        except Exception as e:
            return f"Failed to read PDF: {e}"
    else:
        with open(path, "r", errors="ignore") as f:
            text = f.read()

    # Simple chunking — split into 500-char blocks
    chunks = [text[i:i+500] for i in range(0, len(text), 500)]
    index = _load_index()
    filename = os.path.basename(path)
    index[filename] = {"path": path, "chunks": chunks}
    _save_index(index)

    logging.info(f"Action: index_document | {filename} — {len(chunks)} chunks")
    return f"Indexed '{filename}' with {len(chunks)} sections. You can now ask questions about it."

def list_indexed_docs():
    """Lists all documents in the knowledge base."""
    index = _load_index()
    if not index:
        return "No documents indexed yet. Say 'index document <path>' to add one."
    names = list(index.keys())
    return f"Knowledge base contains {len(names)} document(s): " + ", ".join(names)

def ask_knowledge_base(question):
    """
    Searches the local knowledge base for relevant chunks,
    then uses the LLM to answer based on those chunks.
    """
    index = _load_index()
    if not index:
        return "The knowledge base is empty. Index a document first."

    # Naive keyword search across all chunks
    q_lower = question.lower()
    relevant = []
    for doc_name, doc_data in index.items():
        for chunk in doc_data["chunks"]:
            if any(word in chunk.lower() for word in q_lower.split()):
                relevant.append(chunk)
                if len(relevant) >= 5:
                    break
        if len(relevant) >= 5:
            break

    if not relevant:
        return "I could not find relevant information in the knowledge base for your question."

    context = "\n---\n".join(relevant[:5])
    prompt = f"""Answer the question based ONLY on the following document context.
If the answer is not in the context, say "I couldn't find that in the documents."

Context:
{context}

Question: {question}
Answer:"""

    try:
        response = requests.post(OLLAMA_URL, json={
            "model": OLLAMA_MODEL, "prompt": prompt, "stream": False,
            "options": {"num_predict": 200, "temperature": 0.1}
        }, timeout=30)
        answer = response.json().get("response", "").strip()
        logging.info(f"Action: ask_knowledge_base | Q: {question}")
        return answer if answer else "I could not generate an answer."
    except Exception as e:
        return f"Knowledge base query failed: {e}"
