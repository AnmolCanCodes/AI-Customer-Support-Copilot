import asyncio
import unittest

from fastapi import HTTPException

from src.ingestion import load_documents_from_uploaded_files
import api


class UploadFileStub:
    def __init__(self, name, content):
        self.name = name
        self._content = content

    def getvalue(self):
        return self._content

    async def seek(self, offset, whence=0):
        return None

    async def read(self):
        return self._content


class IngestionUploadTests(unittest.TestCase):
    def test_load_documents_from_uploaded_files_handles_text_files(self):
        uploaded = [UploadFileStub("policy.txt", b"Refunds are allowed within 14 days.")]

        documents = load_documents_from_uploaded_files(uploaded)

        self.assertEqual(len(documents), 1)
        self.assertIn("Refunds are allowed within 14 days.", documents[0].page_content)
        self.assertEqual(documents[0].metadata["source"], "policy.txt")


class ChatErrorHandlingTests(unittest.TestCase):
    def test_chat_raises_clear_hf_credit_error(self):
        async def trigger():
            api.vectorstore = object()
            original = api.create_rag_pipeline
            api.create_rag_pipeline = lambda _: (_ for _ in ()).throw(Exception("Client error '402 Payment Required' for url 'https://router.huggingface.co/v1/chat/completions'"))
            try:
                with self.assertRaises(HTTPException) as ctx:
                    await api.chat(api.ChatRequest(question="What is this?", session_id="s1"))
                self.assertEqual(ctx.exception.status_code, 402)
                self.assertIn("credits", str(ctx.exception.detail).lower())
            finally:
                api.create_rag_pipeline = original

        asyncio.run(trigger())
