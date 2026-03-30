import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent.web_search_agent import web_search_tool, build_context, generate_answer

app = FastAPI(title="Slooze Web Search Agent API")

# Allow both localhost (dev) and Vercel (prod)
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    os.environ.get("FRONTEND_URL", ""),  # set this on Render
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o for o in origins if o],
    allow_origin_regex=r"https://.*\.vercel\.app",  # allow all vercel previews
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str

@app.post("/search")
def search(req: QueryRequest):
    search_results = web_search_tool(req.query)
    context, sources = build_context(search_results)
    tavily_answer = search_results.get("answer", "")
    if tavily_answer:
        context = f"Quick Answer: {tavily_answer}\n\n{context}"
    answer = generate_answer(req.query, context)
    return {"answer": answer, "sources": sources}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/")
def root():
    return {"message": "Slooze Web Search Agent API is running!"}
