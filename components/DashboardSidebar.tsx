'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiLayout, FiMessageSquare, FiPlus, FiSettings } from 'react-icons/fi';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { name: 'Chat List', href: '/dashboard', icon: FiMessageSquare },
    { name: 'Settings', href: '/dashboard/settings', icon: FiSettings },
  ];

  const handleNewChat = () => {
    router.push('/dashboard/chat');
  };

  return (
    <aside
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-gray-900 text-gray-100 flex flex-col h-screen relative z-20 transition-all duration-300 ease-in-out border-r border-gray-800`}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && (
          <span className="text-xl font-bold tracking-tight text-white animate-fadeIn">
            RAG Web
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <FiLayout size={20} />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="px-3 py-2">
        <button
          onClick={handleNewChat}
          className={`
            flex items-center gap-3 px-3 py-3 w-full
            bg-primary-600 hover:bg-primary-700 text-white
            rounded-xl transition-all duration-200 shadow-sm hover:shadow-md
            ${isCollapsed ? 'justify-center' : ''}
          `}
          title="New Chat"
        >
          <FiPlus size={20} strokeWidth={2.5} />
          {!isCollapsed && (
            <span className="font-medium animate-fadeIn whitespace-nowrap">New Chat</span>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                ${isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
              title={isCollapsed ? item.name : ''}
            >
              <item.icon
                size={20}
                strokeWidth={2}
                className={`transition-colors ${isActive ? 'text-primary-400' : ''}`}
              />
              {!isCollapsed && (
                <span className="font-medium animate-fadeIn whitespace-nowrap">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-800">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            U
          </div>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden animate-fadeIn">
              <p className="text-sm font-medium text-gray-200 truncate">User Account</p>
              <p className="text-xs text-gray-500 truncate">Free Plan</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
