import { create } from 'zustand';
import type { Product } from '../services/inventoryService';

export interface CartItem extends Product {
  quantity: number;
  itemDiscount: number;
}

interface CartState {
  items: CartItem[];
  globalDiscount: number; // percentage
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateItemDiscount: (productId: string, discount: number) => void;
  setGlobalDiscount: (discount: number) => void;
  clearCart: () => void;
  
  // Computed helpers exposed as state or computed in components
  // To keep Zustand simple, we will just keep state here and calculate in the component
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  globalDiscount: 0,
  
  addItem: (product) => set((state) => {
    const existing = state.items.find(i => i.id === product.id);
    if (existing) {
      return {
        items: state.items.map(i => 
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      };
    }
    return { items: [...state.items, { ...product, quantity: 1, itemDiscount: 0 }] };
  }),
  
  removeItem: (productId) => set((state) => ({
    items: state.items.filter(i => i.id !== productId)
  })),
  
  updateQuantity: (productId, quantity) => set((state) => ({
    items: state.items.map(i => i.id === productId ? { ...i, quantity: Math.max(1, quantity) } : i)
  })),
  
  updateItemDiscount: (productId, discount) => set((state) => ({
    items: state.items.map(i => i.id === productId ? { ...i, itemDiscount: discount } : i)
  })),
  
  setGlobalDiscount: (discount) => set({ globalDiscount: discount }),
  
  clearCart: () => set({ items: [], globalDiscount: 0 }),
}));
