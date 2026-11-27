export type NavView = 
  | 'dashboard' 
  | 'pos' 
  | 'live-orders' 
  | 'kds' 
  | 'floor-tables' 
  | 'menu-recipes' 
  | 'reports' 
  | 'staff' 
  | 'settings';

export type OrderType = 'dine-in' | 'takeout' | 'delivery' | 'bar';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  tag?: {
    label: string;
    type: 'special' | 'warning' | 'popular' | 'vegetarian' | 'fresh';
  };
  margin?: string;
  soldTonight?: number;
  revenueTonight?: number;
}

export interface OrderModifier {
  name: string;
  price?: number;
}

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  modifiers: string[];
  note?: string;
  category?: string;
}

export interface Order {
  id: string;
  ticketNumber: string;
  orderType: OrderType;
  tableId?: string;
  tableLabel?: string;
  guestCount?: number;
  customerName?: string;
  server: string;
  status: 'new' | 'prep' | 'ready' | 'settled' | 'void';
  createdAt: string;
  elapsedMinutes: number;
  targetMinutes: number;
  items: CartItem[];
  subtotal: number;
  tax: number;
  gratuity: number;
  total: number;
  station: string;
  isDelayed?: boolean;
  notes?: string;
}

export interface KDSTicketItem {
  id: string;
  name: string;
  quantity: number;
  station: string;
  mods?: string[];
  completed: boolean;
  allergy?: string;
  prepTime?: string;
}

export interface KDSTicket {
  id: string;
  orderNumber: string;
  tableOrType: string;
  guestCount?: number;
  server?: string;
  timeString: string;
  elapsedSeconds: number;
  targetMinutes: number;
  statusBadge: 'NEW ORDER' | 'GRILL IN PROGRESS' | 'LATE +4M' | 'DESSERT FIRE' | 'PICK 19:15';
  headerColor: string; // css accent
  items: KDSTicketItem[];
  isRush?: boolean;
}

export interface TableItem {
  id: string;
  number: string;
  type: string;
  capacity: number;
  room: 'main' | 'patio' | 'bar' | 'private';
  status: 'occupied' | 'available' | 'reserved' | 'cleaning' | 'bill-requested' | 'held' | 'selected';
  server?: string;
  guestCount?: number;
  elapsedMinutes?: number;
  currentTicket?: string;
  orderTotal?: number;
  specialNote?: string;
  reservedTime?: string;
  x?: number;
  y?: number;
}
