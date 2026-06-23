import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_classic.chains.retrieval import create_retrieval_chain
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from pydantic import BaseModel

load_dotenv()
os.environ["GROQ_API_KEY"] = os.getenv("GROQ_API_KEY", "False")

DB_DIR = "./chroma_db"
retrieval_chain = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- STARTUP LOGIC (Runs before the server accepts requests) ---
    global retrieval_chain

    if not os.path.exists(DB_DIR):
        raise RuntimeError(
            f"Database directory {DB_DIR} not found. Run ingest.py first!"
        )

    print("Loading local vector database and connecting to Groq...")

    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vector_store = Chroma(persist_directory=DB_DIR, embedding_function=embeddings)
    retriever = vector_store.as_retriever(search_kwargs={"k": 4})

    llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)

    system_prompt = (
        "You are an assistant answering questions based strictly on the provided context.\n"
        "If you do not know the answer or if it's not in the context, say exactly "
        "Make sure you add citations and references of the act and article"
        "'I cannot find that information in the document.' Do not make things up.\n\n"
        "Context:\n{context}"
    )

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            ("human", "{input}"),
        ]
    )

    question_answer_chain = create_stuff_documents_chain(llm, prompt)
    retrieval_chain = create_retrieval_chain(retriever, question_answer_chain)
    print("Application fully loaded and ready!")

    # The 'yield' hands control back to FastAPI so it can run the server
    yield

    # --- SHUTDOWN LOGIC (Runs when you stop the server) ---
    print("Shutting down safely. Cleaning up resources...")
    retrieval_chain = None


app = FastAPI(title="Chat with Static PDF API", lifespan=lifespan)


class ChatRequest(BaseModel):
    message: str


@app.post("/chat")
async def chat_with_pdf(request: ChatRequest):
    if not retrieval_chain:
        raise HTTPException(
            status_code=500, detail="Retrieval chain is not initialized."
        )

    try:
        response = retrieval_chain.invoke({"input": request.message})
        return {"answer": response["answer"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


app.frontend("/", directory="frontend/dist", fallback="index.html")
