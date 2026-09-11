import os

from dotenv import load_dotenv
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint

load_dotenv()

hf_token = os.getenv("HF_TOKEN")

if hf_token:
    llm = HuggingFaceEndpoint(
        repo_id="zai-org/GLM-5.3",
        task="text-generation",
        huggingfacehub_api_token=hf_token,
    )
    model = ChatHuggingFace(llm=llm)
else:
    llm = None
    model = None