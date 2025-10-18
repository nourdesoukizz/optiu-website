# RLA Chat Setup Guide

## Directory Structure

Your project should now have this structure:

```
optiu-website/
├── landing-page.html
├── opti.html
├── overview.html
├── chat.html                 # New chat page
├── js/
│   └── chat.js              # Chat frontend logic
├── api/
│   ├── chat.py              # Flask backend with OpenAI integration
│   ├── requirements.txt     # Python dependencies
│   └── setup.md            # This file
├── docs/
│   └── color-palette.md
└── optiu2.png
```

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd /Users/nourdesouki/optiuwebsite/optiu-website/api
pip install -r requirements.txt
```

### 2. Set Up Environment Variables

Create a `.env` file in the `api` directory:

```bash
cd /Users/nourdesouki/optiuwebsite/optiu-website/api
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
```

**Important**: Replace `your_openai_api_key_here` with your actual OpenAI API key.

### 3. Run the Backend Server

```bash
cd /Users/nourdesouki/optiuwebsite/optiu-website/api
python chat.py
```

The server will run on `http://localhost:5000`

### 4. Serve the Frontend

You need a local server to serve the HTML files (to avoid CORS issues). You can use:

**Option A: Python's built-in server**
```bash
cd /Users/nourdesouki/optiuwebsite/optiu-website
python -m http.server 8000
```

**Option B: Node.js http-server (if you have Node.js)**
```bash
cd /Users/nourdesouki/optiuwebsite/optiu-website
npx http-server -p 8000
```

**Option C: VS Code Live Server extension**
- Install the "Live Server" extension in VS Code
- Right-click on `landing-page.html` and select "Open with Live Server"

### 5. Update API Endpoint (if needed)

If your backend runs on a different port, update the API endpoint in `js/chat.js`:

```javascript
const response = await fetch('http://localhost:5000/api/chat', {
    // ... rest of the code
});
```

## Features Implemented

### Frontend (chat.html + js/chat.js)
- ✅ Beautiful chat interface with message bubbles
- ✅ Auto-resizing text input
- ✅ Typing indicators
- ✅ Smooth animations
- ✅ Responsive design
- ✅ Fallback responses if API fails

### Backend (api/chat.py)
- ✅ Flask REST API
- ✅ OpenAI ChatGPT integration
- ✅ RAG (Retrieval-Augmented Generation) system
- ✅ OptiU-specific knowledge base
- ✅ Context-aware responses
- ✅ Conversation history management
- ✅ Error handling and logging

### RAG Knowledge Base Includes:
- Company information (OptiU, Opti product)
- Pricing tiers and features
- Use cases (supply chain, finance, logistics)
- How the platform works
- Integration capabilities
- Feature descriptions

## Testing the Chat

1. Navigate to the chat page: `http://localhost:8000/chat.html`
2. Try these sample questions:
   - "What is OptiU?"
   - "How much does it cost?"
   - "How does optimization work?"
   - "Can you help with supply chain optimization?"
   - "What integrations do you support?"

## Customization

### Adding More Knowledge
Edit the `knowledge_base` in `api/chat.py` to add more OptiU-specific information.

### Changing the AI Model
In `api/chat.py`, you can change the model from `gpt-3.5-turbo` to `gpt-4` for better responses (higher cost).

### Styling
Modify the CSS in `chat.html` to match your brand preferences.

## Production Deployment

For production, consider:
1. Using a proper WSGI server (Gunicorn, uWSGI)
2. Setting up proper environment variable management
3. Adding rate limiting and authentication
4. Using a proper database for conversation history
5. Adding monitoring and logging