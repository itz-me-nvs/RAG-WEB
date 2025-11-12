'use client';

import { FaFileAlt, FaFilePdf, FaFileImage, FaFileCode, FaRobot, FaHistory } from 'react-icons/fa';

export default function FeaturesSection() {
  const features = [
    {
      icon: <FaFileAlt className="text-3xl" />,
      title: 'RAG-Powered Q&A',
      description: 'Leverage Retrieval-Augmented Generation to ask questions and get accurate answers from your documents with source references.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <FaFilePdf className="text-3xl" />,
      title: 'PDF Generation',
      description: 'Generate professional PDF documents from your conversations and content with customizable formatting and styling.',
      gradient: 'from-red-500 to-pink-500',
    },
    {
      icon: <FaFileImage className="text-3xl" />,
      title: 'Presentation Slides',
      description: 'Create beautiful presentation slides automatically from your content with modern templates and designs.',
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      icon: <FaFileCode className="text-3xl" />,
      title: 'CV & Resume Builder',
      description: 'Build professional CVs and resumes with AI assistance, ensuring your documents stand out.',
      gradient: 'from-green-500 to-teal-500',
    },
    {
      icon: <FaRobot className="text-3xl" />,
      title: 'AI Assistant',
      description: 'Interact with an intelligent AI that understands context and provides helpful, accurate responses.',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: <FaHistory className="text-3xl" />,
      title: 'Chat History',
      description: 'Access all your previous conversations and generated documents in one place with easy navigation.',
      gradient: 'from-pink-500 to-rose-500',
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to work smarter with documents and AI-powered assistance.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}
              >
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="inline-block p-8 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to get started?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl">
              Join thousands of users who are already transforming their document workflow with AI.
            </p>
            <a
              href="/dashboard"
              className="inline-block px-8 py-4 rounded-xl bg-white text-indigo-600 font-semibold text-lg hover:scale-105 transition-transform"
            >
              Start Free Today
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
