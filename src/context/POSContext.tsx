import React, { createContext, useContext, useState, useEffect } from 'react';
import { NavView, CartItem, Order, KDSTicket, TableItem, MenuItem } from '../types/pos';
import { INITIAL_ORDERS, INITIAL_KDS_TICKETS, INITIAL_TABLES, MENU_ITEMS } from '../data/mockData';
import { playChime } from '../utils/sound';

interface POSContextType {
  currentView: NavView;
  setCurrentView: (view: NavView) => void;
  activeTableId: string;
  setActiveTableId: (id: string) => void;
  orders: Order[];
  kdsTickets: KDSTicket[];
  tables: TableItem[];
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addToCart: (item: MenuItem, modifiers?: string[], note?: string) => void;
  updateCartQty: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  fireOrderToKitchen: () => void;
  bumpKDSTicket: (ticketId: string) => void;
  recallLastBumped: () => void;
  markTableClean: (tableId: string) => void;
  settleOrder: (tableId: string) => void;
  isTerminalOpen: boolean;
  setIsTerminalOpen: (open: boolean) => void;
  openTableInPOS: (tableId: string) => void;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export const POSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [activeTableId, setActiveTableId] = useState<string>('t-07');
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [kdsTickets, setKdsTickets] = useState<KDSTicket[]>(INITIAL_KDS_TICKETS);
  const [tables, setTables] = useState<TableItem[]>(INITIAL_TABLES);
  const [bumpedTicketsHistory, setBumpedTicketsHistory] = useState<KDSTicket[]>([]);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  // Start with empty cart (0 orders)
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: MenuItem, modifiers: string[] = [], note?: string) => {
    playChime('bump');
    const existingIndex = cart.findIndex(c => c.menuItemId === item.id && c.modifiers.join() === modifiers.join());
    if (existingIndex > -1) {
      const copy = [...cart];
      copy[existingIndex].quantity += 1;
      setCart(copy);
    } else {
      setCart(prev => [
        ...prev,
        {
          id: `ci-${Date.now()}`,
          menuItemId: item.id,
          name: item.name,
          unitPrice: item.price,
          quantity: 1,
          modifiers,
          note
        }
      ]);
    }
  };

  const updateCartQty = (id: string, delta: number) => {
    playChime('bump');
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const removeFromCart = (id: string) => {
    playChime('bump');
    setCart(prev => prev.filter(c => c.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Firing order connects POS -> Live Orders -> KDS -> Tables
  const fireOrderToKitchen = () => {
    if (cart.length === 0) return;
    playChime('bell');

    const subtotal = cart.reduce((s, i) => s + (i.unitPrice * i.quantity), 0);
    const tax = subtotal * 0.08875;
    const gratuity = subtotal * 0.18;
    const total = subtotal + tax + gratuity;

    const currentTable = tables.find(t => t.id === activeTableId);
    const tableLabel = currentTable ? `Table ${currentTable.number.replace('T-', '')}` : 'Table 7';
    const newOrderNum = `#ORD-${Math.floor(1055 + Math.random() * 50)}`;

    // 1. Add to Orders
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      ticketNumber: newOrderNum,
      orderType: 'dine-in',
      tableId: activeTableId,
      tableLabel,
      guestCount: currentTable?.guestCount || 4,
      server: currentTable?.server || 'Marcus Cole #04',
      status: 'prep',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      elapsedMinutes: 0,
      targetMinutes: 14,
      station: 'Grill & Sauté Station',
      items: [...cart],
      subtotal,
      tax,
      gratuity,
      total
    };
    setOrders(prev => [newOrder, ...prev]);

    // 2. Add to KDS
    const newKDSTicket: KDSTicket = {
      id: `kds-${Date.now()}`,
      orderNumber: newOrderNum.replace('#ORD-', '#'),
      tableOrType: `${currentTable?.number || 'T-07'} (${currentTable?.guestCount || 4} Guests) • ${currentTable?.server || 'Marcus C.'}`,
      timeString: '00:00',
      elapsedSeconds: 0,
      targetMinutes: 14,
      statusBadge: 'NEW ORDER',
      headerColor: '#ff8a7a',
      items: cart.map((c, i) => ({
        id: `ki-${Date.now()}-${i}`,
        name: c.name,
        quantity: c.quantity,
        station: 'Grill / Sauté Line',
        mods: c.modifiers,
        allergy: c.note ? `ALLERGY: ${c.note.toUpperCase()}` : undefined,
        completed: false
      }))
    };
    setKdsTickets(prev => [newKDSTicket, ...prev]);

    // 3. Update Table
    setTables(prev => prev.map(t => {
      if (t.id === activeTableId) {
        return {
          ...t,
          status: 'occupied',
          orderTotal: total,
          currentTicket: newOrderNum,
          specialNote: 'Active Kitchen Prep'
        };
      }
      return t;
    }));
  };

  // Bump KDS ticket
  const bumpKDSTicket = (ticketId: string) => {
    const target = kdsTickets.find(t => t.id === ticketId);
    if (!target) return;
    playChime('bump');
    setBumpedTicketsHistory(prev => [target, ...prev]);
    setKdsTickets(prev => prev.filter(t => t.id !== ticketId));

    // Update associated order status in Live Orders to 'ready'
    setOrders(prev => prev.map(o => {
      if (o.ticketNumber.replace('#ORD-', '#') === target.orderNumber) {
        return { ...o, status: 'ready', station: 'Plated @ Pass • Expedited' };
      }
      return o;
    }));
  };

  const recallLastBumped = () => {
    if (bumpedTicketsHistory.length === 0) return;
    playChime('bell');
    const [last, ...rest] = bumpedTicketsHistory;
    setKdsTickets(prev => [last, ...prev]);
    setBumpedTicketsHistory(rest);
  };

  const markTableClean = (tableId: string) => {
    playChime('bump');
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        return {
          ...t,
          status: 'available',
          orderTotal: undefined,
          currentTicket: undefined,
          specialNote: 'Available • Ready to Seat'
        };
      }
      return t;
    }));
  };

  const settleOrder = (tableId: string) => {
    playChime('success');
    // Set table status to 'cleaning'
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        return {
          ...t,
          status: 'cleaning',
          orderTotal: undefined,
          specialNote: 'Needs Turnover • Clean & Reset'
        };
      }
      return t;
    }));
    setCart([]);
  };

  const openTableInPOS = (tableId: string) => {
    setActiveTableId(tableId);
    setCurrentView('pos');
  };

  return (
    <POSContext.Provider value={{
      currentView,
      setCurrentView,
      activeTableId,
      setActiveTableId,
      orders,
      kdsTickets,
      tables,
      cart,
      setCart,
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      fireOrderToKitchen,
      bumpKDSTicket,
      recallLastBumped,
      markTableClean,
      settleOrder,
      isTerminalOpen,
      setIsTerminalOpen,
      openTableInPOS
    }}>
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};
