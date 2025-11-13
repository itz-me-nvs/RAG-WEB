'use client';

import { useState } from 'react';
import { FiDownload, FiCopy, FiCheck, FiFileText } from 'react-icons/fi';
import { SourceReference } from '@/lib/chatHistory';

type CitationFormat = 'APA' | 'MLA' | 'Chicago';

interface Props {
  sources: SourceReference[];
  documentTitle: string;
  onClose: () => void;
}

export default function CitationExporter({ sources, documentTitle, onClose }: Props) {
  const [selectedFormat, setSelectedFormat] = useState<CitationFormat>('APA');
  const [copied, setCopied] = useState(false);

  const generateCitation = (format: CitationFormat): string => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Simplified citation generation
    // In production, you'd want more sophisticated citation logic
    const citations = sources.map((source, idx) => {
      const pageRef = source.pageNumber ? ` (p. ${source.pageNumber})` : '';

      switch (format) {
        case 'APA':
          return `[${idx + 1}] ${documentTitle}${pageRef}. Retrieved ${dateStr}.\n   "${source.content.substring(0, 100)}..."`;

        case 'MLA':
          return `[${idx + 1}] "${source.content.substring(0, 100)}..." ${documentTitle}${pageRef}. Accessed ${dateStr}.`;

        case 'Chicago':
          return `[${idx + 1}] ${documentTitle}${pageRef}, accessed ${dateStr}, "${source.content.substring(0, 100)}..."`;

        default:
          return source.content;
      }
    });

    return citations.join('\n\n');
  };

  const citation = generateCitation(selectedFormat);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([citation], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `citations-${selectedFormat}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
                <FiFileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Export Citations
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Generate properly formatted citations from your sources
                </p>
              </div>
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-full">
                PRO
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Format Selector */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Citation Format
          </label>
          <div className="flex gap-3">
            {(['APA', 'MLA', 'Chicago'] as CitationFormat[]).map((format) => (
              <button
                key={format}
                onClick={() => setSelectedFormat(format)}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                  selectedFormat === format
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {format}
              </button>
            ))}
          </div>
        </div>

        {/* Citation Output */}
        <div className="p-6">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700">
            <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono leading-relaxed">
              {citation}
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-semibold"
          >
            {copied ? (
              <>
                <FiCheck className="h-5 w-5 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <FiCopy className="h-5 w-5" />
                Copy to Clipboard
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all font-semibold shadow-lg"
          >
            <FiDownload className="h-5 w-5" />
            Download as TXT
          </button>
        </div>
      </div>
    </div>
  );
}
