import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, QrCode, ShoppingCart } from 'lucide-react';
import { inventoryService, type Product } from '../services/inventoryService';
import { useCartStore } from '../store/useCartStore';
import { orderService } from '../services/orderService';
import { useAuthStore } from '../store/useAuthStore';

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const { items, addItem, removeItem, updateQuantity, clearCart } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await inventoryService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load POS products", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cart Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalDiscount = items.reduce((sum, item) => sum + item.itemDiscount, 0); // Simplified
  const totalGst = items.reduce((sum, item) => sum + ((item.price * item.quantity - item.itemDiscount) * (item.gstPercentage / 100)), 0);
  const grandTotal = subtotal - totalDiscount + totalGst;

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    
    try {
      const orderId = await orderService.processOrder({
        items,
        subtotal,
        totalDiscount,
        totalGst,
        grandTotal,
        paymentMethod,
        servedBy: user?.uid || 'unknown'
      });
      
      alert(`Order successful! ID: ${orderId}`);
      clearCart();
      loadProducts(); // Refresh stock
    } catch (error: any) {
      alert(`Checkout failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-full flex-col lg:flex-row"
    >
      {/* Product Grid */}
      <div className="flex-1 p-6 border-r border-gray-200 dark:border-gray-700 flex flex-col min-h-[50vh]">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Point of Sale</h1>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-200 dark:border-gray-700 w-full sm:w-64">
            <Search className="w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-gray-900 dark:text-white"
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pr-2">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  onClick={() => addItem(product)}
                  className={`glass-panel p-4 rounded-2xl cursor-pointer hover:shadow-lg transition-all ${product.stockLevel <= 0 ? 'opacity-50 pointer-events-none' : 'hover:-translate-y-1'}`}
                >
                  <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded-xl mb-3 flex items-center justify-center text-gray-400">
                    {/* Placeholder for image */}
                    {product.name.charAt(0)}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white truncate">{product.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-brand-600 dark:text-brand-400 font-bold">₹{product.price.toFixed(2)}</p>
                    <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                      {product.stockLevel} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart Area */}
      <div className="w-full lg:w-96 bg-white dark:bg-gray-800 p-6 flex flex-col border-t lg:border-t-0 border-gray-200 dark:border-gray-700 h-[50vh] lg:h-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Current Order</h2>
          <button onClick={clearCart} className="text-red-500 text-sm hover:underline">Clear</button>
        </div>

        <div className="flex-1 overflow-y-auto mb-6 space-y-4 pr-2">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <ShoppingCart className="w-12 h-12 mb-2 opacity-50" />
              <p>Cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white truncate">{item.name}</h4>
                  <p className="text-sm text-brand-600 dark:text-brand-400">₹{item.price.toFixed(2)}</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 mb-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-1">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><Minus className="w-3 h-3" /></button>
                    <span className="text-sm font-medium w-4 text-center dark:text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Discount</span>
              <span>-₹{totalDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>GST</span>
              <span>+₹{totalGst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-gray-700">
              <span>Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => setPaymentMethod('cash')}
              className={`py-2 rounded-xl flex flex-col items-center gap-1 transition-colors ${paymentMethod === 'cash' ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 border border-brand-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}
            >
              <Banknote className="w-5 h-5" /> <span className="text-xs font-medium">Cash</span>
            </button>
            <button 
              onClick={() => setPaymentMethod('card')}
              className={`py-2 rounded-xl flex flex-col items-center gap-1 transition-colors ${paymentMethod === 'card' ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 border border-brand-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}
            >
              <CreditCard className="w-5 h-5" /> <span className="text-xs font-medium">Card</span>
            </button>
            <button 
              onClick={() => setPaymentMethod('upi')}
              className={`py-2 rounded-xl flex flex-col items-center gap-1 transition-colors ${paymentMethod === 'upi' ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 border border-brand-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}
            >
              <QrCode className="w-5 h-5" /> <span className="text-xs font-medium">UPI/QR</span>
            </button>
          </div>

          <button 
            disabled={items.length === 0 || isProcessing}
            onClick={handleCheckout}
            className="w-full py-4 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-brand-500/30 flex justify-center items-center gap-2"
          >
            {isProcessing ? (
              <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
            ) : (
              `Charge ₹${grandTotal.toFixed(2)}`
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
