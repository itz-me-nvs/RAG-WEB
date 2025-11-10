'use client';

import { useState } from 'react';
import { FiFile, FiLayers, FiChevronDown } from 'react-icons/fi';

interface DocumentGenerationControlsProps {
  onGeneratePDF: () => void;
  onGenerateSlides: () => void;
  disabled?: boolean;
  isGenerating?: boolean;
}

export default function DocumentGenerationControls({
  onGeneratePDF,
  onGenerateSlides,
  disabled = false,
  isGenerating = false,
}: DocumentGenerationControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || isGenerating}
        className={`
          flex items-center gap-2
          px-4 py-2.5
          bg-gradient-to-r from-secondary-500 to-secondary-600
          hover:from-secondary-600 hover:to-secondary-700
          text-white
          rounded-xl
          font-semibold
          shadow-lg hover:shadow-xl
          transition-all duration-200
          ${disabled || isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        `}
      >
        {isGenerating ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <FiFile size={18} />
            <span>Generate Document</span>
            <FiChevronDown
              size={16}
              className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && !isGenerating && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute bottom-full mb-2 right-0 z-20 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-scaleIn">
            <div className="p-2">
              {/* PDF Option */}
              <button
                onClick={() => {
                  onGeneratePDF();
                  setIsOpen(false);
                }}
                className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <FiFile size={20} strokeWidth={2} />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-0.5">
                    Generate PDF
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Create a formatted PDF document from the conversation
                  </p>
                </div>
              </button>

              {/* Divider */}
              <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />

              {/* Slides Option */}
              <button
                onClick={() => {
                  onGenerateSlides();
                  setIsOpen(false);
                }}
                className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <FiLayers size={20} strokeWidth={2} />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-0.5">
                    Generate Slides
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Create a presentation with key points and insights
                  </p>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
