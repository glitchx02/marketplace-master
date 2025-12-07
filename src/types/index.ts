export type UserRole = 'user' | 'trader' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
}

export interface Trader extends User {
  role: 'trader';
  shopName: string;
  shopDescription: string;
  verified: boolean;
  totalSales: number;
  totalProducts: number;
}

export interface Product {
  id: string;
  traderId: string;
  traderName: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  stock: number;
  sold: number;
  rating: number;
  ratingCount: number;
  referralCode: string;
  createdAt: Date;
  isPromoted: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Comment {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
}

export interface Rating {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  createdAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
}

export interface Analytics {
  views: number;
  sales: number;
  revenue: number;
  conversionRate: number;
}
