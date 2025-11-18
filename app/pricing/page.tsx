'use client';

import { FiCheck } from 'react-icons/fi';
import { FaCoins, FaCrown, FaRocket, FaStar } from 'react-icons/fa';
import Link from 'next/link';

export default function PricingPage() {
  const packages = [
    {
      name: 'Starter',
      icon: FaCoins,
      credits: 100,
      price: 9.99,
      popular: false,
      color: 'from-blue-500 to-indigo-600',
      features: [
        '100 questions',
        'Document uploads',
        'Citation export',
        'Basic support',
        'Valid for 30 days',
      ],
    },
    {
      name: 'Pro',
      icon: FaStar,
      credits: 500,
      price: 39.99,
      popular: true,
      color: 'from-indigo-500 to-purple-600',
      features: [
        '500 questions',
        'Priority processing',
        'Advanced analytics',
        'Priority support',
        'Valid for 60 days',
        'Best value!',
      ],
    },
    {
      name: 'Business',
      icon: FaRocket,
      credits: 2000,
      price: 129.99,
      popular: false,
      color: 'from-purple-500 to-pink-600',
      features: [
        '2000 questions',
        'Fastest processing',
        'Team features',
        'Premium support',
        'Valid for 90 days',
        'API access',
      ],
    },
  ];

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
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-semibold mb-6">
            <FaCoins className="h-4 w-4" />
            <span>Credit-Based Pricing</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Credit Package
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-4">
            Pay only for what you use. Get credits to power your RAG chatbot with advanced AI capabilities.
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-500 max-w-2xl mx-auto">
            New users get 100 free credits to get started!
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {packages.map((pkg, idx) => {
            const Icon = pkg.icon;
            return (
              <div
                key={idx}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 ${
                  pkg.popular
                    ? 'border-indigo-500 dark:border-indigo-600 scale-105'
                    : 'border-gray-200 dark:border-gray-700'
                } overflow-hidden transition-transform hover:scale-105`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">
                    MOST POPULAR
                  </div>
                )}

                <div className={`bg-gradient-to-r ${pkg.color} px-6 py-8 text-white`}>
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Icon className="text-3xl" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-center mb-2">{pkg.name}</h2>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-5xl font-bold">${pkg.price}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-white/90">
                      <FaCoins className="h-5 w-5" />
                      <span className="text-xl font-semibold">{pkg.credits.toLocaleString()} Credits</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className="flex items-start gap-3">
                        <FiCheck className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => {
                      // TODO: Integrate with payment system
                      console.log(`Selected package: ${pkg.name}`);
                    }}
                    className={`w-full py-3 rounded-xl bg-gradient-to-r ${pkg.color} text-white font-bold hover:shadow-lg transition-all`}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* What's Included Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 px-8 py-6">
              <h2 className="text-3xl font-bold text-white text-center">
                All Plans Include
              </h2>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  'Document uploads (PDF, DOCX, TXT)',
                  'Web URL processing',
                  'Document Intelligence Panel',
                  'Citation Export (APA, MLA, Chicago)',
                  'Enhanced output styles',
                  'Question templates library',
                  'Conversation export',
                  'PDF viewer with zoom & navigation',
                  'Source reference tracking',
                  'Auto-generated presentations',
                  'Dark mode support',
                  'Mobile responsive design',
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <FiCheck className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 group">
              <summary className="font-semibold text-gray-900 dark:text-gray-100 cursor-pointer list-none flex items-center justify-between">
                How do credits work?
                <FaCrown className="h-5 w-5 transform group-open:rotate-12 transition-transform" />
              </summary>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                Each credit allows you to ask one question to the RAG chatbot. When you purchase a package, credits are added to your account and deducted with each query you make.
              </p>
            </details>

            <details className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 group">
              <summary className="font-semibold text-gray-900 dark:text-gray-100 cursor-pointer list-none flex items-center justify-between">
                Do credits expire?
                <FaCrown className="h-5 w-5 transform group-open:rotate-12 transition-transform" />
              </summary>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                Yes, credits expire based on the package you purchase. Starter credits expire in 30 days, Pro in 60 days, and Business in 90 days. Unused credits will be forfeited after expiration.
              </p>
            </details>

            <details className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 group">
              <summary className="font-semibold text-gray-900 dark:text-gray-100 cursor-pointer list-none flex items-center justify-between">
                Can I buy more credits anytime?
                <FaCrown className="h-5 w-5 transform group-open:rotate-12 transition-transform" />
              </summary>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                Absolutely! You can purchase additional credit packages at any time. New credits will be added to your existing balance and the expiration period will be based on the package purchased.
              </p>
            </details>

            <details className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 group">
              <summary className="font-semibold text-gray-900 dark:text-gray-100 cursor-pointer list-none flex items-center justify-between">
                What payment methods do you accept?
                <FaCrown className="h-5 w-5 transform group-open:rotate-12 transition-transform" />
              </summary>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                We accept all major credit cards, debit cards, and PayPal. All payments are processed securely through our payment provider.
              </p>
            </details>

            <details className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 group">
              <summary className="font-semibold text-gray-900 dark:text-gray-100 cursor-pointer list-none flex items-center justify-between">
                Is there a free trial?
                <FaCrown className="h-5 w-5 transform group-open:rotate-12 transition-transform" />
              </summary>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                Yes! New users receive 100 free credits when they sign up. This allows you to test the platform and see if it meets your needs before purchasing additional credits.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
