import os
from dotenv import load_dotenv
from tavily import TavilyClient
import google.generativeai as genai

load_dotenv()

# Initialize clients
tavily = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
model = genai.GenerativeModel("gemini-2.5-flash")


def web_search_tool(query: str, max_results: int = 5) -> dict:
    """Search the web using Tavily and return results."""
    response = tavily.search(
        query=query,
        search_depth="advanced",
        max_results=max_results,
        include_answer=True,
    )
    return response


def build_context(search_results: dict) -> tuple[str, list[str]]:
    """Extract content and sources from search results."""
    context_parts = []
    sources = []

    for result in search_results.get("results", []):
        title = result.get("title", "")
        content = result.get("content", "")
        url = result.get("url", "")

        if content:
            context_parts.append(f"Source: {title}\nURL: {url}\nContent: {content}\n")
            sources.append(url)

    context = "\n---\n".join(context_parts)
    return context, sources


def generate_answer(query: str, context: str) -> str:
    """Use Gemini to generate a grounded answer from search context."""
    prompt = f"""You are a helpful AI assistant. Using ONLY the information provided below, answer the user's question clearly and concisely.

Search Results Context:
{context}

User Question: {query}

Instructions:
- Answer based strictly on the provided context
- Be concise and informative
- If the context doesn't have enough info, say so
- Do not make up information

Answer:"""

    response = model.generate_content(prompt)
    return response.text.strip()


def run_agent(query: str) -> None:
    """Main agent pipeline: search → retrieve → generate → respond."""
    print(f"\n{'='*60}")
    print(f"Query: {query}")
    print("="*60)

    print("\n[1/3] Searching the web...")
    search_results = web_search_tool(query)

    print("[2/3] Processing search results...")
    context, sources = build_context(search_results)

    # Use Tavily's direct answer if available
    tavily_answer = search_results.get("answer", "")
    if tavily_answer:
        context = f"Quick Answer: {tavily_answer}\n\n{context}"

    print("[3/3] Generating answer with Gemini...\n")
    answer = generate_answer(query, context)

    print("Answer:")
    print("-" * 40)
    print(answer)
    print("\nSources:")
    print("-" * 40)
    for i, source in enumerate(sources, 1):
        print(f"[{i}] {source}")
    print("="*60)


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1:
        # Accept query from command line argument
        user_query = " ".join(sys.argv[1:])
    else:
        # Interactive mode
        print("AI Web Search Agent (powered by Google ADK + Tavily)")
        print("Type 'exit' to quit\n")
        while True:
            user_query = input("Enter your question: ").strip()
            if user_query.lower() in ("exit", "quit", "q"):
                print("Goodbye!")
                break
            if user_query:
                run_agent(user_query)
            else:
                print("Please enter a valid question.")
