'use client';

import { FaInfoCircle, FaRobot, FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
              <FaInfoCircle className="text-2xl text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">About</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Learn more about RAG Assistant
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Project Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center">
                <FaRobot className="text-3xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">RAG Assistant</h2>
                <p className="text-gray-600">Version 1.0.0</p>
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                RAG Assistant is an intelligent document companion powered by Retrieval-Augmented Generation technology.
                Upload your documents, ask questions, and generate professional content with AI assistance.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Key Features</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Smart document analysis with RAG technology</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Generate PDFs, presentations, and CV documents</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Natural language conversations with your documents</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Source reference tracking for accuracy</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Support for PDF, DOCX, TXT, and web URLs</span>
                </li>
              </ul>

              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Technology Stack</h3>
              <p className="text-gray-700">
                Built with Next.js, React, TypeScript, and Tailwind CSS. Powered by advanced AI models
                for natural language processing and document understanding.
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors">
                <FaGithub className="text-xl" />
              </a>
              <a href="#" className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors">
                <FaLinkedin className="text-xl" />
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-gray-600 text-sm">
            <p>© {new Date().getFullYear()} RAG Assistant. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
