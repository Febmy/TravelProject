import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  type: 'TOUR' | 'HOTEL';
  itemId: string; // scheduleId for TOUR, roomId for HOTEL
  title: string;
  image?: string;
  price: number;
  quantity: number; // Participants or Rooms
  date?: string; // e.g. "12 Mar 2026 - 15 Mar 2026"
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existingItem = get().items.find((i) => i.itemId === item.itemId);
        if (existingItem) {
          // Update quantity if already in cart
          set({
            items: get().items.map((i) =>
              i.itemId === item.itemId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id, quantity) =>
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }),
      clearCart: () => set({ items: [] }),
      getTotal: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: 'safara-cart', // key for localStorage
    }
  )
);
