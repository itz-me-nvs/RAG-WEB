# RAG Web Application - Qwen Context

## Project Overview
This is a RAG (Retrieval Augmented Generation) web application built with Next.js. The application allows users to upload documents or website links, ask questions based on the content, generate documents and slides, maintain chat history, and view source mappings.

## Technology Stack
- Framework: Next.js
- Language: TypeScript
- Styling: Tailwind CSS (based on globals.css and chatbot.css)
- Package Manager: npm

## MVP Features

### 1. RAG Operations
- **Document Upload**: Users can upload documents (PDF, DOCX, TXT, etc.) to the system
- **Website Link Processing**: Users can provide website URLs for content extraction and indexing
- **Question Answering**: Users can ask questions based on the uploaded documents or website content
- **Contextual Responses**: The system retrieves relevant information from the documents to answer questions

### 2. Document and Slide Generation
- **Document Creation**: Based on chat conversations, generate structured documents
- **Slide Generation**: Convert chat content into presentation slides
- **User Customization**: Allow users to specify format, length, and content preferences for generated outputs

### 3. Chat History Management
- **History Storage**: Save previous conversations for users
- **Conversation Switching**: Allow users to navigate between different chat sessions
- **Session Organization**: Implement a list page to view and select previous chats (TODO)
- **Persistent Storage**: Store chat history in a database or local storage

### 4. Source Mapping
- **Content Attribution**: Show users exactly where in the document specific information was found
- **Highlighting**: Highlight relevant sections in the original document when referenced in chat responses
- **Source Links**: Direct users to specific pages, paragraphs, or sections of uploaded documents
- **Reference Tracking**: Maintain links between chat responses and source material

## Additional Features (Future)
- User authentication
- Document sharing
- Advanced formatting options
- API access
- Multi-language support

## Project Structure
```
rag-web/
├── app/                 # Next.js app router pages
├── components/          # React components
├── lib/                 # Utility functions and libraries
├── public/              # Static assets
├── package.json         # Dependencies and scripts
└── README.md            # Project documentation
```

## Key Files
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Project dependencies and scripts
- `app/` - Main application pages and routes
- `components/` - Reusable UI components
- `lib/` - Business logic and utilities