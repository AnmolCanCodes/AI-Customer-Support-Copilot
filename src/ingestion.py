from pathlib import Path
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter


BASE_DIR = Path(__file__).resolve().parent.parent
KNOWLEDGE_BASE_DIR = BASE_DIR / 'data' / 'knowledge_base'

def load_documents():
    documents = []
    for file_path in KNOWLEDGE_BASE_DIR.glob('*.txt'):
        loader = TextLoader(
            str(file_path),
            encoding= 'utf-8'
        )

        documents.extend(loader.load())
    return documents


def split_documents(documents):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size = 200,
        chunk_overlap = 0
    )

    chunks = splitter.split_documents(documents)

    return chunks