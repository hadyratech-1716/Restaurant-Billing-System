import { motion } from 'framer-motion';
import { useThemeStore } from '../store/useThemeStore';

export default function SettingsPage() {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-8 max-w-4xl mx-auto"
    >
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your restaurant preferences</p>
      </header>
      
      <div className="glass-panel p-6 rounded-2xl space-y-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Appearance</h2>
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
              <p className="text-sm text-gray-500">Toggle dark mode theme</p>
            </div>
            <button 
              onClick={toggleTheme}
              className={`w-12 h-6 rounded-full relative transition-colors ${isDark ? 'bg-brand-600' : 'bg-gray-300'}`}
            >
              <span className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isDark ? 'translate-x-6' : ''}`}></span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
