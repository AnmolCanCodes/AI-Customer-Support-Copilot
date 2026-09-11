# AI Customer Support Copilot

A professional RAG-based customer support assistant that lets users upload their own PDF/TXT files and ask questions based only on those documents.

This version is designed for document-specific support use cases, where the knowledge base is created from the files selected by the user instead of a fixed company folder.

---

## Features

- Upload multiple PDF and TXT files
- Drag-and-drop file input in the UI
- Build a vector database from uploaded documents only
- Ask questions against the uploaded file content
- Keep answers grounded in the supplied files
- Clear chat history and rebuild the knowledge base anytime
- Simple Python + Streamlit application

---

## Tech Stack

- Python
- Streamlit
- LangChain
- Hugging Face
- FAISS
- PyPDF

---

## Project Structure

```text
AI-Customer-Support-Copilot/
├── app.py
├── main.py
├── requirements.txt
├── .env.example
├── readme.md
├── src/
│   ├── __init__.py
│   ├── ingestion.py
│   ├── embeddings.py
│   ├── vectorstore.py
│   ├── retriever.py
│   ├── prompts.py
│   ├── llm.py
│   └── rag_pipeline.py
├── tests/
│   ├── __init__.py
│   └── test_document_ingestion.py
└── data/
    └── knowledge_base/
        (kept only as a legacy folder and not used by the app)
```

---

## Local Setup

### 1) Clone the repository

```bash
git clone https://github.com/AnmolCanCodes/AI-Customer-Support-Copilot.git
cd AI-Customer-Support-Copilot
```

### 2) Create a virtual environment

```bash
python -m venv .venv
source .venv/bin/activate
```

### 3) Install dependencies

```bash
pip install -r requirements.txt
```

### 4) Add your Hugging Face token

Create a `.env` file in the project root:

```env
HF_TOKEN=your_huggingface_token_here
```

You can copy from `.env.example`:

```bash
cp .env.example .env
```

### 5) Run the app

```bash
python main.py
```

Then open the browser at:

```text
http://localhost:8501
```

---

## How the app works

1. You upload one or more PDF/TXT files
2. The app reads the uploaded files
3. The text is split into chunks
4. Chunks are embedded and stored in FAISS
5. You ask a question in the chat
6. The app retrieves relevant chunks and sends them to the LLM
7. The answer is generated from the uploaded file content only

---

## Testing

Run the project tests with:

```bash
python -m unittest discover -s tests -v
```

Current test coverage includes uploaded file ingestion.



## Production Tips

- Keep your Hugging Face token in environment variables, not source code
- Validate uploaded file types before processing
- Limit upload size for public deployments
- Add retry/error handling for failed LLM requests
- Consider storing uploaded documents temporarily or in a secure storage bucket

---

## Troubleshooting

### App does not answer questions

Make sure `.env` has a valid `HF_TOKEN`.

### App starts but no files are processed

Ensure the uploaded file is a valid PDF or TXT file.


---

## License

This project is for educational and demo purposes.
* Hugging Face LLM
* Hugging Face Embedding Model
* Vector Store
* Python-dotenv

---

## Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd ai-customer-support-copilot
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

Activate it on Linux/macOS:

```bash
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Create `.env`

Add your Hugging Face API token:

```env
HF_TOKEN=your_huggingface_token
```

Do not commit the `.env` file to GitHub.

---

## Running the Project

Run:

```bash
python main.py
```

Then enter a customer support question.

Example:

```text
Ask your question: Can I get a refund after 10 days?
```

The RAG pipeline retrieves the relevant company policy and generates an answer using the LLM.

---

## RAG Pipeline

The core pipeline is:

```text
                KNOWLEDGE BASE
                      │
                      ▼
                 Load Documents
                      │
                      ▼
                  Text Splitting
                      │
                      ▼
                   Embeddings
                      │
                      ▼
                 Vector Store
                      │
                      │
Customer Question ────┘
        │
        ▼
   Query Embedding
        │
        ▼
    Similarity Search
        │
        ▼
 Relevant Documents
        │
        ▼
   Prompt + Context
        │
        ▼
       LLM
        │
        ▼
   Final Answer
```

---

## Learning Goals

This project is designed to understand the important components of a real RAG application:

* Document ingestion
* Document chunking
* Embeddings
* Vector similarity search
* Retrieval
* Prompt construction
* Context injection
* LLM generation
* LangChain Runnables
* RAG pipeline design

---

## Limitations

This is a learning project and uses fictional support documentation.

It does not currently include:

* User authentication
* Database
* Web frontend
* REST API
* Production deployment
* Customer management
* Real helpdesk integration
* Automated actions such as issuing refunds

The focus is specifically on understanding and implementing the **RAG pipeline**.

---

## Future Improvements

After the basic RAG pipeline works, possible improvements include:

* Better chunking strategies
* Metadata filtering
* Retrieval evaluation
* Different embedding models
* Reranking
* Citation/source display
* RAG evaluation dataset
* Conversation memory
* Better prompt design

The project can later be extended with more advanced AI workflow tools, but those are intentionally outside the scope of the initial version.
