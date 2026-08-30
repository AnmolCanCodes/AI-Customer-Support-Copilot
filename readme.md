# AI Customer Support Copilot

A simple AI customer support assistant built using **LangChain, RAG, and Hugging Face**.

The project uses a company's support documentation and policies to answer customer questions using relevant information from the knowledge base.

The goal is to build a practical **Retrieval-Augmented Generation (RAG)** application instead of a generic chatbot.

---

## What This Project Does

A customer asks a support question.

The system:

```text
Customer Question
       ↓
Query Embedding
       ↓
Search Knowledge Base
       ↓
Retrieve Relevant Documents
       ↓
Send Context + Question to LLM
       ↓
Generate Answer
```

For example:

**Customer:**

> Can I get a refund for my subscription?

The system searches the company's refund and subscription policies and uses the retrieved information to generate an answer.

---

## Why RAG?

A normal LLM only relies on the information it learned during training or information provided in the prompt.

That is not enough for company-specific support questions.

For example:

```text
Company Refund Policy:
Customers can request a refund within 14 days of purchase.
```

The LLM may not know this company-specific rule.

RAG solves this by retrieving the relevant company information and providing it to the model at runtime.

```text
Company Documents
       ↓
    Chunking
       ↓
   Embeddings
       ↓
 Vector Database
       ↓
   Retrieval
       ↓
Relevant Context
       ↓
      LLM
       ↓
Support Answer
```

---

## Features

* Load support documentation
* Split documents into smaller chunks
* Generate embeddings
* Store embeddings in a vector store
* Perform semantic search
* Retrieve relevant support information
* Generate answers using an LLM
* Use LangChain to connect the RAG components
* Use Hugging Face for the LLM and embedding model

---

## Knowledge Base

The project uses simple text files as the company's knowledge base.

Example:

```text
data/
└── knowledge_base/
    ├── billing_policy.txt
    ├── refund_policy.txt
    ├── subscription_policy.txt
    └── escalation_policy.txt
```

These files contain fictional company policies that the RAG system can retrieve.

---

## Example

Suppose the knowledge base contains:

```text
Refund Policy

Customers can request a refund within 14 days
of their original purchase.

Refund requests after 14 days are normally not
eligible unless approved by a support manager.
```

The customer asks:

```text
I purchased the subscription 5 days ago.
Can I get a refund?
```

The retriever finds the relevant refund policy.

The LLM receives:

```text
Context:
Customers can request a refund within 14 days
of their original purchase.

Question:
I purchased the subscription 5 days ago.
Can I get a refund?
```

The generated answer should be based on the retrieved company policy.

---

## Project Structure

```text
ai-customer-support-copilot/
│
├── data/
│   └── knowledge_base/
│       ├── billing_policy.txt
│       ├── refund_policy.txt
│       ├── subscription_policy.txt
│       └── escalation_policy.txt
│
├── src/
│   ├── __init__.py
│   ├── ingestion.py
│   ├── embeddings.py
│   ├── vectorstore.py
│   ├── retriever.py
│   ├── prompts.py
│   ├── llm.py
│   └── rag_pipeline.py
│
├── main.py
│
├── .env
├── .gitignore
├── requirements.txt
└── README.md
```

### File Responsibilities

**`ingestion.py`**

Loads the knowledge-base documents and splits them into chunks.

**`embeddings.py`**

Loads the Hugging Face embedding model and converts text into vectors.

**`vectorstore.py`**

Creates and manages the vector store used for similarity search.

**`retriever.py`**

Retrieves the most relevant document chunks for a user question.

**`prompts.py`**

Contains the prompt template used by the RAG system.

**`llm.py`**

Configures the Hugging Face language model.

**`rag_pipeline.py`**

Connects the retriever, prompt, and LLM into one RAG pipeline.

**`main.py`**

Runs the application and allows the user to ask support questions.

---

## Technology Stack

* Python
* LangChain
* Hugging Face
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
