import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
from typing import List, Dict, Any
import logging
import PyPDF2
import glob
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize OpenAI client
openai.api_key = os.getenv('OPENAI_API_KEY')

class RLARAGSystem:
    def __init__(self):
        self.documents_dir = "documents"
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.documents = []
        self.embeddings = None
        self.index = None
        self.load_documents()
        
    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extract text from PDF file"""
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
                return text
        except Exception as e:
            logger.error(f"Error extracting text from {pdf_path}: {str(e)}")
            return ""
    
    def load_documents(self):
        """Load and process all PDF documents"""
        pdf_files = glob.glob(os.path.join(self.documents_dir, "*.pdf"))
        logger.info(f"Found {len(pdf_files)} PDF files")
        
        all_text_chunks = []
        
        for pdf_file in pdf_files:
            logger.info(f"Processing {pdf_file}")
            text = self.extract_text_from_pdf(pdf_file)
            
            if text.strip():
                # Split text into chunks (you can adjust chunk size)
                chunks = self.split_text_into_chunks(text, chunk_size=500)
                for i, chunk in enumerate(chunks):
                    all_text_chunks.append({
                        'text': chunk,
                        'source': os.path.basename(pdf_file),
                        'chunk_id': i
                    })
        
        self.documents = all_text_chunks
        
        if self.documents:
            # Create embeddings
            texts = [doc['text'] for doc in self.documents]
            self.embeddings = self.model.encode(texts)
            
            # Create FAISS index
            dimension = self.embeddings.shape[1]
            self.index = faiss.IndexFlatIP(dimension)  # Inner Product (cosine similarity)
            
            # Normalize embeddings for cosine similarity
            faiss.normalize_L2(self.embeddings)
            self.index.add(self.embeddings)
            
            logger.info(f"Loaded {len(self.documents)} document chunks")
        else:
            logger.warning("No documents found or processed")
    
    def split_text_into_chunks(self, text: str, chunk_size: int = 500) -> List[str]:
        """Split text into smaller chunks for better retrieval"""
        words = text.split()
        chunks = []
        
        for i in range(0, len(words), chunk_size):
            chunk = ' '.join(words[i:i + chunk_size])
            if chunk.strip():
                chunks.append(chunk.strip())
        
        return chunks
    
    def get_relevant_context(self, query: str, top_k: int = 3) -> str:
        """Get relevant context using semantic search"""
        if not self.documents or self.index is None:
            logger.warning("No documents loaded for RAG")
            return "I don't have access to specific documents right now, but I can help with general OptiU questions."
        
        try:
            # Encode the query
            query_embedding = self.model.encode([query])
            faiss.normalize_L2(query_embedding)
            
            # Search for similar chunks
            scores, indices = self.index.search(query_embedding, top_k)
            
            relevant_chunks = []
            for score, idx in zip(scores[0], indices[0]):
                if score > 0.3:  # Similarity threshold
                    doc = self.documents[idx]
                    relevant_chunks.append(f"From {doc['source']}: {doc['text']}")
            
            if relevant_chunks:
                return "\n\n".join(relevant_chunks)
            else:
                return "I found some information but it may not be directly relevant to your question."
                
        except Exception as e:
            logger.error(f"Error in semantic search: {str(e)}")
            return "I'm having trouble accessing the document information right now."

class RLAChatbot:
    def __init__(self):
        self.rag_system = RLARAGSystem()
        self.conversation_history = []
        
    def generate_response(self, user_message: str, conversation_history: List[Dict[str, str]]) -> str:
        try:
            # Get relevant context from RAG system
            context = self.rag_system.get_relevant_context(user_message)
            
            # Prepare system prompt
            system_prompt = f"""You are RLA (Reasoning Logic Assistant), a helpful AI assistant for OptiU, a conversational optimization platform. 

CONTEXT INFORMATION:
{context}

GUIDELINES:
- You are knowledgeable, professional, and enthusiastic about optimization
- Focus on how OptiU/Opti can solve the user's optimization challenges
- Use the provided context to give accurate information about features, pricing, and capabilities
- If asked about something outside OptiU's scope, gently redirect to optimization topics
- Keep responses conversational and helpful
- Always offer to help with specific optimization challenges
- Mention relevant features or use cases when appropriate

Respond as RLA, the optimization expert assistant for OptiU."""

            # Prepare messages for OpenAI
            messages = [{"role": "system", "content": system_prompt}]
            
            # Add conversation history (last 10 messages to stay within token limits)
            messages.extend(conversation_history[-10:])
            
            # Add current user message
            messages.append({"role": "user", "content": user_message})
            
            # Call OpenAI API
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=messages,
                max_tokens=500,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            return "I apologize, but I'm experiencing technical difficulties. Please try again in a moment, or feel free to ask me about OptiU's optimization capabilities!"

# Initialize chatbot
chatbot = RLAChatbot()

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({'error': 'Message is required'}), 400
        
        user_message = data['message']
        conversation_history = data.get('history', [])
        
        # Generate response
        response = chatbot.generate_response(user_message, conversation_history)
        
        return jsonify({
            'response': response,
            'status': 'success'
        })
        
    except Exception as e:
        logger.error(f"Chat endpoint error: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'status': 'error'
        }), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)