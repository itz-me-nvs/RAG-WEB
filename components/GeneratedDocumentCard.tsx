'use client';

import { FiDownload, FiFile, FiLayers, FiMaximize2 } from 'react-icons/fi';

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
  const iconBg = type === 'pdf' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-orange-50 dark:bg-orange-900/20';
  const iconColor = type === 'pdf' ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400';

  return (
    <div
      className="group relative w-full max-w-md bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
      onClick={onPreview}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`
          flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center
          ${iconBg} ${iconColor}
        `}>
          <Icon size={24} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {typeLabel}
            </span>
            {createdAt && (
              <span className="text-xs text-gray-400">
                {createdAt}
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate mb-1">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-3">
            {pageCount && (
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                {pageCount} {type === 'pdf' ? 'pages' : 'slides'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hover Overlay Actions */}
      <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPreview();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium shadow-sm hover:bg-primary-700 transition-colors"
        >
          <FiMaximize2 size={16} />
          <span>Preview</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownload();
          }}
          className="p-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title="Download"
        >
          <FiDownload size={18} />
        </button>
      </div>
    </div>
  );
}
