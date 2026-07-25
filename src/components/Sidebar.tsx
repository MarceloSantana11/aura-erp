import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCheck,
  Sparkles,
  DollarSign,
  Package,
  Megaphone,
  Plus,
  Crown,
  Clock,
  Gift,
  BarChart3,
  Building2,
  Store,
  ShoppingBag,
} from 'lucide-react';
import { TabType } from '../types';
import { useBusiness } from '../context/BusinessContext';
import { useTranslation } from '../i18n/I18nContext';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onNewAppointment: () => void;
  onNewSale?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onNewAppointment,
  onNewSale,
}) => {
  const { isModuleEnabled, settings, activeLocationName } = useBusiness();
  const { t } = useTranslation();

  const rawOperacaoItems = [
    { id: 'dashboard' as TabType, labelKey: 'tab.dashboard', icon: LayoutDashboard },
    { id: 'agenda' as TabType, labelKey: 'tab.agenda', icon: Calendar },
    { id: 'clients' as TabType, labelKey: 'tab.clients', icon: Users },
    { id: 'caixa' as TabType, labelKey: 'tab.caixa', icon: ShoppingBag },
    { id: 'waitlist' as TabType, labelKey: 'tab.waitlist', icon: Clock },
  ];

  const rawGestaoItems = [
    { id: 'professionals' as TabType, labelKey: 'tab.professionals', icon: UserCheck },
    { id: 'services' as TabType, labelKey: 'tab.services', icon: Sparkles },
    { id: 'packages' as TabType, labelKey: 'tab.packages', icon: Gift },
    { id: 'stock' as TabType, labelKey: 'tab.stock', icon: Package },
    { id: 'financial' as TabType, labelKey: 'tab.financial', icon: DollarSign },
    { id: 'marketing' as TabType, labelKey: 'tab.marketing', icon: Megaphone },
    { id: 'reports' as TabType, labelKey: 'tab.reports', icon: BarChart3 },
  ];

  const rawAdminItems = [
    { id: 'settings' as TabType, labelKey: 'tab.settings', icon: Store },
    { id: 'rooms' as TabType, labelKey: 'tab.rooms', icon: Building2 },
    { id: 'commissions' as TabType, labelKey: 'tab.commissions', icon: Crown },
  ];

  const operacaoItems = rawOperacaoItems.filter((i) => isModuleEnabled(i.id));
  const gestaoItems = rawGestaoItems.filter((i) => isModuleEnabled(i.id));
  const adminItems = rawAdminItems.filter((i) => isModuleEnabled(i.id));

  const renderNavGroup = (titleKey: string, items: typeof rawOperacaoItems) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-1">
        <div className="px-3.5 pt-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden lg:block">
          {t(titleKey)}
        </div>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={t(item.labelKey)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer touch-target ${
                isActive
                  ? 'bg-rose-50 text-rose-900 font-bold shadow-2xs border border-rose-200/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-rose-800' : 'text-slate-400'}`} />
              <span className="truncate hidden lg:inline">{t(item.labelKey)}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-800 shrink-0 hidden lg:block" />}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <aside className="hidden md:flex w-16 lg:w-64 bg-white border-r border-slate-200 flex-col h-screen sticky top-0 z-30 select-none shrink-0 transition-all">
      {/* Brand Header */}
      <div className="p-3 lg:p-4 border-b border-slate-100 flex items-center gap-3 justify-center lg:justify-start">
        <div className="w-9 h-9 rounded-xl bg-rose-900 text-white flex items-center justify-center font-serif font-black text-lg shadow-sm shrink-0">
          {settings.tradeName ? settings.tradeName.charAt(0) : 'M'}
        </div>
        <div className="min-w-0 flex-1 hidden lg:block">
          <h1 className="font-extrabold text-slate-900 text-sm leading-tight tracking-tight truncate">
            {settings.tradeName || 'Maison Élégance'}
          </h1>
          <p className="text-[10px] font-bold tracking-wider text-rose-800 uppercase truncate">
            {activeLocationName}
          </p>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="p-2 lg:p-3 space-y-1.5 border-b border-slate-100 bg-slate-50/40">
        <button
          onClick={onNewAppointment}
          title={t('dashboard.newAppointment', 'Novo Agendamento')}
          className="w-full bg-rose-800 hover:bg-rose-900 active:scale-[0.99] text-white font-bold py-2.5 px-2 lg:px-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer text-xs touch-target"
        >
          <Plus className="w-4 h-4 text-white shrink-0" />
          <span className="hidden lg:inline">{t('dashboard.newAppointment', 'Novo Agendamento')}</span>
        </button>
        {isModuleEnabled('caixa') && (
          <button
            onClick={onNewSale}
            title={t('dashboard.quickCheckout', 'Venda Rápida / Caixa')}
            className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold py-2 px-2 lg:px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs touch-target"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-rose-800 shrink-0" />
            <span className="hidden lg:inline">{t('dashboard.quickCheckout', 'Venda Rápida / Caixa')}</span>
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-2 py-2 space-y-2 overflow-y-auto no-scrollbar">
        {renderNavGroup('nav.operation', operacaoItems)}
        {renderNavGroup('nav.management', gestaoItems)}
        {renderNavGroup('nav.admin', adminItems)}
      </nav>

      {/* Reception User Footer */}
      <div className="p-3 border-t border-slate-100 flex items-center justify-center lg:justify-start gap-2.5 bg-slate-50/60">
        <div className="w-8 h-8 rounded-full bg-rose-900 text-white font-bold text-xs flex items-center justify-center border border-rose-800 shadow-2xs shrink-0">
          CD
        </div>
        <div className="flex-1 min-w-0 hidden lg:block">
          <p className="text-xs font-bold text-slate-800 truncate">Carla Dias</p>
          <p className="text-[10px] text-slate-500 truncate">{t('header.role', 'Receção & Operações')}</p>
        </div>
      </div>
    </aside>
  );
};
