# Languague_Tutor_AI_Assistant
A simple AI assistant API 


This repository contains a Node.js backend that serves as an interface for interacting with the OpenAI GPT-based language model. The assistant allows you to communicate with the OpenAI API, providing natural language processing capabilities.

## Features

- Integration with OpenAI GPT-4 model for language understanding.
- RESTful API endpoints for handling user messages and obtaining assistant responses.
- Dynamic creation of threads for managing user conversations.

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/OpenAI-Node-Assistant.git

2.Navigate to the project directory:
 ```bash
  cd OpenAI-Node-Assistant

3.Install dependencies:
  npm install
  
4.Configure your OpenAI API key:
  Replace 'REPLACE_WITH_YOUR_OPENAI_API_KEY' in server.js with your actual OpenAI API key.

5.Start the Node.js server:

  node server.js
  
The server will be running at http://localhost:3000.

API Endpoints:
POST /run-message:
Request Body:
{
  "threadId": "optional-thread-id",
  "message": "user-input-message"
}
Response:
{
  "threadId": "thread-id",
  "response": "assistant-response-message"
}
