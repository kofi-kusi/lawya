from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings 
from langchain_text_splitters import RecursiveCharacterTextSplitter

PDF_PATH = "Ghana Constitution.pdf"
DB_DIR = "./chroma_db"

print("Extracting text from PDF...")
loader = PyPDFLoader(PDF_PATH)
documents = loader.load()

print("Chunking text...")
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
chunks = text_splitter.split_documents(documents)

print("Downloading free embedding model and saving vectors to disk...")

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

vector_store = Chroma.from_documents(
    documents=chunks, embedding=embeddings, persist_directory=DB_DIR
)

print(f"Success! Vector database saved to {DB_DIR}")
