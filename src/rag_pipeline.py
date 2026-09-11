from langchain_core.runnables import RunnablePassthrough

from .llm import model
from .prompts import prompt
from .retriever import create_retriever


def create_rag_pipeline(vectorstore):
    if model is None:
        raise ValueError(
            "HF_TOKEN is missing. Add your Hugging Face token to the .env file before chatting."
        )

    retriever = create_retriever(vectorstore)
    rag_chain = (
        {
            "context": retriever,
            "question": RunnablePassthrough(),
        }
        | prompt
        | model
    )

    return rag_chain