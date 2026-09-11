import unittest

from src.ingestion import load_documents_from_uploaded_files


class UploadFileStub:
    def __init__(self, name, content):
        self.name = name
        self._content = content

    def getvalue(self):
        return self._content


class IngestionUploadTests(unittest.TestCase):
    def test_load_documents_from_uploaded_files_handles_text_files(self):
        uploaded = [UploadFileStub("policy.txt", b"Refunds are allowed within 14 days.")]

        documents = load_documents_from_uploaded_files(uploaded)

        self.assertEqual(len(documents), 1)
        self.assertIn("Refunds are allowed within 14 days.", documents[0].page_content)
        self.assertEqual(documents[0].metadata["source"], "policy.txt")
