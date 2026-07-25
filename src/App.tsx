import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { AgendaView } from './components/AgendaView';
import { CaixaView } from './components/CaixaView';
import { FinancialView } from './components/FinancialView';
import { MarketingView } from './components/MarketingView';
import { StockView } from './components/StockView';
import { SettingsView } from './components/SettingsView';
import { SecondaryViews } from './components/SecondaryViews';
import { ClientFullProfileView } from './components/client/ClientFullProfileView';

import { CommandPalette } from './components/CommandPalette';
import { ContextDrawer } from './components/ContextDrawer';
import { GlobalDrawerHost } from './components/drawers/GlobalDrawerHost';
import { MobileBottomNavigation } from './components/mobile/MobileBottomNavigation';

import { AppointmentModal } from './components/AppointmentModal';
import { ProductModal } from './components/ProductModal';
import { CouponModal } from './components/CouponModal';
import { ToastContainer } from './components/ui/ToastContainer';

import { BusinessProvider, useBusiness } from './context/BusinessContext';
import { I18nProvider, useTranslation } from './i18n/I18nContext';
import { OperationalProvider, useOperational } from './context/OperationalContext';
import { DrawerProvider, useDrawer } from './context/DrawerContext';

import { TabType, Appointment, Client, Product } from './types';

function AppContent() {
  const { isModuleEnabled, settings } = useBusiness();
  const { t } = useTranslation();
  const { openDrawer, closeDrawer, isOpen: isGlobalDrawerOpen } = useDrawer();
  const {
    appointments,
    clients,
    transactions,
    commissions,
    products,
    movements,
    campaigns,
    coupons,
    waitlist,
    addAppointment,
    updateAppointmentStatus,
    addProduct,
    adjustStock,
    addCoupon,
    toggleCampaignStatus,
  } = useOperational();

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [fullProfileClient, setFullProfileClient] = useState<Client | null>(null);

  // Global Overlay Controls
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<
    'appointment' | 'client' | 'product' | 'professional' | 'transaction'
  >('appointment');
  const [drawerData, setDrawerData] = useState<any>(null);

  // Creation Modals
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Ensure active tab is allowed
  useEffect(() => {
    if (!isModuleEnabled(activeTab)) {
      setActiveTab('dashboard');
    }
  }, [activeTab, isModuleEnabled]);

  // Handlers for Drawer Inspection
  const handleInspectAppointment = (app: Appointment) => {
    openDrawer('appointment', app);
  };

  const handleInspectClient = (client: Client) => {
    openDrawer('client', client);
  };

  const handleInspectProduct = (prod: Product) => {
    setDrawerType('product');
    setDrawerData(prod);
    setIsDrawerOpen(true);
  };

  const handleOpenCheckout = (app: Appointment) => {
    setActiveTab('caixa');
  };

  const getTabTitle = () => {
    return t(`tab.${activeTab}`, settings.tradeName || 'Maison Élégance');
  };

  // If viewing full 360 profile of a client
  if (fullProfileClient) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex font-sans antialiased">
        <ToastContainer />
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setFullProfileClient(null);
            setActiveTab(tab);
          }}
          onNewAppointment={() => setIsAppointmentModalOpen(true)}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            title={`${fullProfileClient.name} — Perfil 360º`}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          />
          <main className="p-4 sm:p-6 md:p-8 flex-1 w-full mx-auto pb-36 md:pb-8">
            <ClientFullProfileView
              client={fullProfileClient}
              onBack={() => setFullProfileClient(null)}
              onOpenAppointmentModal={() => setIsAppointmentModalOpen(true)}
            />
          </main>
        </div>

        <GlobalDrawerHost
          onOpenAppointmentModal={() => setIsAppointmentModalOpen(true)}
          onOpenCheckoutModal={() => setActiveTab('caixa')}
          onToggleFullProfileView={(cli) => setFullProfileClient(cli)}
        />

        <AppointmentModal
          isOpen={isAppointmentModalOpen}
          onClose={() => setIsAppointmentModalOpen(false)}
          onAddAppointment={(newApp) => {
            addAppointment(newApp);
          }}
        />

        {/* Mobile Bottom Navigation Bar */}
        <MobileBottomNavigation
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setFullProfileClient(null);
            setActiveTab(tab);
          }}
          onNewAppointment={() => setIsAppointmentModalOpen(true)}
          hidden={isAppointmentModalOpen || isGlobalDrawerOpen || isCommandPaletteOpen}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex font-sans antialiased selection:bg-rose-900 selection:text-white">
      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewAppointment={() => setIsAppointmentModalOpen(true)}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title={getTabTitle()}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        <main className="p-4 sm:p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto pb-36 md:pb-8">
          {activeTab === 'dashboard' && (
            <DashboardView
              appointments={appointments}
              clients={clients}
              transactions={transactions}
              onNewAppointment={() => setIsAppointmentModalOpen(true)}
              onNewSale={() => setActiveTab('caixa')}
              onSelectTab={(tab) => setActiveTab(tab)}
              onInspectAppointment={handleInspectAppointment}
              onUpdateAppointmentStatus={updateAppointmentStatus}
            />
          )}

          {activeTab === 'agenda' && (
            <AgendaView
              appointments={appointments}
              waitlist={waitlist}
              onNewAppointment={() => setIsAppointmentModalOpen(true)}
              onInspectAppointment={handleInspectAppointment}
              onUpdateAppointmentStatus={updateAppointmentStatus}
            />
          )}

          {activeTab === 'caixa' && isModuleEnabled('caixa') && (
            <CaixaView
              appointments={appointments}
              transactions={transactions}
              products={products}
            />
          )}

          {activeTab === 'financial' && isModuleEnabled('financial') && (
            <FinancialView
              commissions={commissions}
              onUpdateCommissionStatus={() => {}}
            />
          )}

          {activeTab === 'marketing' && isModuleEnabled('marketing') && (
            <MarketingView
              campaigns={campaigns}
              coupons={coupons}
              onToggleCampaignStatus={toggleCampaignStatus}
              onCreateCoupon={() => setIsCouponModalOpen(true)}
            />
          )}

          {activeTab === 'stock' && isModuleEnabled('stock') && (
            <StockView
              products={products}
              movements={movements}
              onAddProduct={() => setIsProductModalOpen(true)}
              onAdjustStock={adjustStock}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              onSaveSettings={() => {}}
            />
          )}

          {(activeTab === 'professionals' ||
            activeTab === 'clients' ||
            activeTab === 'services' ||
            activeTab === 'packages' ||
            activeTab === 'waitlist' ||
            activeTab === 'rooms' ||
            activeTab === 'commissions' ||
            activeTab === 'reports') && (
            <SecondaryViews
              tab={activeTab}
              appointments={appointments}
              clients={clients}
              commissions={commissions}
              onNewAppointment={() => setIsAppointmentModalOpen(true)}
              onInspectClient={handleInspectClient}
            />
          )}
        </main>
      </div>

      {/* Global Drawer Stack Host */}
      <GlobalDrawerHost
        onOpenAppointmentModal={() => setIsAppointmentModalOpen(true)}
        onOpenCheckoutModal={() => setActiveTab('caixa')}
        onToggleFullProfileView={(cli) => {
          closeDrawer();
          setFullProfileClient(cli);
        }}
      />

      {/* Global Overlays */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(tab) => {
          setActiveTab(tab);
          setIsCommandPaletteOpen(false);
        }}
        onNewAppointment={() => {
          setIsCommandPaletteOpen(false);
          setIsAppointmentModalOpen(true);
        }}
        onNewSale={
          isModuleEnabled('caixa')
            ? () => {
                setIsCommandPaletteOpen(false);
                setActiveTab('caixa');
              }
            : undefined
        }
      />

      <ContextDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        type={drawerType}
        data={drawerData}
        onOpenCheckout={handleOpenCheckout}
        onNewAppointmentWithClient={(clientName) => {
          setIsAppointmentModalOpen(true);
        }}
      />

      {/* Modals */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        onAddAppointment={(newApp) => {
          addAppointment(newApp);
        }}
      />

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onAddProduct={(prod) => {
          addProduct(prod);
        }}
      />

      <CouponModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        onAddCoupon={(coup) => {
          addCoupon(coup);
        }}
      />

      {/* Mobile Bottom Navigation Bar & Floating Action Button */}
      <MobileBottomNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewAppointment={() => setIsAppointmentModalOpen(true)}
        hidden={
          isAppointmentModalOpen ||
          isProductModalOpen ||
          isCouponModalOpen ||
          isGlobalDrawerOpen ||
          isDrawerOpen ||
          isCommandPaletteOpen
        }
      />
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <BusinessProvider>
        <OperationalProvider>
          <DrawerProvider>
            <AppContent />
          </DrawerProvider>
        </OperationalProvider>
      </BusinessProvider>
    </I18nProvider>
  );
}
