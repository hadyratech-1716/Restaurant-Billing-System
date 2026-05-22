import { motion } from 'framer-motion';

export default function CustomersPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-8 space-y-6"
    >
      <header>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customers</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your customer database and loyalty points.</p>
      </header>
      <div className="glass-panel p-6 rounded-2xl flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 dark:text-gray-400">Customer module coming soon.</p>
      </div>
    </motion.div>
  );
}
