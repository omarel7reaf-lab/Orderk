import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './views/DashboardView';
import { POSView } from './views/POSView';
import { LiveOrdersView } from './views/LiveOrdersView';
import { KDSView } from './views/KDSView';
import { FloorTablesView } from './views/FloorTablesView';
import { MenuRecipesView, ReportsView, StaffView, SettingsView } from './views/OtherViews';
import { CustomerView } from './views/CustomerView';
import { OrderKTerminal } from './components/OrderKTerminal';
import { TransferModal } from './components/TransferModal';
import { SignOutModal } from './components/SignOutModal';
import { NotificationsPopover } from './components/NotificationsPopover';
import { AuthScreen } from './components/AuthScreen';
import { 
  Terminal as TerminalIcon, 
  LayoutDashboard, 
  ShoppingCart, 
  Receipt, 
  UtensilsCrossed, 
  Grid2x2,
  Menu,
  Sparkles
} from 'lucide-react';
import { POSProvider, usePOS } from './context/POSContext';
import { playChime } from './utils/sound';
import { NavView } from './types/pos';

const AppContent: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    orders,
    kdsTickets,
    isTerminalOpen,
    setIsTerminalOpen,
    activeTableId
  } = usePOS();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState(localStorage.getItem('orderk_user_role') || 'General Manager');
  const [currentUserName, setCurrentUserName] = useState(localStorage.getItem('orderk_user_name') || 'Elena Vance');

  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isCustomer = currentUserRole === 'Customer' || currentUserRole === 'زبون';

  const handleLogOut = () => {
    playChime('bump');
    setIsAuthenticated(false);
    setIsSignOutOpen(false);
  };

  const handleNavigate = (view: NavView) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <AuthScreen
        onAuthenticated={(name, role) => {
          setCurrentUserName(name);
          setCurrentUserRole(role);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 1. DEDICATED CUSTOMER APP (Clean, Uncluttered, Separated)
  // ─────────────────────────────────────────────────────────────
  if (isCustomer) {
    return (
      <div className="min-h-screen w-screen bg-[#070919] text-slate-100 font-sans select-none relative">
        <CustomerView
          userName={currentUserName}
          onOpenTerminal={() => setIsTerminalOpen(true)}
          onLogOut={handleLogOut}
        />

        {/* Customer AI Terminal */}
        <OrderKTerminal
          isOpen={isTerminalOpen}
          onClose={() => setIsTerminalOpen(false)}
          userRole="Customer"
        />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. RESTAURANT OWNER & STAFF OPERATIONAL SUITE
  // ─────────────────────────────────────────────────────────────
  const mobileNavItems: { id: NavView; label: string; icon: any; badge?: number | string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pos', label: 'POS', icon: ShoppingCart },
    { id: 'live-orders', label: 'Orders', icon: Receipt, badge: orders.length },
    { id: 'kds', label: 'KDS', icon: UtensilsCrossed, badge: kdsTickets.length },
    { id: 'floor-tables', label: 'Tables', icon: Grid2x2 },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070919] text-slate-100 font-sans select-none relative">

      {/* ── Mobile/Tablet Overlay Backdrop ── */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar (Responsive: Permanent on Laptop, Drawer on Phone & iPad) ── */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          orderCount={orders.length}
          kdsActiveCount={kdsTickets.length}
          onLockClick={handleLogOut}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* ── Main Container (Laptop / iPad / Phone) ── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">

        {/* Top Header */}
        <Header
          onFastOrderClick={() => { setCurrentView('pos'); setIsSidebarOpen(false); }}
          onOpenTerminal={() => setIsTerminalOpen(true)}
          onTransferClick={() => setIsTransferOpen(true)}
          onLogOutClick={() => setIsSignOutOpen(true)}
          onNotificationsClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          unreadNotificationsCount={3}
          onMenuToggle={() => setIsSidebarOpen(prev => !prev)}
          onSearch={(q) => {
            if (q.trim().length > 0 && currentView !== 'pos') setCurrentView('pos');
          }}
        />

        {/* Notifications Popover */}
        <NotificationsPopover
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          onNavigateToFloor={() => { setCurrentView('floor-tables'); setIsSidebarOpen(false); }}
        />

        {/* View Router */}
        <main className="flex-1 overflow-y-auto bg-[#070919] pb-16 md:pb-0">
          {currentView === 'dashboard' && <DashboardView onNavigate={handleNavigate} />}
          {currentView === 'pos' && <POSView initialTable={activeTableId === 't-07' ? 'T-07' : 'T-04'} />}
          {currentView === 'live-orders' && <LiveOrdersView />}
          {currentView === 'kds' && <KDSView />}
          {currentView === 'floor-tables' && <FloorTablesView onNavigateToPOS={() => setCurrentView('pos')} />}
          {currentView === 'menu-recipes' && <MenuRecipesView />}
          {currentView === 'reports' && <ReportsView />}
          {currentView === 'staff' && <StaffView />}
          {currentView === 'settings' && <SettingsView />}
        </main>

        {/* ── Mobile Phone Bottom Navigation Bar (Visible only on screens <= 768px) ── */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0a0d24]/95 backdrop-blur-lg border-t border-white/[0.08] flex items-center justify-around px-2 z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
          {mobileNavItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-all ${
                  isActive ? 'text-coral-400 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-115 text-coral-400' : ''}`} />
                  {item.badge !== undefined && Number(item.badge) > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 px-1 py-0.2 rounded-full text-[9px] font-bold bg-rose-500 text-white min-w-[14px] text-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-coral-400 absolute bottom-0.5" />
                )}
              </button>
            );
          })}

          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-white transition"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">More</span>
          </button>
        </nav>
      </div>

      {/* Floating Terminal Button */}
      {!isTerminalOpen && (
        <button
          onClick={() => setIsTerminalOpen(true)}
          className="fixed bottom-20 md:bottom-5 right-4 md:right-5 z-40 flex items-center gap-2 px-3.5 md:px-4 py-2.5 rounded-full bg-gradient-to-r from-[#ff9e93] to-[#ff7b72] hover:brightness-110 text-[#190808] font-bold text-xs shadow-2xl shadow-coral-500/40 ring-2 ring-coral-400/50 hover:scale-105 active:scale-95 transition-all duration-200"
          title="افتح OrderK AI"
        >
          <Sparkles className="w-4 h-4 fill-[#190808]" />
          <span className="hidden sm:inline">OrderK AI</span>
        </button>
      )}

      {/* Staff AI Terminal */}
      <OrderKTerminal 
        isOpen={isTerminalOpen} 
        onClose={() => setIsTerminalOpen(false)}
        userRole={currentUserRole}
      />
      <TransferModal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} />
      <SignOutModal isOpen={isSignOutOpen} onClose={() => setIsSignOutOpen(false)} onLockTerminal={handleLogOut} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <POSProvider>
      <AppContent />
    </POSProvider>
  );
};

export default App;
