def create_retriever(vectorstore):
    retriever = vectorstore.as_retriever(
        search_kwargs = {'k': 3}
    )

    return retriever