'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaCog, FaInfoCircle, FaRobot, FaHistory } from 'react-icons/fa';

export default function DashboardSidebar() {
  const pathname = usePathname();

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

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Link
          href="/"
          className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
      </div>
    </aside>
  );
}
