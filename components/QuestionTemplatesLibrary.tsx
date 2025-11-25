'use client';

import { useState } from 'react';
import { FiBook, FiBriefcase, FiCodepen, FiGlobe, FiSearch, FiX } from 'react-icons/fi';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[80vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-primary-600 dark:text-primary-400">
              <FiBook className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Question Templates
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Choose from pre-built questions
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

        {/* Search and Filter */}
        <div className="p-6 space-y-4 border-b border-gray-100 dark:border-gray-800">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="modern-input pl-11"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Templates List */}
        <div className="p-6 overflow-y-auto max-h-[50vh] space-y-3 custom-scrollbar">
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <button
                  key={template.id}
                  onClick={() => handleSelectQuestion(template.question)}
                  className="w-full flex items-start gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all text-left group"
                >
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
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
