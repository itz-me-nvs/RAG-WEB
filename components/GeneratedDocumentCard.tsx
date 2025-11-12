'use client';

import { FiFile, FiLayers, FiDownload, FiMaximize2 } from 'react-icons/fi';

interface GeneratedDocumentCardProps {
  type: 'pdf' | 'slider';
  title: string;
  description?: string;
  pageCount?: number;
  createdAt?: string;
  onPreview: () => void;
  onDownload: () => void;
}

export default function GeneratedDocumentCard({
  type,
  title,
  description,
  pageCount,
  createdAt,
  onPreview,
  onDownload,
}: GeneratedDocumentCardProps) {
  const Icon = type === 'pdf' ? FiFile : FiLayers;
  const typeLabel = type === 'pdf' ? 'PDF Document' : 'Presentation Slides';
  const bgGradient = type === 'pdf'
    ? 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20'
    : 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20';
  const iconColor = type === 'pdf'
    ? 'text-red-600 dark:text-red-400'
    : 'text-blue-600 dark:text-blue-400';
  const borderColor = type === 'pdf'
    ? 'border-red-200 dark:border-red-800/50'
    : 'border-blue-200 dark:border-blue-800/50';

  return (
    <div
      className={`
        relative group w-full max-w-md
        bg-gradient-to-br ${bgGradient}
        border-2 ${borderColor}
        rounded-2xl p-5
        shadow-lg hover:shadow-2xl
        transition-all duration-300
        cursor-pointer
        hover:scale-[1.02]
        animate-slideInUp
      `}
      onClick={onPreview}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Icon Container */}
        <div className={`
          flex-shrink-0
          w-14 h-14
          rounded-xl
          bg-white dark:bg-gray-800
          shadow-md
          flex items-center justify-center
          ${iconColor}
          group-hover:scale-110
          transition-transform duration-300
        `}>
          <Icon size={28} strokeWidth={2} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`
              text-xs font-semibold uppercase tracking-wide
              ${iconColor}
            `}>
              {typeLabel}
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-4">
        <span className="flex items-center gap-1">
          {pageCount && (
            <>
              <span className="font-medium">{pageCount}</span>
              <span>{type === 'pdf' ? 'pages' : 'slides'}</span>
            </>
          )}
        </span>
        {createdAt && (
          <span className="text-gray-500 dark:text-gray-500">
            {createdAt}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPreview();
          }}
          className={`
            flex-1
            flex items-center justify-center gap-2
            px-4 py-2.5
            bg-white dark:bg-gray-800
            ${iconColor}
            rounded-xl
            font-semibold text-sm
            shadow-sm hover:shadow-md
            transition-all duration-200
            hover:scale-105
          `}
        >
          <FiMaximize2 size={16} />
          <span>Open</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownload();
          }}
          className={`
            flex items-center justify-center
            w-11 h-11
            bg-white dark:bg-gray-800
            ${iconColor}
            rounded-xl
            shadow-sm hover:shadow-md
            transition-all duration-200
            hover:scale-105
          `}
          aria-label="Download"
        >
          <FiDownload size={18} />
        </button>
      </div>

      {/* Hover Indicator */}
      <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-current opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
           style={{ color: type === 'pdf' ? '#dc2626' : '#2563eb' }} />
    </div>
  );
}
