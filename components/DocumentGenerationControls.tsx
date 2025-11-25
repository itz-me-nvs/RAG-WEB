'use client';

import { useState } from 'react';
import { FiChevronDown, FiFile, FiLayers } from 'react-icons/fi';

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
          flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
          ${disabled || isGenerating
            ? 'text-gray-400 cursor-not-allowed bg-gray-100 dark:bg-gray-800'
            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
          }
        `}
      >
        {isGenerating ? (
          <>
            <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <FiFile size={16} />
            <span>Generate</span>
            <FiChevronDown
              size={14}
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
          <div className="absolute top-full mt-2 right-0 z-20 w-64 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg animate-scaleIn overflow-hidden">
            <div className="p-1">
              {/* PDF Option */}
              <button
                onClick={() => {
                  onGeneratePDF();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0">
                  <FiFile size={16} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    Export as PDF
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Formatted document
                  </p>
                </div>
              </button>

              {/* Slides Option */}
              <button
                onClick={() => {
                  onGenerateSlides();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0">
                  <FiLayers size={16} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    Export as Slides
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Presentation deck
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
