# Challenge A — AI Web Search Agent

An AI agent that searches the web using **Tavily** and generates grounded answers using **Google Gemini (ADK)**. Includes a full **React frontend** with dark/light mode toggle.

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/slooze-challenge-a.git
cd slooze-challenge-a
```

### 2. Create a Python virtual environment
```bash
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows
```

### 3. Install Python dependencies
```bash
pip install -r requirements.txt
```

### 4. Set up API keys
```bash
cp .env.example .env
```
Edit `.env` and fill in your keys:
```
GOOGLE_API_KEY=your_google_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```
- **GOOGLE_API_KEY** → https://aistudio.google.com/app/apikey (free)
- **TAVILY_API_KEY** → https://app.tavily.com (free tier available)

---

## How to Run the Project

### Backend (Terminal 1)
```bash
uvicorn server:app --reload --port 8000
```

### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

### (Optional) CLI mode — no frontend needed
```bash
python agent/web_search_agent.py "What are the latest specs in MacBook this year?"
```

### Deployment
- **Backend** → [Render.com](https://render.com) — connect GitHub repo, set env vars, deploy
- **Frontend** → [Vercel.com](https://vercel.com) — set root directory to `frontend`, add `VITE_API_URL=<your_render_url>`

---

## Dependencies Used

| Package | Purpose |
|---|---|
| `google-generativeai` | Google Gemini 1.5 Flash LLM |
| `google-adk` | Google Agent Development Kit |
| `tavily-python` | Web search API client |
| `fastapi` | REST API framework |
| `uvicorn` | ASGI server |
| `python-dotenv` | Load API keys from `.env` |
| `react` + `vite` | Frontend UI framework |
| `react-markdown` | Render markdown in answers |

---

## Architecture Overview

```
User (React UI)
    │
    │  HTTP POST /search  { query }
    ▼
FastAPI Backend  (server.py)
    │
    ├──▶  Tavily Web Search API
    │         returns top 5 results + quick answer
    │
    ├──▶  Context Builder
    │         extracts clean text + source URLs
    │
    └──▶  Google Gemini 2.5 Flash
              generates grounded answer
                    │
                    ▼
         { answer, sources }
              │
              ▼
        React UI renders
        markdown answer + source links
```

### Project Structure

```
challenge-a/
├── agent/
│   └── web_search_agent.py    # Core agent: search → context → generate
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # React UI with dark/light toggle
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server.py                   # FastAPI REST API server
├── render.yaml                 # Render deployment config
├── requirements.txt
├── .env.example
└── README.md
```

---

## Design Decisions and Trade-offs

| Decision | Reason | Trade-off |
|---|---|---|
| **Tavily** for web search | Purpose-built for AI agents — returns clean text, not raw HTML | Paid API (free tier available) |
| **Gemini 1.5 Flash** as LLM | Fast inference, low cost, high quality output | Slightly less powerful than GPT-4o |
| **FastAPI** for backend | Auto-generates `/docs`, clean REST interface, async-ready | Requires running two processes locally |
| **Context-grounded prompting** | Instructs LLM to use only retrieved content — reduces hallucinations | Answer quality limited to what Tavily returns |
| **react-markdown** in frontend | Properly renders bold, bullets, headings from LLM output | Small extra dependency |
| **CORS + env-based API URL** | Supports both local dev and production deployment without code changes | Requires setting `VITE_API_URL` on Vercel |
| **React + Vite** frontend | Fast HMR during development, minimal config | Requires Node.js to be installed |
