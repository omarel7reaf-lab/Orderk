import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './views/DashboardView';
import { POSView } from './views/POSView';
import { LiveOrdersView } from './views/LiveOrdersView';
import { KDSView } from './views/KDSView';
import { FloorTablesView } from './views/FloorTablesView';
import { MenuRecipesView, ReportsView, StaffView, SettingsView } from './views/OtherViews';
import { OrderKTerminal } from './components/OrderKTerminal';
import { TransferModal } from './components/TransferModal';
import { SignOutModal } from './components/SignOutModal';
import { NotificationsPopover } from './components/NotificationsPopover';
import { AuthScreen } from './components/AuthScreen';
import { Terminal as TerminalIcon } from 'lucide-react';
import { POSProvider, usePOS } from './context/POSContext';
import { playChime } from './utils/sound';

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

  // Strict 6-Digit Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Top header button interactive states
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleLogOut = () => {
    playChime('bump');
    setIsAuthenticated(false);
    setIsSignOutOpen(false);
  };

  // If not authenticated, display strict 6-digit Login / Sign Up screen!
  if (!isAuthenticated) {
    return (
      <AuthScreen
        onAuthenticated={() => {
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070919] text-slate-100 font-sans select-none relative">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentView={currentView} 
        onNavigate={(view) => setCurrentView(view)} 
        orderCount={orders.length}
        kdsActiveCount={kdsTickets.length}
        onLockClick={handleLogOut}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Top Header with functioning buttons */}
        <Header 
          onFastOrderClick={() => setCurrentView('pos')}
          onOpenTerminal={() => setIsTerminalOpen(true)}
          onTransferClick={() => setIsTransferOpen(true)}
          onLogOutClick={() => setIsSignOutOpen(true)}
          onNotificationsClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          unreadNotificationsCount={3}
          onSearch={(q) => {
            if (q.trim().length > 0 && currentView !== 'pos') {
              setCurrentView('pos');
            }
          }}
        />

        {/* Notifications Popover Dropdown */}
        <NotificationsPopover
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          onNavigateToFloor={() => setCurrentView('floor-tables')}
        />

        {/* View Router */}
        <main className="flex-1 overflow-y-auto bg-[#070919]">
          {currentView === 'dashboard' && (
            <DashboardView onNavigate={(view) => setCurrentView(view)} />
          )}

          {currentView === 'pos' && (
            <POSView initialTable={activeTableId === 't-07' ? 'T-07' : 'T-04'} />
          )}

          {currentView === 'live-orders' && (
            <LiveOrdersView />
          )}

          {currentView === 'kds' && (
            <KDSView />
          )}

          {currentView === 'floor-tables' && (
            <FloorTablesView onNavigateToPOS={() => setCurrentView('pos')} />
          )}

          {currentView === 'menu-recipes' && (
            <MenuRecipesView />
          )}

          {currentView === 'reports' && (
            <ReportsView />
          )}

          {currentView === 'staff' && (
            <StaffView />
          )}

          {currentView === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* Floating Terminal Trigger Button */}
      {!isTerminalOpen && (
        <button
          onClick={() => setIsTerminalOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#ff9e93] to-[#ff7b72] hover:brightness-110 text-[#190808] font-bold text-xs shadow-2xl shadow-coral-500/40 ring-2 ring-coral-400/50 hover:scale-105 active:scale-95 transition-all duration-200"
          title="افتح الـ Terminal لطرح أي سؤال حول النظام"
        >
          <TerminalIcon className="w-4 h-4 stroke-[2.5]" />
          <span>Ask OrderK Terminal</span>
          <span className="w-2 h-2 rounded-full bg-[#190808] animate-pulse"></span>
        </button>
      )}

      {/* OrderK Interactive Terminal Modal/Panel */}
      <OrderKTerminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />

      {/* Table & Order Transfer Modal */}
      <TransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
      />

      {/* Sign Out / Exit Modal */}
      <SignOutModal
        isOpen={isSignOutOpen}
        onClose={() => setIsSignOutOpen(false)}
        onLockTerminal={handleLogOut}
      />
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
