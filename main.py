from src.ingestion import load_documents, split_documents
from src.vectorstore import create_vectorstore
from src.rag_pipeline import create_rag_pipeline


# 1. Load documents
documents = load_documents()

# 2. Split documents into chunks
chunks = split_documents(documents)

# 3. Create vector store
vectorstore = create_vectorstore(chunks)

# 4. Create RAG pipeline
rag = create_rag_pipeline(vectorstore)


# 5. Ask questions
while True:

    question = input("\nAsk a question (or type 'exit'): ")

    if question.lower() == "exit":
        break

    answer = rag.invoke(question)

    print("\nAnswer:")
    print(answer.content)