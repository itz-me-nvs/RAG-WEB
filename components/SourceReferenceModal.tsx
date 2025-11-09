"use client";

import { FiX, FiFileText, FiHash } from "react-icons/fi";
import { SourceReference } from "@/lib/chatHistory";

interface SourceReferenceModalProps {
  sources: SourceReference[];
  onClose: () => void;
}

export default function SourceReferenceModal({
  sources,
  onClose,
}: SourceReferenceModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-primary-500 to-secondary-500 dark:from-primary-600 dark:to-secondary-600 px-6 py-4 border-b border-primary-600">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/20">
              <FiFileText className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Source References</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-white/20 hover:bg-white/30 p-2 text-white transition-all hover:scale-110 active:scale-95"
            title="Close"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {sources.length === 0 ? (
            <div className="text-center py-12">
              <FiFileText className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400">
                No source references available
              </p>
            </div>
          ) : (
            sources.map((source, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-5 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow"
              >
                {/* Source Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400">
                    <FiHash className="h-4 w-4" />
                    <span>Source {index + 1}</span>
                  </div>
                  {source.pageNumber !== undefined && (
                    <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium">
                      Page {source.pageNumber}
                    </span>
                  )}
                  {source.score !== undefined && (
                    <span className="px-3 py-1 bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-300 rounded-full text-xs font-medium">
                      {Math.round(source.score * 100)}% match
                    </span>
                  )}
                </div>

                {/* Source Content */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {source.content}
                  </p>
                </div>

                {/* Metadata */}
                {source.metadata && Object.keys(source.metadata).length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Additional Information:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(source.metadata).map(([key, value]) => (
                        <span
                          key={key}
                          className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-xs"
                        >
                          {key}: {String(value)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            {sources.length} source{sources.length !== 1 ? "s" : ""} found from
            your uploaded document
          </p>
        </div>
      </div>
    </div>
  );
}
