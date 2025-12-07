import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Trader, UserRole, Product, CartItem, Comment, Rating, Order } from '@/types';
import { mockUsers, mockTraders, mockProducts, mockComments, mockRatings, mockOrders } from '@/data/mockData';
import { v4 as uuidv4 } from 'uuid';

interface AuthState {
  user: User | Trader | null;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole) => void;
  loginWithGoogle: (role: 'user' | 'trader') => void;
  adminLogin: (email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<User | Trader>) => void;
  deleteAccount: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (email: string, role: UserRole) => {
        let user: User | Trader | null = null;
        
        if (role === 'trader') {
          user = mockTraders.find(t => t.email === email) || {
            id: uuidv4(),
            email,
            name: email.split('@')[0],
            role: 'trader',
            shopName: 'My Shop',
            shopDescription: 'Welcome to my shop!',
            verified: false,
            totalSales: 0,
            totalProducts: 0,
            createdAt: new Date(),
          } as Trader;
        } else {
          user = mockUsers.find(u => u.email === email) || {
            id: uuidv4(),
            email,
            name: email.split('@')[0],
            role: 'user',
            createdAt: new Date(),
          } as User;
        }
        
        set({ user, isAuthenticated: true });
      },

      loginWithGoogle: (role: 'user' | 'trader') => {
        const mockEmail = role === 'trader' ? 'alex@techstore.com' : 'john@example.com';
        get().login(mockEmail, role);
      },

      adminLogin: (email: string, password: string) => {
        if (email === 'admin@marketplace.com' && password === 'admin123') {
          set({
            user: {
              id: 'admin-1',
              email: 'admin@marketplace.com',
              name: 'Admin',
              role: 'admin',
              createdAt: new Date(),
            },
            isAuthenticated: true,
          });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (data) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...data } as User | Trader });
        }
      },

      deleteAccount: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find(item => item.product.id === product.id);
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ items: [...items, { product, quantity }] });
        }
      },

      removeFromCart: (productId) => {
        set({ items: get().items.filter(item => item.product.id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set({
          items: get().items.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

interface ProductState {
  products: Product[];
  comments: Comment[];
  ratings: Rating[];
  orders: Order[];
  addProduct: (product: Omit<Product, 'id' | 'referralCode' | 'createdAt' | 'sold' | 'rating' | 'ratingCount'>) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addComment: (productId: string, userId: string, userName: string, userAvatar: string | undefined, content: string) => void;
  addRating: (productId: string, userId: string, rating: number) => void;
  getUserRating: (productId: string, userId: string) => Rating | undefined;
  getProductComments: (productId: string) => Comment[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  getUserOrders: (userId: string) => Order[];
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: mockProducts,
      comments: mockComments,
      ratings: mockRatings,
      orders: mockOrders,

      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: uuidv4(),
          referralCode: productData.traderName.slice(0, 3).toUpperCase() + '-' + uuidv4().slice(0, 8).toUpperCase(),
          createdAt: new Date(),
          sold: 0,
          rating: 0,
          ratingCount: 0,
        };
        set({ products: [...get().products, newProduct] });
      },

      updateProduct: (id, data) => {
        set({
          products: get().products.map(p => (p.id === id ? { ...p, ...data } : p)),
        });
      },

      deleteProduct: (id) => {
        set({ products: get().products.filter(p => p.id !== id) });
      },

      addComment: (productId, userId, userName, userAvatar, content) => {
        const newComment: Comment = {
          id: uuidv4(),
          productId,
          userId,
          userName,
          userAvatar,
          content,
          createdAt: new Date(),
        };
        set({ comments: [...get().comments, newComment] });
      },

      addRating: (productId, userId, rating) => {
        const ratings = get().ratings;
        const existingRating = ratings.find(
          r => r.productId === productId && r.userId === userId
        );

        let newRatings: Rating[];
        if (existingRating) {
          newRatings = ratings.map(r =>
            r.productId === productId && r.userId === userId
              ? { ...r, rating, createdAt: new Date() }
              : r
          );
        } else {
          newRatings = [
            ...ratings,
            { id: uuidv4(), productId, userId, rating, createdAt: new Date() },
          ];
        }

        // Update product average rating
        const productRatings = newRatings.filter(r => r.productId === productId);
        const avgRating =
          productRatings.reduce((sum, r) => sum + r.rating, 0) / productRatings.length;

        set({ ratings: newRatings });
        get().updateProduct(productId, {
          rating: Math.round(avgRating * 10) / 10,
          ratingCount: productRatings.length,
        });
      },

      getUserRating: (productId, userId) => {
        return get().ratings.find(r => r.productId === productId && r.userId === userId);
      },

      getProductComments: (productId) => {
        return get().comments.filter(c => c.productId === productId);
      },

      addOrder: (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: uuidv4(),
          createdAt: new Date(),
        };
        set({ orders: [...get().orders, newOrder] });
      },

      getUserOrders: (userId) => {
        return get().orders.filter(o => o.userId === userId);
      },
    }),
    {
      name: 'product-storage',
    }
  )
);
