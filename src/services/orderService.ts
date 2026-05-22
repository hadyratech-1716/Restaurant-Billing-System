import { collection, doc, serverTimestamp, runTransaction } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { CartItem } from '../store/useCartStore';

export interface OrderData {
  items: CartItem[];
  subtotal: number;
  totalDiscount: number;
  totalGst: number;
  grandTotal: number;
  paymentMethod: string;
  servedBy: string;
}

export const orderService = {
  async processOrder(orderData: OrderData): Promise<string> {
    const orderRef = doc(collection(db, 'orders'));
    
    await runTransaction(db, async (transaction) => {
      // 1. Check and deduct stock for each item
      for (const item of orderData.items) {
        const productRef = doc(db, 'products', item.id);
        const productDoc = await transaction.get(productRef);
        
        if (!productDoc.exists()) {
          throw new Error(`Product ${item.name} no longer exists.`);
        }
        
        const currentStock = productDoc.data().stockLevel;
        if (currentStock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.name}. Available: ${currentStock}`);
        }
        
        transaction.update(productRef, { stockLevel: currentStock - item.quantity });
      }

      // 2. Save the order
      transaction.set(orderRef, {
        ...orderData,
        createdAt: serverTimestamp(),
      });
    });

    return orderRef.id;
  }
};
