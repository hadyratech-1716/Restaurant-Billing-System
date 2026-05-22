import { collection, doc, getDocs, setDoc, deleteDoc, query, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  costPrice: number;
  categoryId: string;
  categoryName: string;
  stockLevel: number;
  lowStockThreshold: number;
  gstPercentage: number;
}

const COLLECTION_NAME = 'products';

export const inventoryService = {
  async getProducts(): Promise<Product[]> {
    const q = query(collection(db, COLLECTION_NAME));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  },

  async addProduct(product: Omit<Product, 'id'>): Promise<string> {
    const docRef = doc(collection(db, COLLECTION_NAME));
    const newProduct = { ...product, id: docRef.id };
    await setDoc(docRef, newProduct);
    return docRef.id;
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, data);
  },

  async deleteProduct(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }
};
