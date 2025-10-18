import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
from typing import List, Dict, Any
import logging
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

class SimpleRLAChatbot:
    def __init__(self):
        self.conversation_history = []
        
    def generate_response(self, user_message: str, conversation_history: List[Dict[str, str]]) -> str:
        try:
            # Simple system prompt for testing
            system_prompt = """You are RLA (Reasoning Logic Assistant), a helpful AI assistant for OptiU, a conversational optimization platform.

OptiU is like "ChatGPT for Optimization" - we help businesses solve complex optimization challenges through natural language conversations.

Key information about OptiU:
- Product: Opti - conversational optimization platform
- Uses Autonomous Optimization Models (AOMs)
- Pricing: Starter ($100/month), Pro ($250/month), Team ($500/month)
- Applications: Supply chain, finance, logistics, resource allocation
- Features: Natural language input, automatic model selection, explainable results

Be helpful, professional, and focus on how OptiU can solve optimization challenges."""

            # Prepare messages for OpenAI
            messages = [{"role": "system", "content": system_prompt}]
            
            # Add conversation history (last 10 messages)
            messages.extend(conversation_history[-10:])
            
            # Add current user message
            messages.append({"role": "user", "content": user_message})
            
            # Call OpenAI API
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=messages,
                max_tokens=300,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            return "I apologize, but I'm experiencing technical difficulties. Please try again in a moment!"

# Initialize chatbot
chatbot = SimpleRLAChatbot()

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({'error': 'Message is required'}), 400
        
        user_message = data['message']
        conversation_history = data.get('history', [])
        
        logger.info(f"Received message: {user_message}")
        
        # Generate response
        response = chatbot.generate_response(user_message, conversation_history)
        
        logger.info(f"Generated response: {response}")
        
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
    return jsonify({'status': 'healthy', 'message': 'Simple RLA API is running'})

if __name__ == '__main__':
    print("Starting simple RLA API on port 5001...")
    app.run(debug=True, host='0.0.0.0', port=5001)