export interface BusinessConfig {
  name: string;
  tagline: string;
  description: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  instagramUrl: string;
  officialReservationUrl: string;
  alternativeReservationUrl: string;
  activeReservationProvider: 'official' | 'alternative';
  whatsappReservationEnabled: boolean;
  whatsappOrdersEnabled: boolean;
  orderModes: {
    pickup: boolean;
    delivery: boolean;
    dineIn: boolean;
  };
  schedule: {
    days: string;
    hours: string;
  }[];
  heroImage: string;
  aboutImage: string;
}

export type ProductBadge = 'NUEVO' | 'RECOMENDADO' | 'ESPECIALIDAD' | null;

export type VerificationStatus = 'verified' | 'pending_verification' | 'unconfirmed_format';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number | null; // null if pending verification or unconfirmed
  priceDisplayNote?: string; // e.g. "7 € / 100g", "Consultar precio"
  image: string;
  isSpecialty: boolean;
  isFeatured: boolean;
  isAvailable: boolean; // false if agotado
  badge: ProductBadge;
  allergens: string[];
  sortOrder: number;
  // Audit & Verification metadata required
  verification_status: VerificationStatus;
  source: string;
  last_verified_at: string;
  notes: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  icon?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  itemNotes?: string;
}

export type OrderStatus = 'cart' | 'ready_to_send' | 'whatsapp_opened' | 'confirmed_by_restaurant';

export interface OrderRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  orderMode: 'dineIn' | 'pickup' | 'delivery' | 'query_only';
  tableNumber?: string;
  generalNotes?: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number | null;
    itemNotes?: string;
  }[];
  subtotal: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface ReservationRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  guests: number;
  seatingPreference: 'interior' | 'terraza' | 'indiferente';
  notes?: string;
  status: 'pending_confirmation' | 'contacted';
  createdAt: string;
}

export interface Promotion {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badgeText: string;
  validUntil?: string;
  isActive: boolean;
  image?: string;
  relatedProductId?: string;
  sortOrder: number;
}
