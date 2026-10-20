# Task: Replace Streamlit with a Modern React + TypeScript Frontend

You are a senior frontend engineer and UI/UX designer with strong experience integrating React applications with Python AI backends.

Your task is to completely replace the existing Streamlit frontend of **AI Customer Support Copilot** with a modern, professional React + TypeScript frontend.

This is an MVP project, not an enterprise SaaS dashboard. The goal is to create a polished, functional product interface that feels like a thoughtfully designed developer tool.

**Most importantly: preserve the existing backend and RAG functionality. Do not break or unnecessarily rewrite working backend code.**

---

## 1. FIRST: Inspect the Existing Project

Before writing any code, inspect the entire repository.

Understand:

- `main.py`
- `app.py` (existing Streamlit interface)
- `src/ingestion.py`
- `src/embeddings.py`
- `src/vectorstore.py`
- `src/retriever.py`
- `src/prompts.py`
- `src/llm.py`
- `src/rag_pipeline.py`
- `requirements.txt`
- Existing tests

Understand the actual function signatures, input/output formats, document processing workflow, vector store lifecycle, and session handling.

Do not assume that REST API endpoints already exist.

Identify which parts of the existing Streamlit code are responsible for:
- Uploading PDF/TXT documents.
- Building the knowledge base.
- Initializing and accessing the vector store.
- Processing user questions.
- Returning generated answers.
- Clearing conversation history.

Understand how Streamlit currently connects these operations to the RAG pipeline.

**Important:** The existing project documentation describes an in-memory FAISS vector store and temporary document processing. Preserve these behaviors unless a change is absolutely necessary for frontend integration.

---

## 2. Backend Integration: Critical Requirement

The existing Python RAG implementation must remain the source of truth.

If the project does not already expose an HTTP API, create a lightweight FastAPI backend that acts as an adapter between React and the existing RAG modules.

Do not rewrite the RAG pipeline in FastAPI.

The FastAPI layer should call existing Python functions and classes.

Suggested API contract (adapt to the actual implementation):

### POST /api/documents/upload

- Accept multiple PDF and TXT files using multipart/form-data.
- Validate file extensions and content.
- Process uploaded documents using the existing ingestion pipeline.
- Return document metadata and upload status.

### POST /api/knowledge-base/build

- Build the knowledge base using the existing embedding and FAISS implementation.
- Return processing status.
- Include useful metadata such as document count and chunk count, if available.
- Handle empty uploads and processing failures.

### GET /api/knowledge-base/status

Return whether the knowledge base is ready and relevant document metadata.

### POST /api/chat

Request:
- `question`
- `session_id`

Response:
- `answer`
- `sources` (only if the existing retrieval pipeline exposes source metadata)
- `session_id`

Use the existing RAG pipeline for question answering.

Never generate answers from an unrelated LLM call that bypasses document retrieval.

### DELETE /api/chat/{session_id}

Clear the relevant conversation/session state if supported by the existing backend.

If the existing application does not maintain conversational memory, do not invent persistent conversation memory.

### Backend requirements

- Use Pydantic request/response schemas.
- Enable CORS for the local frontend development origin.
- Handle API errors gracefully.
- Keep Hugging Face credentials in the backend `.env`.
- Never expose API keys to the frontend.
- Preserve in-memory FAISS behavior.
- Avoid unnecessary database integration.
- Avoid changing existing RAG modules unless required.
- Keep the existing Python dependencies intact and add only necessary dependencies.

If any suggested endpoint cannot be implemented reliably using the existing architecture, adapt the contract rather than introducing fake functionality.

---

## 3. Frontend Technology

Use:

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Fetch API or Axios

Create a clean frontend architecture.

Suggested structure:

frontend/
  src/
    components/
      layout/
      chat/
      documents/
      ui/
    pages/
    services/
      api.ts
    hooks/
    types/
    utils/
    App.tsx
    main.tsx

  public/
  package.json
  tsconfig.json
  vite.config.ts

You may adjust the structure if a better organization makes sense.

Use TypeScript interfaces for API requests, responses, documents, chat messages, and source metadata.

Keep API calls inside the service layer rather than scattering fetch requests across components.

---

## 4. UI/UX Direction: Anti-AI-Slop Design

This is one of the most important requirements.

I do NOT want a generic AI-generated SaaS dashboard.

Avoid:
- Purple-blue gradients.
- Glowing backgrounds.
- Excessive rounded cards.
- Floating icon pills.
- Generic centered hero sections.
- Centered badge + headline + three-card layouts.
- Huge unnecessary headings.
- Generic Inter/Roboto typography.
- Excessive glassmorphism.
- Random decorative elements.
- Emoji as interface icons.
- Excessive animations.
- Dashboard-style metric cards that provide no actual value.

The interface should look like a real, carefully crafted software product.

### Visual direction

Use an editorial, minimal, technical aesthetic.

Suggested palette:
- Warm off-white background.
- Deep charcoal typography.
- Muted gray secondary text.
- One restrained accent color (burnt orange or muted green).
- Subtle borders.
- Minimal shadows.

Typography:
- Choose a distinctive typography pairing.
- Use strong hierarchy.
- Make headings purposeful rather than oversized.
- Keep interface text readable.

Layout:
- Asymmetric but balanced composition.
- Clear visual hierarchy.
- Functional spacing.
- Thin dividers instead of unnecessary cards.
- Small, intentional interaction details.

The interface should feel closer to a polished developer productivity tool than a generic AI chatbot template.

---

## 5. Main Application Interface

Build one primary workspace rather than multiple unnecessary pages.

### A. Application sidebar

A narrow, functional sidebar containing:

- Product name: Support Copilot.
- New conversation action.
- Uploaded documents section.
- Individual document names.
- File type indicators.
- Document count.
- Knowledge base status.
- Clear chat action.

Show meaningful states:
- No documents uploaded.
- Documents uploaded.
- Knowledge base building.
- Knowledge base ready.
- Processing failed.

Avoid making the sidebar unnecessarily wide.

### B. Main chat workspace

This is the primary visual focus.

When no documents are uploaded:

Show an intentional empty state explaining that users should upload their PDF/TXT documents to create a knowledge base.

Include:
- A clear upload action.
- Supported formats.
- A short explanation of how document-based question answering works.

After the knowledge base is ready:

Display a conversation interface.

Include:
- User messages.
- Assistant responses.
- Loading/thinking state.
- Error state.
- Copy answer action.
- Clear conversation action.

Use readable message widths and comfortable typography.

Do not make every message look like a giant rounded card.

### C. Document upload experience

Create a polished drag-and-drop upload component.

Requirements:
- Accept PDF and TXT.
- Support multiple files.
- Display selected filenames.
- Show file sizes.
- Allow removing selected files before upload.
- Show upload progress where technically available.
- Show upload errors.
- Prevent unsupported file types.

After successful upload, provide a clear action:

"Build Knowledge Base"

Show an appropriate processing state while the backend generates embeddings and builds the FAISS index.

Do not pretend processing is complete before the backend confirms success.

### D. Knowledge base status

Display a compact status indicator.

Examples:
- No knowledge base.
- Processing documents...
- Knowledge base ready.
- Processing failed.

If available, display:
- Number of uploaded documents.
- Number of processed chunks.

Only display actual backend data.

### E. Chat input

Include:
- Multiline text input.
- Send button.
- Enter to send.
- Shift + Enter for a new line.
- Disabled state while processing, where appropriate.

When sending a question, call the existing RAG-backed API.

Display the answer returned by the backend.

If the backend returns source metadata, display document names and relevant source information below the answer.

Never fabricate citations or source references.

---

## 6. Functional Requirements

This is not a static UI exercise.

Every visible interaction must work.

Implement:
- Multiple document uploads.
- File validation.
- Knowledge base creation.
- Knowledge base status checking.
- Question submission.
- Displaying actual backend responses.
- Loading states.
- Error handling.
- Conversation clearing.
- Document list updates.
- Empty states.

Important edge cases:
- User asks a question before building the knowledge base.
- User uploads an unsupported file.
- User uploads an empty document.
- Backend is unavailable.
- Hugging Face API fails.
- Knowledge base creation fails.
- User sends an empty question.
- User sends multiple questions.
- Browser refreshes while the backend holds in-memory state.

Handle these situations without crashing the application.

Do not claim that uploaded documents survive server restarts if they are only held in memory.

---

## 7. Frontend and Backend Development

Set up the project so that frontend and backend can run independently.

Suggested development commands:

Backend:
`uvicorn api:app --reload --port 8000`

Frontend:
`npm run dev`

Use Vite's development proxy or properly configured CORS for API communication.

Store the API base URL in a frontend environment variable.

Example:
`VITE_API_BASE_URL=http://localhost:8000`

Do not hardcode backend URLs throughout the components.

Keep the existing `HF_TOKEN` exclusively on the backend.

---

## 8. Code Quality

- Use reusable components.
- Use strict TypeScript typing.
- Avoid `any` wherever possible.
- Keep components reasonably small.
- Separate business logic from presentation.
- Avoid unnecessary dependencies.
- Avoid unnecessary abstraction.
- Use semantic HTML.
- Make the interface responsive.
- Support keyboard interactions.
- Include meaningful error messages.
- Avoid fake data and mock responses in the actual application.

Do not add authentication, payment systems, database infrastructure, analytics, or unrelated features.

This is an MVP.

---

## 9. Final Verification

Before considering the task complete:

1. Verify that the existing RAG modules are still intact.
2. Verify that the FastAPI adapter calls the actual existing RAG functions.
3. Verify document uploads.
4. Verify knowledge base creation.
5. Verify that questions reach the retrieval pipeline.
6. Verify that generated answers are returned to React.
7. Verify error handling.
8. Run existing Python tests.
9. Run frontend TypeScript checks.
10. Run frontend production build.

Do not claim that the application has been fully tested against a live Hugging Face API unless you actually performed that test.

If a test cannot be executed, report it honestly.

---

## 10. Final Deliverables

Provide:

- Complete React + TypeScript frontend.
- FastAPI integration layer, if needed.
- Updated Python requirements.
- Frontend package configuration.
- `.env.example` files.
- Updated README with setup instructions.
- Clear frontend/backend run commands.

At the end, provide a concise implementation report:

1. Files created.
2. Files modified.
3. Existing backend modules preserved.
4. API endpoints implemented.
5. Features implemented.
6. Tests executed and their results.
7. Any remaining limitations.

**Final instruction: Prioritize backend compatibility and functional correctness first, then frontend design quality. Do not sacrifice working RAG functionality for visual improvements.**