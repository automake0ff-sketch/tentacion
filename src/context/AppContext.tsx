'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BusinessConfig, Category, Product, Promotion, CartItem, OrderRecord, ReservationRequest } from '@/types';
import { INITIAL_BUSINESS_CONFIG, INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_PROMOTIONS } from '@/data/initialData';

interface AppContextType {
  config: BusinessConfig;
  categories: Category[];
  products: Product[];
  promotions: Promotion[];
  cart: CartItem[];
  orders: OrderRecord[];
  reservations: ReservationRequest[];
  isAdminAuthenticated: boolean;
  
  // Cart Actions
  addToCart: (product: Product, quantity?: number, notes?: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  updateCartNotes: (productId: string, notes: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getCartTotal: () => { subtotal: number; total: number; itemCount: number };

  // Orders & Reservations
  submitOrder: (order: Omit<OrderRecord, 'id' | 'createdAt' | 'status'>) => OrderRecord;
  updateOrderStatus: (orderId: string, status: OrderRecord['status']) => void;
  submitReservation: (req: Omit<ReservationRequest, 'id' | 'createdAt' | 'status'>) => ReservationRequest;
  updateReservationStatus: (reqId: string, status: ReservationRequest['status']) => void;

  // Admin Data Management
  updateConfig: (newConfig: Partial<BusinessConfig>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductAvailability: (id: string) => void;
  
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  addPromotion: (promo: Omit<Promotion, 'id'>) => void;
  updatePromotion: (id: string, promo: Partial<Promotion>) => void;
  deletePromotion: (id: string) => void;

  // Admin Auth
  loginAdmin: (token: string) => boolean;
  logoutAdmin: () => void;

  // Reset to default
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CONFIG: 'la_tentacion_config_v1',
  PRODUCTS: 'la_tentacion_products_v1',
  CATEGORIES: 'la_tentacion_categories_v1',
  PROMOTIONS: 'la_tentacion_promotions_v1',
  CART: 'la_tentacion_cart_v1',
  ORDERS: 'la_tentacion_orders_v1',
  RESERVATIONS: 'la_tentacion_reservations_v1',
  AUTH: 'la_tentacion_auth_token_v1',
};

// Safe Admin Session Secret Check
// Note: Can be verified against a hashed challenge or environment
const ADMIN_SECURITY_PASSPHRASE = 'tentacion2026';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<BusinessConfig>(INITIAL_BUSINESS_CONFIG);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [promotions, setPromotions] = useState<Promotion[]>(INITIAL_PROMOTIONS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [reservations, setReservations] = useState<ReservationRequest[]>([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (savedConfig) setConfig(JSON.parse(savedConfig));

      const savedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (savedCategories) setCategories(JSON.parse(savedCategories));

      const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedPromotions = localStorage.getItem(STORAGE_KEYS.PROMOTIONS);
      if (savedPromotions) setPromotions(JSON.parse(savedPromotions));

      const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedReservations = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
      if (savedReservations) setReservations(JSON.parse(savedReservations));

      const savedAuth = sessionStorage.getItem(STORAGE_KEYS.AUTH);
      if (savedAuth === 'authenticated_session') setIsAdminAuthenticated(true);
    } catch (e) {
      console.warn('Could not read from local storage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error(e);
    }
  }, [config, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(promotions));
    } catch (e) {
      console.error(e);
    }
  }, [promotions, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
    } catch (e) {
      console.error(e);
    }
  }, [reservations, isLoaded]);

  // Cart Functions
  const addToCart = (product: Product, quantity = 1, notes = '') => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
          itemNotes: notes || next[existingIndex].itemNotes,
        };
        return next;
      }
      return [...prev, { product, quantity, itemNotes: notes }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.product.id !== productId);
      }
      return prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item));
    });
  };

  const updateCartNotes = (productId: string, notes: string) => {
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, itemNotes: notes } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    let subtotal = 0;
    let itemCount = 0;
    for (const item of cart) {
      const pPrice = item.product.price ?? 0;
      subtotal += pPrice * item.quantity;
      itemCount += item.quantity;
    }
    return { subtotal, total: subtotal, itemCount };
  };

  // Orders
  const submitOrder = (orderData: Omit<OrderRecord, 'id' | 'createdAt' | 'status'>): OrderRecord => {
    const newRecord: OrderRecord = {
      ...orderData,
      id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: 'ready_to_send',
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  const updateOrderStatus = (orderId: string, status: OrderRecord['status']) => {
    setOrders((prev) => prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord)));
  };

  // Reservations
  const submitReservation = (reqData: Omit<ReservationRequest, 'id' | 'createdAt' | 'status'>): ReservationRequest => {
    const newReq: ReservationRequest = {
      ...reqData,
      id: `res-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: 'pending_confirmation',
      createdAt: new Date().toISOString(),
    };
    setReservations((prev) => [newReq, ...prev]);
    return newReq;
  };

  const updateReservationStatus = (reqId: string, status: ReservationRequest['status']) => {
    setReservations((prev) => prev.map((res) => (res.id === reqId ? { ...res, status } : res)));
  };

  // Config Update
  const updateConfig = (newConfig: Partial<BusinessConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  // Product CRUD
  const addProduct = (prod: Omit<Product, 'id'>) => {
    const newP: Product = {
      ...prod,
      id: `p-${Date.now()}`,
    };
    setProducts((prev) => [...prev, newP]);
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleProductAvailability = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isAvailable: !p.isAvailable } : p))
    );
  };

  // Category CRUD
  const addCategory = (cat: Omit<Category, 'id'>) => {
    const newC: Category = {
      ...cat,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, newC]);
  };

  const updateCategory = (id: string, updatedFields: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Promotion CRUD
  const addPromotion = (promo: Omit<Promotion, 'id'>) => {
    const newPr: Promotion = {
      ...promo,
      id: `promo-${Date.now()}`,
    };
    setPromotions((prev) => [...prev, newPr]);
  };

  const updatePromotion = (id: string, updatedFields: Partial<Promotion>) => {
    setPromotions((prev) => prev.map((pr) => (pr.id === id ? { ...pr, ...updatedFields } : pr)));
  };

  const deletePromotion = (id: string) => {
    setPromotions((prev) => prev.filter((pr) => pr.id !== id));
  };

  // Auth
  const loginAdmin = (passphrase: string) => {
    if (passphrase.trim() === ADMIN_SECURITY_PASSPHRASE) {
      sessionStorage.setItem(STORAGE_KEYS.AUTH, 'authenticated_session');
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    sessionStorage.removeItem(STORAGE_KEYS.AUTH);
    setIsAdminAuthenticated(false);
  };

  const resetToDefaults = () => {
    setConfig(INITIAL_BUSINESS_CONFIG);
    setCategories(INITIAL_CATEGORIES);
    setProducts(INITIAL_PRODUCTS);
    setPromotions(INITIAL_PROMOTIONS);
    setCart([]);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        config,
        categories,
        products,
        promotions,
        cart,
        orders,
        reservations,
        isAdminAuthenticated,
        addToCart,
        updateCartQuantity,
        updateCartNotes,
        removeFromCart,
        clearCart,
        getCartTotal,
        submitOrder,
        updateOrderStatus,
        submitReservation,
        updateReservationStatus,
        updateConfig,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
        addCategory,
        updateCategory,
        deleteCategory,
        addPromotion,
        updatePromotion,
        deletePromotion,
        loginAdmin,
        logoutAdmin,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
