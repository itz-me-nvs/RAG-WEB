'use client';

import { useState } from 'react';
import { FiBook, FiCodepen, FiBriefcase, FiGlobe, FiSearch, FiX } from 'react-icons/fi';

interface QuestionTemplate {
  id: string;
  category: string;
  question: string;
  icon: any;
}

const QUESTION_TEMPLATES: QuestionTemplate[] = [
  // Academic/Research
  {
    id: 'research-1',
    category: 'Research',
    question: 'What is the main research question or hypothesis?',
    icon: FiBook,
  },
  {
    id: 'research-2',
    category: 'Research',
    question: 'What methodology was used in this study?',
    icon: FiBook,
  },
  {
    id: 'research-3',
    category: 'Research',
    question: 'What are the key findings and conclusions?',
    icon: FiBook,
  },
  {
    id: 'research-4',
    category: 'Research',
    question: 'What are the limitations mentioned?',
    icon: FiBook,
  },
  // Legal
  {
    id: 'legal-1',
    category: 'Legal',
    question: 'What are the main obligations outlined in this document?',
    icon: FiBriefcase,
  },
  {
    id: 'legal-2',
    category: 'Legal',
    question: 'What are the key dates and deadlines mentioned?',
    icon: FiBriefcase,
  },
  {
    id: 'legal-3',
    category: 'Legal',
    question: 'What are the termination clauses?',
    icon: FiBriefcase,
  },
  {
    id: 'legal-4',
    category: 'Legal',
    question: 'Who are the parties involved in this agreement?',
    icon: FiBriefcase,
  },
  // Technical Documentation
  {
    id: 'tech-1',
    category: 'Technical',
    question: 'What are the system requirements?',
    icon: FiCodepen,
  },
  {
    id: 'tech-2',
    category: 'Technical',
    question: 'How do I configure the setup?',
    icon: FiCodepen,
  },
  {
    id: 'tech-3',
    category: 'Technical',
    question: 'What are the common troubleshooting steps?',
    icon: FiCodepen,
  },
  {
    id: 'tech-4',
    category: 'Technical',
    question: 'What APIs or integrations are available?',
    icon: FiCodepen,
  },
  // General Analysis
  {
    id: 'general-1',
    category: 'General',
    question: 'Summarize the key points in bullet points',
    icon: FiGlobe,
  },
  {
    id: 'general-2',
    category: 'General',
    question: 'What are the main topics covered?',
    icon: FiGlobe,
  },
  {
    id: 'general-3',
    category: 'General',
    question: 'Are there any important numbers or statistics?',
    icon: FiGlobe,
  },
  {
    id: 'general-4',
    category: 'General',
    question: 'What action items or recommendations are mentioned?',
    icon: FiGlobe,
  },
];

interface Props {
  onSelectQuestion: (question: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuestionTemplatesLibrary({ onSelectQuestion, isOpen, onClose }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Research', 'Legal', 'Technical', 'General'];

  const filteredTemplates = QUESTION_TEMPLATES.filter((template) => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = template.question.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectQuestion = (question: string) => {
    onSelectQuestion(question);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[80vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
              <FiBook className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Question Templates
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose from pre-built questions for different document types
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-white/80 dark:bg-gray-700 p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Search and Filter */}
        <div className="p-6 space-y-4 border-b border-gray-200 dark:border-gray-700">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Templates List */}
        <div className="p-6 overflow-y-auto max-h-[50vh] space-y-2">
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <button
                  key={template.id}
                  onClick={() => handleSelectQuestion(template.question)}
                  className="w-full flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-left group border border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 group-hover:from-blue-500 group-hover:to-indigo-600 transition-all">
                    <Icon className="h-5 w-5 text-blue-600 dark:text-blue-300 group-hover:text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {template.question}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {template.category}
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No templates found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
