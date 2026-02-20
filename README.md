# 🧠 Second Brain AI

A personal knowledge management system powered by **semantic search** and **Retrieval-Augmented Generation (RAG)**, designed to transform scattered notes into an intelligent, searchable knowledge base.

Second Brain AI allows users to store notes, retrieve information based on **meaning instead of keywords**, and ask natural language questions grounded strictly in their own data.

---

## 🚀 Overview

Modern note-taking tools rely on keyword matching, which fails when users remember ideas rather than exact phrases. Generic AI chatbots, on the other hand, lack personal context and often hallucinate.

**Second Brain AI bridges this gap** by combining:

* Secure personal data ownership
* Semantic vector search
* Context-aware AI reasoning

The system retrieves relevant user knowledge first and generates answers **only from retrieved context**, ensuring grounded and reliable responses.

---

## ✨ Features

* 🔐 **Secure Authentication**

  * JWT-based authentication
  * Password hashing using bcrypt
  * User-isolated data access

* 📝 **Personal Notes System**

  * Create, update, delete, and manage notes
  * User-scoped ownership enforcement
  * Structured knowledge storage

* 🧩 **Embedding Pipeline**

  * Automatic embedding generation on note creation/update
  * Text chunking for improved retrieval
  * Local embedding model via Ollama

* 🔎 **Semantic Search**

  * Meaning-based retrieval using cosine similarity
  * Ranked Top-K relevant results
  * Secure user-scoped querying

* 🤖 **RAG (AskBrain)**

  * Retrieval-Augmented Generation workflow
  * Local LLM integration (Ollama)
  * Context-grounded answers
  * Hallucination minimization by design

* 🖥️ **Frontend Interface**

  * Login page
  * Notes management page
  * AskBrain conversational interface

---

## 🏗️ System Architecture

```
User
  ↓
React Frontend
  ↓
Express API (Auth + Notes + AskBrain)
  ↓
MongoDB (Notes + Embeddings)
  ↓
Semantic Search (Cosine Similarity)
  ↓
Context Construction
  ↓
Local LLM (Ollama)
  ↓
Grounded Answer
```

---

## 🧰 Tech Stack

### Frontend

* React
* React Router
* Axios

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* bcrypt

### AI Components

* Ollama (Local Models)
* Embeddings: `nomic-embed-text`
* Local LLM for RAG responses
* Cosine similarity semantic search

---

## 🧠 How RAG Works

1. User asks a question.
2. Query is converted into an embedding.
3. Semantic search retrieves relevant note chunks.
4. Retrieved context is sent to the LLM.
5. The model generates an answer **only using provided context**.

If insufficient context exists, the system responds accordingly instead of hallucinating.

---

## 📂 Project Structure

```
second-brain-ai/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   └── models/
│
├── frontend/
│   ├── pages/
│   ├── components/
│   └── services/
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/second-brain-ai.git
cd second-brain-ai
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

Run server:

```bash
npm run dev
```

---

### 3️⃣ Install Ollama

Install from:

[https://ollama.com](https://ollama.com)

Pull required models:

```bash
ollama pull nomic-embed-text
```

(Start your chosen local LLM model as well.)

---

### 4️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🔒 Design Principles

* Retrieval before generation
* User ownership enforced at every layer
* AI isolated from core business logic
* Minimal hallucination by grounding responses
* Modular, scalable backend architecture

---

## 📖 Development Journey

This project was built incrementally and documented as a learning-in-public series:

1. Authentication & Security
2. Notes Data Modeling
3. Embeddings Pipeline
4. Semantic Search
5. RAG Implementation
6. Frontend Integration

---

## 🚧 Future Improvements

* Vector database integration
* Streaming responses
* Improved ranking strategies
* Context compression
* Enhanced UI/UX

---

## 👤 Author

**Niranthar M J**
5th Semester — Computer Science & Design
Atria Institute of Technology

---

## ⭐ Motivation

Second Brain AI was built to explore how modern AI systems should be designed — not as chatbots, but as **grounded reasoning systems over personal knowledge**.

---