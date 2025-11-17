'use client';

import { useEffect, useState } from 'react';
import { FaCheck, FaCoffee, FaCog, FaExternalLinkAlt, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function SettingsPage() {
  const [groqApiKey, setGroqApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('groq_api_key');
    if (savedKey) {
      setGroqApiKey(savedKey);
      setIsSaved(true);
    }
  }, []);

  const handleSaveApiKey = () => {
    setIsLoading(true);

    // Save to localStorage
    if (groqApiKey.trim()) {
      localStorage.setItem('groq_api_key', groqApiKey.trim());
      setIsSaved(true);

      // Show success feedback
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } else {
      localStorage.removeItem('groq_api_key');
      setIsSaved(false);
      setIsLoading(false);
    }
  };

  const handleRemoveApiKey = () => {
    localStorage.removeItem('groq_api_key');
    setGroqApiKey('');
    setIsSaved(false);
  };

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
            Configure your API keys and support the project
          </p>
        </div>

        {/* Settings Content */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-blue-200">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">General Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-blue-100">
                  <div>
                    <h3 className="font-medium text-gray-900">Theme</h3>
                    <p className="text-sm text-gray-600">Choose your preferred theme</p>
                  </div>
                  <select className="px-4 py-2 rounded-lg border-2 border-blue-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                    <option>Light</option>
                    <option>Dark</option>
                    <option>System</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-blue-100">
                  <div>
                    <h3 className="font-medium text-gray-900">Language</h3>
                    <p className="text-sm text-gray-600">Select your language preference</p>
                  </div>
                  <select className="px-4 py-2 rounded-lg border-2 border-blue-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="font-medium text-gray-900">Notifications</h3>
                    <p className="text-sm text-gray-600">Enable or disable notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* API Key Input */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Your Groq API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={groqApiKey}
                  onChange={(e) => {
                    setGroqApiKey(e.target.value);
                    setIsSaved(false);
                  }}
                  placeholder="gsk_..."
                  className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  title={showApiKey ? 'Hide API key' : 'Show API key'}
                >
                  {showApiKey ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>

              {isSaved && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                  <FaCheck className="h-4 w-4" />
                  <span>API key saved successfully</span>
                </div>
              )}
            </div>

            {/* How to get API key */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                How to get your Groq API key:
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400 ml-2">
                <li>Visit <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1">console.groq.com <FaExternalLinkAlt className="h-3 w-3" /></a></li>
                <li>Sign up for a free account (no credit card required)</li>
                <li>Navigate to API Keys section</li>
                <li>Create a new API key and copy it</li>
                <li>Paste it above and click Save</li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSaveApiKey}
                disabled={!groqApiKey.trim() || isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaCheck className="h-4 w-4" />
                    Save API Key
                  </>
                )}
              </button>

              {isSaved && (
                <button
                  onClick={handleRemoveApiKey}
                  className="px-6 py-3 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Buy Me a Coffee Section */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl shadow-lg border-2 border-yellow-200 dark:border-yellow-800 overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/40 dark:to-orange-900/40 px-6 py-4 border-b border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 shadow-md">
                <FaCoffee className="text-white text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Support This Project
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Help keep this project free and open-source
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="text-gray-700 dark:text-gray-300 space-y-3">
              <p className="font-semibold text-lg">
                ☕ Enjoying this free RAG chatbot?
              </p>
              <p className="text-sm leading-relaxed">
                This project is completely free and open-source. If you find it useful and want to support
                continued development, consider buying me a coffee! Your support helps cover development
                time, server costs, and keeps new features coming.
              </p>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-2">
                <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                  What your support enables:
                </p>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    New features and improvements
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Bug fixes and maintenance
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Better documentation and tutorials
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Community support
                  </li>
                </ul>
              </div>
            </div>

            {/* Buy Me a Coffee Button */}
            <a
              href="https://www.buymeacoffee.com/yourhandle"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold text-lg shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <FaCoffee className="text-2xl" />
              <span>Buy Me a Coffee</span>
              <FaExternalLinkAlt className="text-sm" />
            </a>

            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              Every coffee helps and is greatly appreciated! 🙏
            </p>
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
