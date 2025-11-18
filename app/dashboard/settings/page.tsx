'use client';

import { useEffect, useState } from 'react';
import { FaCog, FaCoins, FaCreditCard, FaHistory } from 'react-icons/fa';

export default function SettingsPage() {
  const [credits, setCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load user credits on mount
  useEffect(() => {
    // TODO: Replace with actual API call to backend
    // Example: const response = await fetch('/api/user/credits');
    // For now, using mock data
    setTimeout(() => {
      setCredits(250); // Mock data
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-md">
              <FaCog className="text-2xl text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Manage your account and view your credit balance
          </p>
        </div>

        {/* Credit Balance Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl shadow-lg border-2 border-blue-200 dark:border-blue-800 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 px-6 py-4 border-b border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
                <FaCoins className="text-white text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Your Credits
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage your account balance
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Available Credits</p>
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <>
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    {credits.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    1 credit = 1 question answered
                  </p>
                </>
              )}
            </div>

            {/* Credit Status */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Credit Status</span>
                <span className={`text-sm font-semibold ${credits > 100 ? 'text-green-600' : credits > 20 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {credits > 100 ? 'Healthy' : credits > 20 ? 'Low' : 'Critical'}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${credits > 100 ? 'bg-gradient-to-r from-green-500 to-emerald-600' : credits > 20 ? 'bg-gradient-to-r from-yellow-500 to-orange-600' : 'bg-gradient-to-r from-red-500 to-rose-600'}`}
                  style={{ width: `${Math.min(100, (credits / 500) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Buy More Credits Button */}
            <a
              href="/pricing"
              className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-lg shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <FaCreditCard className="text-xl" />
              <span>Buy More Credits</span>
            </a>

            {/* View History Link */}
            <div className="text-center mt-4">
              <a href="/dashboard/history" className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-2">
                <FaHistory className="h-4 w-4" />
                View Usage History
              </a>
            </div>
          </div>
        </div>

        {/* General Settings (kept for theme, etc.) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/40 dark:to-gray-900/60 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              General Settings
            </h2>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Theme</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred theme</p>
              </div>
              <select className="px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Language</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Select your language preference</p>
              </div>
              <select className="px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Enable or disable notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
