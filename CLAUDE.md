# RAG Web Application

## Project Overview
A Next.js-based web application that implements Retrieval-Augmented Generation (RAG) functionality, allowing users to upload documents and ask questions about them using AI.

## Tech Stack

### Frontend
- **Framework**: Next.js 16.0.0 (React 19.2.0)
- **Styling**: Tailwind CSS 4.1.16
- **Icons**: React Icons 5.5.0
- **Language**: TypeScript 5.x
- **Fonts**: Geist (via next/font)

### Backend
- **Server**: Python-based API server
- **API Base URL**: http://127.0.0.1:8000 (configured in .env.local)

## Project Structure

```
rag-web/
├── app/                          # Next.js app directory
│   ├── dashboard/               # Dashboard pages
│   │   ├── chat/               # Chat interface
│   │   ├── layout.tsx          # Dashboard layout
│   │   └── page.tsx            # Main dashboard page
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/                  # React components
│   ├── CitationExporter.tsx
│   ├── ConversationExporter.tsx
│   ├── DashboardSidebar.tsx
│   ├── DocumentGenerationControls.tsx
│   ├── DocumentIntelligencePanel.tsx
│   ├── DocumentPreviewModal.tsx
│   ├── GeneratedDocumentCard.tsx
│   ├── OutputStyleSelector.tsx
│   ├── QuestionTemplatesLibrary.tsx
│   └── SourceReferenceModal.tsx
├── lib/                         # Utility libraries
│   ├── chatHistory.ts          # Chat history management
│   ├── constants.ts            # Application constants
│   └── design-system.ts        # Design system utilities
├── public/                      # Static assets
└── [config files]              # Various configuration files
```

## Key Features
- Document upload functionality
- AI-powered question answering based on uploaded documents
- Chat interface for interacting with documents
- Document preview and source reference modals
- Citation and conversation export capabilities
- Question template library
- Document intelligence panel
- Customizable output styles
- Dashboard with sidebar navigation
- Chat history management

## API Endpoints

The Python backend server exposes the following endpoints:

1. **Upload Document**: `/api/upload`
   - Handles document upload functionality

2. **Custom Chat**: `/api/custom-chat`
   - Processes questions related to uploaded documents
   - Returns AI-generated responses based on document context

## Development

### Prerequisites
- Node.js 20+
- Python backend server running on port 8000

### Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Ensure `.env.local` contains `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000`

3. Start the Python backend server (on port 8000)

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Git Information
- **Current Branch**: main
- **Status**: Clean working directory
- **Recent Features**:
  - Simplified app to focus on core RAG functionality
  - Credit-based paid service with authentication
  - Chat history page with white/blue theme design

## Design System
The application uses a custom design system (lib/design-system.ts) with a white/blue color scheme for consistent UI theming.

## Notes
- The application connects to a local Python backend server for RAG processing
- Document processing and AI inference happen on the backend
- Frontend focuses on user experience and document interaction
- Chat history is managed locally for user convenience
