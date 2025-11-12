'use client';

import Link from 'next/link';
import { FaRocket, FaArrowRight } from 'react-icons/fa';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 mb-8">
          <FaRocket className="text-purple-600" />
          <span className="text-sm font-medium text-gray-700">AI-Powered Document Assistant</span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Transform Your Documents
          </span>
          <br />
          <span className="text-gray-900">Into Conversations</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Upload documents, ask questions, and generate professional PDFs, presentations, and CVs with AI-powered intelligence.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="group px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-semibold text-lg hover:scale-105 transition-transform flex items-center space-x-2"
          >
            <span>Get Started</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#features"
            className="px-8 py-4 rounded-xl bg-white border-2 border-gray-300 text-gray-700 font-semibold text-lg hover:border-gray-400 transition-colors"
          >
            Learn More
          </a>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">📄</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Document Analysis</h3>
            <p className="text-gray-600">Upload PDFs, DOCX, or text files and get instant answers to your questions.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate Documents</h3>
            <p className="text-gray-600">Create professional PDFs, presentations, and CV documents effortlessly.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Natural Conversations</h3>
            <p className="text-gray-600">Chat naturally with your documents and get accurate, contextual responses.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
