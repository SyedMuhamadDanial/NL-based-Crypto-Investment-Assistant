import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

class VectorStore:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.dimension = 384  # Dimension of all-MiniLM-L6-v2
        self.index = faiss.IndexFlatL2(self.dimension)
        self.documents = []

    def add_documents(self, docs):
        if not docs:
            return
        embeddings = self.model.encode(docs)
        self.index.add(np.array(embeddings).astype('float32'))
        self.documents.extend(docs)

    def search(self, query, k=2):
        if self.index.ntotal == 0:
            return []
        query_vec = self.model.encode([query])
        distances, indices = self.index.search(np.array(query_vec).astype('float32'), k)
        
        results = []
        for i in indices[0]:
            if i != -1 and i < len(self.documents):
                results.append(self.documents[i])
        return results

# Singleton instance
vector_store = VectorStore()
# Initial documents (investment education/context)
vector_store.add_documents([
    "Diversification is a strategy that mixes a wide variety of investments within a portfolio.",
    "Risk tolerance is the degree of variability in investment returns that an investor is willing to withstand.",
    "Bitcoin is often seen as digital gold and a store of value.",
    "Ethereum is a decentralized, open-source blockchain with smart contract functionality.",
    "Solana is a high-performance blockchain supporting builders around the world."
])
