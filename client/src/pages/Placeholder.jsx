import { Zap, TrendingUp, Users, BarChart3, Settings } from 'lucide-react';

export default function Placeholder({ page = 'Page' }) {
  const getIcon = (name) => {
    const icons = {
      'Company': <Zap size={48} />,
      'School Admin': <Users size={48} />,
      'Teacher': <BarChart3 size={48} />,
      'Student': <TrendingUp size={48} />,
      'Parent': <Settings size={48} />,
    };
    return icons[name] || <Zap size={48} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6 text-blue-600 dark:text-blue-400">
          {getIcon(page)}
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{page}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          This page is coming soon. We're working hard to bring you amazing features.
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
            📝 Tip: Navigate using the sidebar menu to explore different sections of your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
