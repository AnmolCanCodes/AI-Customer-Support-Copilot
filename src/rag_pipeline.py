from langchain_core.runnables import RunnablePassthrough
from .retriever import create_retriever
from .llm import model
from .prompts import prompt

def create_rag_pipeline(vectorstore):
    retriever = create_retriever(vectorstore)
    rag_chain = (
        {
            'context': retriever,
            'question': RunnablePassthrough()
        }
        | prompt
        | model
    )

    return rag_chain