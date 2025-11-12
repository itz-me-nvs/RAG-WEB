'use client';

import { useEffect, useState } from 'react';
import { FiX, FiDownload, FiChevronLeft, FiChevronRight, FiFile, FiLayers } from 'react-icons/fi';

interface Slide {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
}

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'pdf' | 'slider';
  title: string;
  pdfUrl?: string;
  slides?: Slide[];
  onDownload: () => void;
}

export default function DocumentPreviewModal({
  isOpen,
  onClose,
  type,
  title,
  pdfUrl,
  slides = [],
  onDownload,
}: DocumentPreviewModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Arrow key navigation for slides
  useEffect(() => {
    if (type !== 'slider' || !isOpen) return;

    const handleKeyNav = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentSlide(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1));
      }
    };

    document.addEventListener('keydown', handleKeyNav);
    return () => document.removeEventListener('keydown', handleKeyNav);
  }, [type, isOpen, slides.length]);

  if (!isOpen) return null;

  const Icon = type === 'pdf' ? FiFile : FiLayers;
  const typeLabel = type === 'pdf' ? 'PDF Document' : 'Presentation';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="relative w-full h-full max-w-7xl max-h-[95vh] m-4 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl flex flex-col animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center
              ${type === 'pdf'
                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
              }
            `}>
              <Icon size={20} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {typeLabel}
                {type === 'slider' && slides.length > 0 && ` • ${slides.length} slides`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onDownload}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Download"
            >
              <FiDownload size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {type === 'pdf' && pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full border-0"
              title={title}
            />
          ) : type === 'slider' && slides.length > 0 ? (
            <div className="h-full flex flex-col">
              {/* Slide Content */}
              <div className="flex-1 overflow-auto p-8">
                <div className="max-w-4xl mx-auto">
                  {/* Slide Number */}
                  <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">
                    Slide {currentSlide + 1} of {slides.length}
                  </div>

                  {/* Slide Card */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl p-8 shadow-lg min-h-[400px]">
                    {slides[currentSlide].imageUrl && (
                      <div className="mb-6 rounded-xl overflow-hidden">
                        <img
                          src={slides[currentSlide].imageUrl}
                          alt={slides[currentSlide].title}
                          className="w-full h-auto"
                        />
                      </div>
                    )}
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      {slides[currentSlide].title}
                    </h3>
                    <div className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {slides[currentSlide].content}
                    </div>
                  </div>
                </div>
              </div>

              {/* Slide Navigation */}
              <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between max-w-4xl mx-auto">
                  <button
                    onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                    disabled={currentSlide === 0}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold
                      transition-all duration-200
                      ${currentSlide === 0
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'bg-primary-500 text-white hover:bg-primary-600 hover:shadow-lg'
                      }
                    `}
                  >
                    <FiChevronLeft size={20} />
                    <span>Previous</span>
                  </button>

                  {/* Slide Indicators */}
                  <div className="flex items-center gap-2">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`
                          w-2.5 h-2.5 rounded-full transition-all duration-200
                          ${index === currentSlide
                            ? 'bg-primary-500 w-8'
                            : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                          }
                        `}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
                    disabled={currentSlide === slides.length - 1}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold
                      transition-all duration-200
                      ${currentSlide === slides.length - 1
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'bg-primary-500 text-white hover:bg-primary-600 hover:shadow-lg'
                      }
                    `}
                  >
                    <span>Next</span>
                    <FiChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              <p>No content available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
