'use client';

import { useState } from 'react';
import { FiCheck, FiCopy, FiDownload, FiFileText, FiX } from 'react-icons/fi';

interface Source {
  pageNumber: number;
  text: string;
}

interface CitationExporterProps {
  sources: Source[];
  documentTitle: string;
  onClose: () => void;
}

export default function CitationExporter({ sources, documentTitle, onClose }: CitationExporterProps) {
  const [format, setFormat] = useState<'apa' | 'mla' | 'chicago'>('apa');
  const [copied, setCopied] = useState(false);

  const generateCitation = (source: Source) => {
    const today = new Date().toLocaleDateString();

    switch (format) {
      case 'apa':
        return `(n.d.). ${documentTitle} (p. ${source.pageNumber}). Retrieved ${today}.`;
      case 'mla':
        return `"${documentTitle}." Page ${source.pageNumber}. Accessed ${today}.`;
      case 'chicago':
        return `${documentTitle}, ${source.pageNumber}. Accessed ${today}.`;
      default:
        return '';
    }
  };

  const allCitations = sources.map(source => generateCitation(source)).join('\n\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(allCitations);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([allCitations], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `citations-${format}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-primary-600 dark:text-primary-400">
              <FiFileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Export Citations
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Generate and export citations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Format Selection */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {(['apa', 'mla', 'chicago'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all uppercase ${
                  format === f
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Preview Area */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-4 mb-6 max-h-60 overflow-y-auto font-mono text-sm shadow-inner custom-scrollbar">
            {sources.map((source, index) => (
              <div key={index} className="mb-4 last:mb-0 border-b border-dashed border-gray-200 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                <p className="text-gray-700 dark:text-gray-300">{generateCitation(source)}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm"
            >
              {copied ? <FiCheck size={18} /> : <FiCopy size={18} />}
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FiDownload size={18} />
              <span>Download Text</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
