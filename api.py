from typing import List, Optional, Dict, Any
from contextlib import asynccontextmanager

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.ingestion import load_documents_from_uploaded_files, split_documents
from src.rag_pipeline import create_rag_pipeline
from src.vectorstore import create_vectorstore


# Global in-memory state
vectorstore: Any = None
chat_history: Dict[str, List[Dict[str, str]]] = {}
_uploaded_files: List[UploadFile] = []


class ChatRequest(BaseModel):
    question: str
    session_id: str


class ChatResponse(BaseModel):
    answer: str
    session_id: str


class DocumentInfo(BaseModel):
    name: str
    size: int


class UploadResponse(BaseModel):
    documents: List[DocumentInfo]
    count: int


class BuildResponse(BaseModel):
    status: str
    document_count: int
    chunk_count: int


class StatusResponse(BaseModel):
    ready: bool
    document_count: Optional[int] = None
    chunk_count: Optional[int] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    yield
    # Shutdown
    global vectorstore, chat_history
    vectorstore = None
    chat_history = {}


app = FastAPI(
    title="AI Customer Support Copilot API",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/documents/upload", response_model=UploadResponse)
async def upload_documents(files: List[UploadFile] = File(...)):
    """Upload PDF and TXT documents for knowledge base creation."""
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")

    # Validate file types
    valid_extensions = {".pdf", ".txt"}
    valid_files = []
    document_infos = []

    for file in files:
        file_ext = file.filename.split(".")[-1].lower()
        if f".{file_ext}" not in valid_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type: {file.filename}. Only PDF and TXT files are supported."
            )
        valid_files.append(file)
        document_infos.append(
            DocumentInfo(name=file.filename, size=len(await file.read()))
        )
        await file.seek(0)  # Reset file pointer

    # Store uploaded files in a temporary global state for building
    global _uploaded_files
    _uploaded_files = valid_files

    return UploadResponse(documents=document_infos, count=len(document_infos))


@app.post("/api/knowledge-base/build", response_model=BuildResponse)
async def build_knowledge_base():
    """Build the knowledge base from uploaded documents."""
    global vectorstore, _uploaded_files

    if "_uploaded_files" not in globals() or not _uploaded_files:
        raise HTTPException(
            status_code=400,
            detail="No documents uploaded. Please upload documents first."
        )

    try:
        # Load documents using existing ingestion pipeline
        uploaded_documents = load_documents_from_uploaded_files(_uploaded_files)
        if not uploaded_documents:
            raise HTTPException(
                status_code=400,
                detail="No supported content was found in the selected files."
            )

        # Split documents into chunks
        chunks = split_documents(uploaded_documents)

        # Create vectorstore using existing implementation
        vectorstore = create_vectorstore(chunks)

        # Clear uploaded files after successful build
        _uploaded_files = []

        return BuildResponse(
            status="ready",
            document_count=len(uploaded_documents),
            chunk_count=len(chunks)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to build knowledge base: {str(e)}")


@app.get("/api/knowledge-base/status", response_model=StatusResponse)
async def get_knowledge_base_status():
    """Get the current status of the knowledge base."""
    global vectorstore

    if vectorstore is None:
        return StatusResponse(ready=False)

    # Note: FAISS doesn't expose document/chunk count easily after creation
    # We return minimal info since the actual count isn't stored
    return StatusResponse(ready=True)


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Ask a question using the RAG pipeline."""
    global vectorstore

    if vectorstore is None:
        raise HTTPException(
            status_code=400,
            detail="Knowledge base not ready. Please upload documents and build the knowledge base first."
        )

    if not request.question or not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    try:
        # Create RAG pipeline using existing implementation
        rag_chain = create_rag_pipeline(vectorstore)
        answer = rag_chain.invoke(request.question)
        response = answer.content if hasattr(answer, "content") else str(answer)

        # Store in chat history
        if request.session_id not in chat_history:
            chat_history[request.session_id] = []
        chat_history[request.session_id].append({
            "role": "user",
            "content": request.question
        })
        chat_history[request.session_id].append({
            "role": "assistant",
            "content": response
        })

        return ChatResponse(answer=response, session_id=request.session_id)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process question: {str(e)}")


@app.delete("/api/chat/{session_id}")
async def clear_chat(session_id: str):
    """Clear chat history for a specific session."""
    global chat_history
    if session_id in chat_history:
        del chat_history[session_id]
    return {"status": "cleared"}


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "ok", "message": "AI Customer Support Copilot API is running"}
