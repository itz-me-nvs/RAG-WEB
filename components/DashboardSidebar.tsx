'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaCog, FaInfoCircle, FaRobot, FaHistory, FaCoins, FaPlus } from 'react-icons/fa';

export default function DashboardSidebar() {
  const pathname = usePathname();
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

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: FaHome },
    { name: 'Chat History', path: '/dashboard/history', icon: FaHistory },
    { name: 'Settings', path: '/dashboard/settings', icon: FaCog },
    { name: 'About', path: '/dashboard/about', icon: FaInfoCircle },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center">
            <FaRobot className="text-white text-xl" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            RAG Assistant
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="text-xl" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer - Credits Display */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        {/* Credits Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FaCoins className="text-blue-600 text-lg" />
              <span className="text-sm font-semibold text-gray-700">Credits</span>
            </div>
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            ) : (
              <span className="text-lg font-bold text-blue-600">{credits.toLocaleString()}</span>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
            <div
              className={`h-1.5 rounded-full transition-all ${credits > 100 ? 'bg-gradient-to-r from-green-500 to-emerald-600' : credits > 20 ? 'bg-gradient-to-r from-yellow-500 to-orange-600' : 'bg-gradient-to-r from-red-500 to-rose-600'}`}
              style={{ width: `${Math.min(100, (credits / 500) * 100)}%` }}
            ></div>
          </div>
          <Link
            href="/pricing"
            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md text-sm font-semibold"
          >
            <FaPlus className="text-xs" />
            <span>Buy Credits</span>
          </Link>
        </div>

        {/* Back to Home Link */}
        <Link
          href="/"
          className="flex items-center justify-center px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
      </div>
    </aside>
  );
}
