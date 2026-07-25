import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Users,
  Home,
  CreditCard,
  Menu,
  Plus,
  ShoppingBag,
  DollarSign,
  Clock,
} from 'lucide-react';
import { TabType } from '../../types';
import { useBusiness } from '../../context/BusinessContext';
import { useTranslation } from '../../i18n/I18nContext';
import { MobileMoreSheet } from './MobileMoreSheet';


interface MobileNavItem {
  id: TabType | 'menu';
  labelKey: string;
  icon: React.ElementType;
  isMenuTrigger?: boolean;
}

interface MobileBottomNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onNewAppointment: () => void;
  hidden?: boolean;
}

const MENU_TABS: TabType[] = [
  'professionals',
  'services',
  'packages',
  'stock',
  'financial',
  'marketing',
  'reports',
  'settings',
  'rooms',
  'schedules',
  'commissions',
  'users',
  'waitlist',
];

export const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({
  activeTab,
  setActiveTab,
  onNewAppointment,
  hidden = false,
}) => {
  const { isModuleEnabled } = useBusiness();
  const { t } = useTranslation();
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);

  useEffect(() => {
    if (hidden && isMoreSheetOpen) {
      setIsMoreSheetOpen(false);
    }
  }, [hidden, isMoreSheetOpen]);

  const resolveMobilePrimaryNavigation = () => {
    if (isModuleEnabled('caixa')) {
      return { id: 'caixa' as TabType, labelKey: 'mobileNav.caixa', icon: CreditCard };
    }
    if (isModuleEnabled('financial')) {
      return { id: 'financial' as TabType, labelKey: 'tab.financial', icon: DollarSign };
    }
    if (isModuleEnabled('waitlist')) {
      return { id: 'waitlist' as TabType, labelKey: 'tab.waitlist', icon: Clock };
    }
    return { id: 'services' as TabType, labelKey: 'tab.services', icon: ShoppingBag };
  };

  const fourthItem = resolveMobilePrimaryNavigation();

  const navItems: MobileNavItem[] = [
    { id: 'agenda' as TabType, labelKey: 'mobileNav.agenda', icon: Calendar },
    { id: 'clients' as TabType, labelKey: 'mobileNav.clients', icon: Users },
    { id: 'dashboard' as TabType, labelKey: 'mobileNav.home', icon: Home },
    fourthItem,
    { id: 'menu' as const, labelKey: 'mobileNav.menu', icon: Menu, isMenuTrigger: true },
  ];

  const getIsActive = (itemId: TabType | 'menu') => {
    if (itemId === 'menu') {
      return isMoreSheetOpen || MENU_TABS.includes(activeTab);
    }

    if (itemId === 'agenda') {
      return activeTab === 'agenda' || activeTab === 'appointments';
    }

    return activeTab === itemId;
  };

  if (hidden) return null;

  return (
    <>
      {!isMoreSheetOpen && (
        <button
          type="button"
          onClick={onNewAppointment}
          title={t('mobileNav.newAppointment', 'Novo agendamento')}
          aria-label={t('mobileNav.newAppointment', 'Novo agendamento')}
          className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] right-4 z-40 md:hidden bg-rose-900 hover:bg-rose-950 active:scale-95 text-white font-semibold h-12 px-4 rounded-full shadow-lg shadow-rose-950/25 flex items-center justify-center gap-2 text-sm border border-rose-800 transition-all cursor-pointer touch-target select-none"
        >
          <Plus className="w-4 h-4 text-white shrink-0" />
          <span className="truncate">{t('mobileNav.newAppointment', 'Novo agendamento')}</span>
        </button>
      )}

      <nav
        aria-label={t('mobileNav.primaryNavigation', 'Navegação principal')}
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:hidden pb-[env(safe-area-inset-bottom)] select-none"
      >
        <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = getIsActive(item.id);

            const handleClick = () => {
              if (item.isMenuTrigger) {
                setIsMoreSheetOpen(true);
                return;
              }
              setActiveTab(item.id as TabType);
            };

            return (
              <button
                key={item.id}
                type="button"
                onClick={handleClick}
                aria-current={isActive ? 'page' : undefined}
                aria-expanded={item.isMenuTrigger ? isMoreSheetOpen : undefined}
                aria-label={t(item.labelKey)}
                className="flex flex-col items-center justify-center w-full h-full py-1 group cursor-pointer touch-target"
              >
                <div
                  className={`flex items-center justify-center transition-all duration-150 px-3.5 py-1 rounded-full ${
                    isActive
                      ? 'bg-rose-100/90 text-rose-900 shadow-2xs scale-105'
                      : 'text-slate-500 group-hover:text-slate-800'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      isActive ? 'text-rose-900 stroke-[2.5]' : 'text-slate-500'
                    }`}
                  />
                </div>

                <span
                  className={`text-[11px] tracking-tight leading-none mt-0.5 truncate max-w-full px-0.5 transition-all ${
                    isActive ? 'font-bold text-rose-950' : 'font-medium text-slate-500'
                  }`}
                >
                  {t(item.labelKey)}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <MobileMoreSheet
        isOpen={isMoreSheetOpen}
        onClose={() => setIsMoreSheetOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewAppointment={onNewAppointment}
      />
    </>
  );
};
