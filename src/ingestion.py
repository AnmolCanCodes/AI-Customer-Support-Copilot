import asyncio
import inspect
from pathlib import Path
from tempfile import NamedTemporaryFile

from langchain_core.documents import Document
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter


BASE_DIR = Path(__file__).resolve().parent.parent
KNOWLEDGE_BASE_DIR = BASE_DIR / 'data' / 'knowledge_base'


def _read_uploaded_bytes(uploaded_file):
    if hasattr(uploaded_file, 'content') and not callable(uploaded_file.content):
        return uploaded_file.content

    if hasattr(uploaded_file, 'getvalue'):
        return uploaded_file.getvalue()

    if hasattr(uploaded_file, 'read'):
        read_method = uploaded_file.read
        if inspect.iscoroutinefunction(read_method):
            if hasattr(uploaded_file, 'seek') and inspect.iscoroutinefunction(uploaded_file.seek):
                try:
                    asyncio.run(uploaded_file.seek(0))
                except RuntimeError:
                    loop = asyncio.new_event_loop()
                    loop.run_until_complete(uploaded_file.seek(0))
                    loop.close()
            try:
                return asyncio.run(read_method())
            except RuntimeError:
                loop = asyncio.new_event_loop()
                result = loop.run_until_complete(read_method())
                loop.close()
                return result

        if hasattr(uploaded_file, 'seek'):
            uploaded_file.seek(0)
        return uploaded_file.read()

    raise TypeError(f'Unsupported uploaded file object: {type(uploaded_file)}')


def load_documents_from_uploaded_files(uploaded_files):
    documents = []

    for uploaded_file in uploaded_files or []:
        file_name = getattr(uploaded_file, 'filename', getattr(uploaded_file, 'name', 'uploaded_file'))
        file_suffix = Path(file_name).suffix.lower()
        file_bytes = _read_uploaded_bytes(uploaded_file)

        if file_suffix == '.txt':
            text = file_bytes.decode('utf-8', errors='replace')
            documents.append(
                Document(
                    page_content=text,
                    metadata={'source': file_name}
                )
            )
            continue

        if file_suffix == '.pdf':
            with NamedTemporaryFile(suffix='.pdf', delete=False) as temp_file:
                temp_file.write(file_bytes)
                temp_path = Path(temp_file.name)

            try:
                loader = PyPDFLoader(str(temp_path))
                loaded_docs = loader.load()
                for doc in loaded_docs:
                    doc.metadata['source'] = file_name
                documents.extend(loaded_docs)
            finally:
                if temp_path.exists():
                    temp_path.unlink(missing_ok=True)

    return documents


def load_documents():
    documents = []
    for file_path in KNOWLEDGE_BASE_DIR.glob('*.txt'):
        loader = TextLoader(
            str(file_path),
            encoding='utf-8'
        )

        documents.extend(loader.load())
    return documents


def split_documents(documents):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=200,
        chunk_overlap=0
    )

    chunks = splitter.split_documents(documents)

    return chunks