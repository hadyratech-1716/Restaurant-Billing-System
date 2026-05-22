import { Outlet } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';
import { Menu } from 'lucide-react';

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-col">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-brand-600 dark:text-brand-400">SmartPOS</h1>
          <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
