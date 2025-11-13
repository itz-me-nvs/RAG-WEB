'use client';

import { useState } from 'react';
import { FiCheck, FiZap, FiUsers, FiX } from 'react-icons/fi';
import { FEATURE_TIERS } from '@/lib/design-system';
import Link from 'next/link';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');

  const getPrice = (monthlyPrice: number) => {
    if (billingCycle === 'annually') {
      return (monthlyPrice * 10).toFixed(2); // 2 months free
    }
    return monthlyPrice.toFixed(2);
  };

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
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Simple, Transparent{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Choose the plan that fits your needs. Start free, upgrade when you're ready.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annually')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all relative ${
                billingCycle === 'annually'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Annually
              <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Free Tier */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 hover:shadow-xl transition-all">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Free
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  $0
                </span>
                <span className="text-gray-600 dark:text-gray-400">/month</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Perfect for trying out the platform
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {FEATURE_TIERS.FREE.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <FiCheck className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/dashboard/chat"
              className="block w-full text-center px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              Get Started
            </Link>
          </div>

          {/* Pro Tier - Featured */}
          <div className="bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white relative transform scale-105 hover:scale-110 transition-all">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-white font-bold text-sm shadow-lg">
              MOST POPULAR
            </div>

            <div className="mb-6 mt-4">
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <FiZap className="h-6 w-6" />
                Pro
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">${getPrice(FEATURE_TIERS.PRO.price)}</span>
                <span className="text-blue-100">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
              </div>
              <p className="text-blue-100 mt-2">For power users and professionals</p>
            </div>

            <ul className="space-y-3 mb-8">
              {FEATURE_TIERS.PRO.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <FiCheck className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button className="w-full px-6 py-3 rounded-xl bg-white text-blue-600 font-bold hover:bg-blue-50 transition-all shadow-lg">
              Start Pro Trial
            </button>
          </div>

          {/* Team Tier */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 hover:shadow-xl transition-all">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                <FiUsers className="h-6 w-6 text-purple-600" />
                Team
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  ${getPrice(FEATURE_TIERS.TEAM.price)}
                </span>
                <span className="text-gray-600 dark:text-gray-400">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                For teams and organizations
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {FEATURE_TIERS.TEAM.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <FiCheck className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg">
              Contact Sales
            </button>
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
                Can I upgrade or downgrade at any time?
                <FiX className="h-5 w-5 transform group-open:rotate-45 transition-transform" />
              </summary>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges.
              </p>
            </details>

            <details className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 group">
              <summary className="font-semibold text-gray-900 dark:text-gray-100 cursor-pointer list-none flex items-center justify-between">
                What payment methods do you accept?
                <FiX className="h-5 w-5 transform group-open:rotate-45 transition-transform" />
              </summary>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                We accept all major credit cards, PayPal, and wire transfers for Team plans.
              </p>
            </details>

            <details className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 group">
              <summary className="font-semibold text-gray-900 dark:text-gray-100 cursor-pointer list-none flex items-center justify-between">
                Is there a free trial for Pro?
                <FiX className="h-5 w-5 transform group-open:rotate-45 transition-transform" />
              </summary>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                Yes! We offer a 14-day free trial of Pro with no credit card required. Experience all premium features risk-free.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
