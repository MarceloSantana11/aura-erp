import React, { useEffect } from 'react';
import {
  X,
  LayoutDashboard,
  Calendar,
  Users,
  ShoppingBag,
  Clock,
  UserCheck,
  Sparkles,
  Gift,
  Package,
  DollarSign,
  Megaphone,
  BarChart3,
  Store,
  Building2,
  Crown,
  ChevronRight,
  Globe,
  Plus,
} from 'lucide-react';
import { TabType } from '../../types';
import { useBusiness } from '../../context/BusinessContext';
import { useTranslation, Language } from '../../i18n/I18nContext';

interface MobileMoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onNewAppointment: () => void;
}

export const MobileMoreSheet: React.FC<MobileMoreSheetProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  onNewAppointment,
}) => {
  const { isModuleEnabled, settings, activeLocationName } = useBusiness();
  const { t, language, setLanguage } = useTranslation();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'pt-PT', label: 'PT', flag: '🇵🇹' },
    { code: 'en', label: 'EN', flag: '🇬🇧' },
    { code: 'es', label: 'ES', flag: '🇪🇸' },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const operacaoItems = [
    { id: 'dashboard' as TabType, labelKey: 'tab.dashboard', icon: LayoutDashboard },
    { id: 'agenda' as TabType, labelKey: 'tab.agenda', icon: Calendar },
    { id: 'clients' as TabType, labelKey: 'tab.clients', icon: Users },
    { id: 'caixa' as TabType, labelKey: 'tab.caixa', icon: ShoppingBag },
    { id: 'waitlist' as TabType, labelKey: 'tab.waitlist', icon: Clock },
  ].filter((i) => isModuleEnabled(i.id));

  const gestaoItems = [
    { id: 'professionals' as TabType, labelKey: 'tab.professionals', icon: UserCheck },
    { id: 'services' as TabType, labelKey: 'tab.services', icon: Sparkles },
    { id: 'packages' as TabType, labelKey: 'tab.packages', icon: Gift },
    { id: 'stock' as TabType, labelKey: 'tab.stock', icon: Package },
    { id: 'commissions' as TabType, labelKey: 'tab.commissions', icon: Crown },
  ].filter((i) => isModuleEnabled(i.id));

  const negocioItems = [
    { id: 'financial' as TabType, labelKey: 'tab.financial', icon: DollarSign },
    { id: 'marketing' as TabType, labelKey: 'tab.marketing', icon: Megaphone },
    { id: 'reports' as TabType, labelKey: 'tab.reports', icon: BarChart3 },
  ].filter((i) => isModuleEnabled(i.id));

  const adminItems = [
    { id: 'settings' as TabType, labelKey: 'tab.settings', icon: Store },
    { id: 'rooms' as TabType, labelKey: 'tab.rooms', icon: Building2 },
  ].filter((i) => isModuleEnabled(i.id));

  const handleSelectTab = (tab: TabType) => {
    setActiveTab(tab);
    onClose();
  };

  const renderSection = (titleKey: string, items: typeof operacaoItems) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-1">
        <h4 className="px-3 pt-3 pb-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
          {t(titleKey)}
        </h4>
        <div className="grid grid-cols-1 gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all cursor-pointer text-sm font-semibold text-left ${
                  isActive
                    ? 'bg-rose-50 text-rose-950 font-bold border border-rose-200/80 shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      isActive ? 'bg-rose-900 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{t(item.labelKey)}</span>
                </div>
                <div className="flex items-center gap-2">
                  {isActive && (
                    <span className="text-[11px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-900">
                      {t('common.active', 'Ativo')}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/60 backdrop-blur-xs transition-all duration-200 md:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-more-sheet-title"
    >
      {/* Backdrop overlay trigger */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Sheet Container */}
      <div className="relative z-10 bg-white rounded-t-3xl max-h-[85dvh] flex flex-col shadow-2xl border-t border-slate-200 w-full max-w-xl mx-auto overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Drag handle bar */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2.5 shrink-0" />

        {/* Header section */}
        <div className="px-5 pb-3 pt-1 border-b border-slate-100 flex items-center justify-between gap-3 shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-rose-900 text-white flex items-center justify-center font-serif font-black text-xl shadow-xs shrink-0">
              {settings.tradeName ? settings.tradeName.charAt(0) : 'M'}
            </div>
            <div className="min-w-0">
              <h3 id="mobile-more-sheet-title" className="font-bold text-slate-900 text-sm leading-snug truncate">
                {settings.tradeName || 'Maison Élégance'}
              </h3>
              <p className="text-[11px] font-bold text-rose-800 tracking-wide uppercase truncate">
                {activeLocationName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  title={l.label}
                  className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    language === l.code
                      ? 'bg-white text-rose-950 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label={t('mobileNav.closeMenu', 'Fechar menu')}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer touch-target"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User Badge / Quick Action Bar */}
        <div className="px-5 py-2.5 bg-rose-900/5 border-b border-rose-900/10 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-rose-900 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
              CD
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block leading-tight">
                {t('mobileNav.receptionManagement', 'Receção e gestão')}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">{t('mobileNav.allModules')}</span>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onNewAppointment();
            }}
            className="px-3 py-1.5 rounded-xl bg-rose-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs hover:bg-rose-950 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('mobileNav.newAppointment', 'Novo agendamento')}</span>
          </button>
        </div>

        {/* Scrollable Menu Items */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 pb-[calc(2rem+env(safe-area-inset-bottom))]">
          {renderSection('nav.operation', operacaoItems)}
          {renderSection('nav.management', gestaoItems)}
          {renderSection('nav.business', negocioItems)}
          {renderSection('nav.admin', adminItems)}
        </div>
      </div>
    </div>
  );
};
