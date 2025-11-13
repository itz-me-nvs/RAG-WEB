'use client';

import { useState } from 'react';
import { FiList, FiAlignLeft, FiGrid, FiClock, FiChevronDown } from 'react-icons/fi';

export type OutputStyle = 'natural' | 'bullets' | 'summary' | 'timeline' | 'comparison';

interface Props {
  onStyleChange: (style: OutputStyle) => void;
  currentStyle: OutputStyle;
  disabled?: boolean;
}

const STYLES = [
  {
    id: 'natural' as OutputStyle,
    name: 'Natural',
    description: 'Conversational response',
    icon: FiAlignLeft,
  },
  {
    id: 'bullets' as OutputStyle,
    name: 'Bullet Points',
    description: 'Key points in bullets',
    icon: FiList,
  },
  {
    id: 'summary' as OutputStyle,
    name: 'Summary Card',
    description: 'Structured summary',
    icon: FiGrid,
  },
  {
    id: 'timeline' as OutputStyle,
    name: 'Timeline',
    description: 'Chronological view',
    icon: FiClock,
  },
];

export default function OutputStyleSelector({ onStyleChange, currentStyle, disabled }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const currentStyleData = STYLES.find((s) => s.id === currentStyle);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        title="Change output style"
      >
        {currentStyleData && (
          <>
            <currentStyleData.icon className="h-4 w-4" />
            <span className="text-sm font-medium">{currentStyleData.name}</span>
            <FiChevronDown className="h-4 w-4" />
          </>
        )}
      </button>

      {isOpen && !disabled && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            <div className="p-2 space-y-1">
              {STYLES.map((style) => {
                const Icon = style.icon;
                const isSelected = style.id === currentStyle;

                return (
                  <button
                    key={style.id}
                    onClick={() => {
                      onStyleChange(style.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                        : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className={`h-5 w-5 mt-0.5 ${isSelected ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{style.name}</div>
                      <div className={`text-xs ${isSelected ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                        {style.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border-t border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 text-xs text-purple-700 dark:text-purple-300">
                <span className="px-2 py-0.5 bg-purple-200 dark:bg-purple-900/40 rounded-full font-semibold">
                  PRO
                </span>
                <span>Enhanced output styles available</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
