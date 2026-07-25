import React, { createContext, useContext, useState, useEffect } from 'react';
import { BusinessSettings, TabType } from '../types';
import { initialBusinessSettings } from '../data/mockData';
import { PRESET_MODULES, MODULE_CATALOG } from '../config/modules';

interface BusinessContextType {
  settings: BusinessSettings;
  updateSettings: (newSettings: Partial<BusinessSettings>) => void;
  enabledModules: Record<string, boolean>;
  isModuleEnabled: (moduleId: string) => boolean;
  toggleModule: (moduleId: string) => void;
  applyPreset: (presetKey: 'INDEPENDENT' | 'SMALL_SALON' | 'CLINIC' | 'FULL_SALON' | 'FRANCHISE') => void;
  checkModuleDependencies: (moduleId: string) => string[];
  activeLocationName: string;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<BusinessSettings>(() => {
    const saved = localStorage.getItem('aesthetix_business_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      ...initialBusinessSettings,
      businessId: 'biz-lisbon-01',
      organizationId: 'org-maison-elegance',
      locationId: 'loc-chiado',
      countryCode: 'PT',
      businessType: 'FULL_SALON',
      locale: 'pt-PT',
      supportedLocales: ['pt-PT', 'en', 'es'],
      currencyCode: 'EUR',
      timezone: 'Europe/Lisbon',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      weekStartsOn: 1,
      enabledModules: { ...PRESET_MODULES.FULL_SALON },
      featureFlags: {
        auraAiSuggestions: true,
        whatsappReminders: true,
      },
    };
  });

  useEffect(() => {
    localStorage.setItem('aesthetix_business_settings', JSON.stringify(settings));
  }, [settings]);

  const enabledModules = settings.enabledModules || PRESET_MODULES.FULL_SALON;

  const isModuleEnabled = (moduleId: string): boolean => {
    // Essential modules are ALWAYS enabled
    const meta = MODULE_CATALOG.find((m) => m.id === moduleId);
    if (meta?.isEssential) return true;
    return !!enabledModules[moduleId];
  };

  const toggleModule = (moduleId: string) => {
    const meta = MODULE_CATALOG.find((m) => m.id === moduleId);
    if (meta?.isEssential) return; // Cannot toggle essential modules

    const currentlyEnabled = !!enabledModules[moduleId];
    let updatedModules = { ...enabledModules, [moduleId]: !currentlyEnabled };

    // If enabling, ensure dependencies are enabled as well
    if (!currentlyEnabled && meta?.dependencies) {
      meta.dependencies.forEach((dep) => {
        updatedModules[dep] = true;
      });
    }

    setSettings((prev) => ({
      ...prev,
      enabledModules: updatedModules,
    }));
  };

  const applyPreset = (presetKey: 'INDEPENDENT' | 'SMALL_SALON' | 'CLINIC' | 'FULL_SALON' | 'FRANCHISE') => {
    const presetMap = PRESET_MODULES[presetKey] || PRESET_MODULES.FULL_SALON;
    setSettings((prev) => ({
      ...prev,
      businessType: presetKey,
      enabledModules: { ...presetMap },
    }));
  };

  const checkModuleDependencies = (moduleId: string): string[] => {
    const meta = MODULE_CATALOG.find((m) => m.id === moduleId);
    if (!meta || !meta.dependencies) return [];
    return meta.dependencies.filter((dep) => !isModuleEnabled(dep));
  };

  const updateSettings = (newSettings: Partial<BusinessSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <BusinessContext.Provider
      value={{
        settings,
        updateSettings,
        enabledModules,
        isModuleEnabled,
        toggleModule,
        applyPreset,
        checkModuleDependencies,
        activeLocationName: `${settings.tradeName} • Chiado`,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};
