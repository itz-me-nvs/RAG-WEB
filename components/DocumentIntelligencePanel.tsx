'use client';

import { useState } from 'react';
import { FiBook, FiHash, FiTrendingUp, FiUser, FiClock, FiFileText, FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface DocumentIntelligence {
  summary: string;
  keyTopics: string[];
  entities: {
    people: string[];
    organizations: string[];
    locations: string[];
    dates: string[];
  };
  statistics: {
    wordCount: number;
    pageCount: number;
    readingTime: string;
  };
}

interface Props {
  intelligence: DocumentIntelligence | null;
  isLoading?: boolean;
}

export default function DocumentIntelligencePanel({ intelligence, isLoading }: Props) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!intelligence && !isLoading) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
            <FiBook className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Document Intelligence
          </h3>
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-full">
            PRO
          </span>
        </div>
        {isExpanded ? (
          <FiChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <FiChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : intelligence ? (
            <>
              {/* Summary */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <FiFileText className="h-4 w-4 text-blue-600" />
                  Quick Summary
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {intelligence.summary}
                </p>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {intelligence.statistics.wordCount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Words</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {intelligence.statistics.pageCount}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Pages</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {intelligence.statistics.readingTime}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Read Time</div>
                </div>
              </div>

              {/* Key Topics */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <FiHash className="h-4 w-4 text-indigo-600" />
                  Key Topics
                </h4>
                <div className="flex flex-wrap gap-2">
                  {intelligence.keyTopics.map((topic, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Entities */}
              {(intelligence.entities.people.length > 0 ||
                intelligence.entities.organizations.length > 0 ||
                intelligence.entities.locations.length > 0) && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <FiTrendingUp className="h-4 w-4 text-purple-600" />
                    Extracted Entities
                  </h4>
                  <div className="space-y-2">
                    {intelligence.entities.people.length > 0 && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2 mb-1">
                          <FiUser className="h-3 w-3" />
                          People:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {intelligence.entities.people.slice(0, 5).map((person, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded"
                            >
                              {person}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {intelligence.entities.organizations.length > 0 && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                          Organizations:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {intelligence.entities.organizations.slice(0, 5).map((org, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs rounded"
                            >
                              {org}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
