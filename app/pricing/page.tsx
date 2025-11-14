'use client';

import { FiCheck, FiX } from 'react-icons/fi';
import { FaCoffee, FaGithub, FaStar, FaHeart } from 'react-icons/fa';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                RAG Chatbot
              </span>
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-semibold mb-6">
            <FaStar className="h-4 w-4" />
            <span>100% Free & Open Source</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Free{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Forever
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-4">
            Use your own Groq API key and enjoy unlimited access to all features.
            No hidden costs, no subscriptions, no limits.
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-500 max-w-2xl mx-auto">
            If you find this useful, consider supporting development with a coffee ☕
          </p>
        </div>

        {/* Main Card */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-blue-200 dark:border-blue-800 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 px-8 py-6">
              <div className="text-center text-white">
                <h2 className="text-3xl font-bold mb-2">Complete Access</h2>
                <div className="flex items-center justify-center gap-3 text-5xl font-bold my-4">
                  <span>$0</span>
                  <span className="text-2xl font-normal opacity-90">/forever</span>
                </div>
                <p className="text-blue-100 text-lg">
                  Just bring your own Groq API key
                </p>
              </div>
            </div>

            <div className="p-8">
              {/* How it works */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6 border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <FiCheck className="h-5 w-5 text-blue-600" />
                  How It Works
                </h3>
                <ol className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-blue-600">1.</span>
                    <span>Get a free Groq API key from <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">console.groq.com</a> (no credit card required)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-blue-600">2.</span>
                    <span>Enter your API key in Settings</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-blue-600">3.</span>
                    <span>Enjoy unlimited RAG chatbot with all features!</span>
                  </li>
                </ol>
              </div>

              {/* Features List */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {[
                  'Unlimited document uploads',
                  'Unlimited questions',
                  'Document Intelligence Panel',
                  'Citation Export (APA, MLA, Chicago)',
                  'Enhanced output styles',
                  'Question templates library',
                  'Conversation export',
                  'PDF viewer with zoom & navigation',
                  'Multi-format support (PDF, DOCX, TXT)',
                  'Web URL processing',
                  'Source reference tracking',
                  'Auto-generated presentations',
                  'Dark mode support',
                  'Mobile responsive design',
                  'Privacy-focused (local storage)',
                  'Open-source code',
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <FiCheck className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/dashboard/settings"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Get Started Free
                  <FaStar className="h-5 w-5" />
                </Link>
                <a
                  href="https://github.com/yourusername/rag-chatbot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gray-900 dark:bg-gray-700 text-white font-bold text-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-all shadow-lg"
                >
                  <FaGithub className="h-5 w-5" />
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl shadow-xl border-2 border-yellow-200 dark:border-yellow-800 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/40 dark:to-orange-900/40 px-6 py-4 border-b border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center justify-center gap-3">
                <FaCoffee className="text-2xl text-yellow-700 dark:text-yellow-300" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Support Development
                </h2>
              </div>
            </div>

            <div className="p-8 text-center space-y-4">
              <FaHeart className="h-12 w-12 text-red-500 mx-auto" />
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Love this project? Help keep it free and maintained!
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                This is a passion project built in my free time. Your support helps me
                dedicate more time to adding features, fixing bugs, and creating tutorials.
              </p>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-2">
                <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  Every coffee helps with:
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    New features
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Bug fixes
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Documentation
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Support
                  </div>
                </div>
              </div>

              <a
                href="https://www.buymeacoffee.com/yourhandle"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold text-lg shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
              >
                <FaCoffee className="text-2xl" />
                <span>Buy Me a Coffee</span>
              </a>

              <p className="text-xs text-gray-500 dark:text-gray-500">
                Optional but greatly appreciated! 🙏
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 group">
              <summary className="font-semibold text-gray-900 dark:text-gray-100 cursor-pointer list-none flex items-center justify-between">
                Is this really 100% free?
                <FiX className="h-5 w-5 transform group-open:rotate-45 transition-transform" />
              </summary>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                Yes! This project is completely free and open-source. You just need your own Groq API key, which is also free with generous limits. No hidden costs, no premium tiers, no subscriptions.
              </p>
            </details>

            <details className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 group">
              <summary className="font-semibold text-gray-900 dark:text-gray-100 cursor-pointer list-none flex items-center justify-between">
                How much does a Groq API key cost?
                <FiX className="h-5 w-5 transform group-open:rotate-45 transition-transform" />
              </summary>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                Groq offers a generous free tier with no credit card required. Their free tier includes enough credits for thousands of queries. Check their pricing at console.groq.com for the latest information.
              </p>
            </details>

            <details className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 group">
              <summary className="font-semibold text-gray-900 dark:text-gray-100 cursor-pointer list-none flex items-center justify-between">
                Is my API key safe?
                <FiX className="h-5 w-5 transform group-open:rotate-45 transition-transform" />
              </summary>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                Yes! Your API key is stored only in your browser's local storage and never sent to any server except Groq's API. You can verify this in the open-source code on GitHub.
              </p>
            </details>

            <details className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 group">
              <summary className="font-semibold text-gray-900 dark:text-gray-100 cursor-pointer list-none flex items-center justify-between">
                Why should I support with "Buy Me a Coffee"?
                <FiX className="h-5 w-5 transform group-open:rotate-45 transition-transform" />
              </summary>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                Supporting helps me dedicate more time to this project - adding features, fixing bugs, and creating tutorials. It's completely optional, but every coffee is deeply appreciated and motivates me to keep improving the tool!
              </p>
            </details>

            <details className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 group">
              <summary className="font-semibold text-gray-900 dark:text-gray-100 cursor-pointer list-none flex items-center justify-between">
                Can I contribute to the code?
                <FiX className="h-5 w-5 transform group-open:rotate-45 transition-transform" />
              </summary>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                Absolutely! This is an open-source project and contributions are welcome. Check out the GitHub repository to submit pull requests, report bugs, or suggest features.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
