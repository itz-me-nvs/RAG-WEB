/**
 * Design System Constants
 * Ensures consistent styling across the entire application
 */

export const DESIGN_SYSTEM = {
  // Backgrounds
  backgrounds: {
    main: 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50',
    card: 'bg-white dark:bg-gray-800',
    cardGlass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl',
    header: 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md',
  },

  // Border Radius
  borderRadius: {
    card: 'rounded-2xl',
    button: 'rounded-xl',
    input: 'rounded-xl',
    modal: 'rounded-2xl',
  },

  // Gradients
  gradients: {
    primary: 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600',
    primaryHover: 'hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700',
    card: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    success: 'bg-gradient-to-r from-emerald-500 to-teal-600',
    warning: 'bg-gradient-to-r from-amber-500 to-orange-600',
    premium: 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600',
  },

  // Shadows
  shadows: {
    card: 'shadow-lg hover:shadow-xl',
    elevated: 'shadow-2xl',
    soft: 'shadow-md',
  },

  // Spacing
  spacing: {
    page: 'p-4 md:p-8',
    card: 'p-6',
    section: 'py-12 md:py-20',
  },

  // Transitions
  transitions: {
    default: 'transition-all duration-300',
    fast: 'transition-all duration-150',
    slow: 'transition-all duration-500',
  },

  // Typography
  typography: {
    h1: 'text-4xl md:text-5xl lg:text-6xl font-bold',
    h2: 'text-3xl md:text-4xl font-bold',
    h3: 'text-2xl md:text-3xl font-semibold',
    body: 'text-base md:text-lg',
    small: 'text-sm',
  },
} as const;

export const FEATURE_TIERS = {
  FREE: {
    name: 'Free',
    maxDocuments: 3,
    maxQuestionsPerMonth: 50,
    features: [
      'Upload up to 3 documents',
      '50 questions per month',
      'Basic chat interface',
      'PDF viewer',
      'Standard export',
    ],
  },
  PRO: {
    name: 'Pro',
    price: 9.99,
    maxDocuments: -1, // unlimited
    maxQuestionsPerMonth: -1, // unlimited
    features: [
      'Unlimited documents',
      'Unlimited questions',
      'Advanced AI models',
      'Document intelligence panel',
      'Citation export (APA, MLA, Chicago)',
      'Enhanced output styles',
      'Document annotations',
      'Export as professional reports',
      'Question templates library',
      'Multi-document comparison',
      'Priority support',
      'Usage analytics',
    ],
  },
  TEAM: {
    name: 'Team',
    price: 29.99,
    maxDocuments: -1,
    maxQuestionsPerMonth: -1,
    features: [
      'Everything in Pro',
      'Shared workspaces',
      'Team collaboration',
      'Advanced analytics',
      'API access',
      'Custom integrations',
      'Dedicated support',
    ],
  },
} as const;
