import streamlit as st

from src.ingestion import load_documents_from_uploaded_files, split_documents
from src.rag_pipeline import create_rag_pipeline
from src.vectorstore import create_vectorstore


st.set_page_config(
    page_title="AI Customer Support Copilot",
    page_icon=":)",
    layout="wide",
)

st.title("AI Customer Support Copilot")
st.caption("Upload PDF or TXT files and ask questions based only on the documents you provide.")

if "chat_messages" not in st.session_state:
    st.session_state.chat_messages = []

if "vectorstore" not in st.session_state:
    st.session_state.vectorstore = None


with st.sidebar:
    st.header("Knowledge base")
    st.write("This app answers questions using only the uploaded files.")

    uploaded_files = st.file_uploader(
        "Drag and drop your files here",
        type=["pdf", "txt"],
        accept_multiple_files=True,
    )

    if uploaded_files:
        st.success(f"{len(uploaded_files)} file(s) selected")
        for uploaded_file in uploaded_files:
            st.caption(uploaded_file.name)

    if st.button("Build knowledge base from uploads"):
        if not uploaded_files:
            st.warning("Please upload at least one PDF or TXT file.")
        else:
            uploaded_documents = load_documents_from_uploaded_files(uploaded_files)
            if not uploaded_documents:
                st.warning("No supported content was found in the selected files.")
            else:
                chunks = split_documents(uploaded_documents)
                st.session_state.vectorstore = create_vectorstore(chunks)
                st.session_state.chat_messages = []
                st.success("Knowledge base rebuilt from your uploaded files.")

    if st.button("Clear chat"):
        st.session_state.chat_messages = []


for message in st.session_state.chat_messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

if st.session_state.vectorstore is None:
    st.info("Upload one or more PDF/TXT files, then click 'Build knowledge base from uploads' to start chatting.")
    st.stop()

prompt = st.chat_input("Ask a question about your uploaded files...")

if prompt:
    st.session_state.chat_messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    try:
        rag_chain = create_rag_pipeline(st.session_state.vectorstore)
        answer = rag_chain.invoke(prompt)
        response = answer.content if hasattr(answer, "content") else str(answer)
    except ValueError as exc:
        response = str(exc)
        st.error(response)

    st.session_state.chat_messages.append({"role": "assistant", "content": response})
    with st.chat_message("assistant"):
        st.markdown(response)
