'use client';

import { useState } from 'react';
import { FiDownload, FiFileText } from 'react-icons/fi';
import { ChatMessage } from '@/lib/chatHistory';

interface Props {
  chat: ChatMessage[];
  documentTitle: string;
  onClose: () => void;
}

export default function ConversationExporter({ chat, documentTitle, onClose }: Props) {
  const [exporting, setExporting] = useState(false);
  const [includeTimestamps] = useState(true);
  const [includeSources] = useState(true);

  const generateMarkdown = (): string => {
    let markdown = `# Conversation Report: ${documentTitle}\n\n`;
    markdown += `**Generated:** ${new Date().toLocaleString()}\n\n`;
    markdown += `**Total Messages:** ${chat.length}\n\n`;
    markdown += `---\n\n`;

    chat.forEach((message, idx) => {
      const role = message.type === 'user' ? '🧑 **You**' : '🤖 **AI Assistant**';
      markdown += `## ${role}\n\n`;
      markdown += `${message.text}\n\n`;

      if (includeSources && message.sources && message.sources.length > 0) {
        markdown += `### 📚 Sources Referenced:\n\n`;
        message.sources.forEach((source, srcIdx) => {
          const pageRef = source.pageNumber ? ` (Page ${source.pageNumber})` : '';
          markdown += `**[${srcIdx + 1}]**${pageRef}\n`;
          markdown += `> ${source.content.substring(0, 200)}...\n\n`;
        });
      }

      markdown += `---\n\n`;
    });

    return markdown;
  };

  const handleExport = async () => {
    setExporting(true);

    try {
      const markdown = generateMarkdown();

      // Create a downloadable file
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `conversation-report-${Date.now()}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Close modal after a delay
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
              <FiFileText className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Export Conversation
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Download your chat as a professional report
              </p>
            </div>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-full">
              PRO
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <FiFileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Export Details
                </h3>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• Format: Markdown (.md)</li>
                  <li>• Includes: All messages & sources</li>
                  <li>• Messages: {chat.length} total</li>
                  <li>• Can be converted to PDF/DOCX later</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preview
            </label>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700">
              <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-mono">
                {generateMarkdown().substring(0, 500)}...
              </pre>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all font-semibold shadow-lg disabled:opacity-50"
          >
            {exporting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Exporting...
              </>
            ) : (
              <>
                <FiDownload className="h-5 w-5" />
                Export Report
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
