import React, { useState } from 'react';
import { Search, Bell, MapPin, ChevronDown, Check, Sparkles, Command, Globe, Menu } from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { useTranslation, Language } from '../i18n/I18nContext';

interface HeaderProps {
  title: string;
  onOpenCommandPalette: () => void;
  onOpenMobileDrawer?: () => void;
  onOpenAuraModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onOpenCommandPalette,
  onOpenMobileDrawer,
  onOpenAuraModal,
}) => {
  const { isModuleEnabled } = useBusiness();
  const { t, language, setLanguage } = useTranslation();

  const [selectedUnit, setSelectedUnit] = useState('Maison Élégance - Chiado');
  const [isUnitOpen, setIsUnitOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const units = [
    'Maison Élégance - Chiado',
    'Maison Élégance - Av. da Liberdade',
    'Maison Élégance - Cascais',
  ];

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'pt-PT', label: 'Português (PT)', flag: '🇵🇹' },
    { code: 'en', label: 'English (US/UK)', flag: '🇬🇧' },
    { code: 'es', label: 'Español (ES)', flag: '🇪🇸' },
  ];

  const notifications = [
    { id: '1', title: 'Cliente chegou', time: 'Há 5 min', text: 'Ana Cláudia Silva aguarda na receção para Manicure.', type: 'info' },
    ...(isModuleEnabled('stock')
      ? [{ id: '2', title: 'Estoque Baixo', time: 'Há 25 min', text: 'Mascara Kérastase com apenas 2 unidades em armazém.', type: 'warning' }]
      : []),
    { id: '3', title: 'Pagamento Recebido', time: 'Há 1h', text: '80,00€ recebidos via Multibanco de Sofia Guerreiro.', type: 'success' },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 max-w-xl">
        {/* Brand/Title Header Mobile */}
        <div className="flex items-center gap-2 shrink-0 md:hidden">
          <div className="w-7 h-7 rounded-lg bg-rose-900 text-white font-serif font-black text-sm flex items-center justify-center shadow-xs">
            M
          </div>
          <span className="font-black text-slate-900 text-xs truncate max-w-[100px] sm:max-w-xs">
            {title}
          </span>
        </div>

        <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight hidden md:block truncate">
          {title}
        </h2>

        {/* Global Search Button with Cmd+K */}
        <button
          onClick={onOpenCommandPalette}
          className="relative flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-2.5 sm:px-3 py-1.5 flex items-center justify-between text-xs text-slate-500 transition-all cursor-pointer group min-w-0"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-rose-800 transition-all shrink-0" />
            <span className="truncate text-xs">{t('header.quickSearch', 'Pesquisar... (Ctrl+K)')}</span>
          </div>
          <div className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-mono text-slate-400 font-bold shrink-0">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-2">
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            title="Alterar Idioma"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="uppercase text-[11px] tracking-wider">{language.split('-')[0]}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {isLangOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 animate-in fade-in duration-150">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1 mb-1">
                Idioma da Interface
              </div>
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setIsLangOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-xs text-left flex items-center justify-between hover:bg-rose-50 hover:text-rose-900 cursor-pointer ${
                    language === l.code ? 'font-bold text-rose-900 bg-rose-50/50' : 'text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </span>
                  {language === l.code && <Check className="w-3.5 h-3.5 text-rose-800" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Unit Selector */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setIsUnitOpen(!isUnitOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-800 shrink-0" />
            <span className="truncate max-w-[120px] lg:max-w-[160px]">{selectedUnit}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {isUnitOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Unidades em Portugal
              </div>
              {units.map((unit) => (
                <button
                  key={unit}
                  onClick={() => {
                    setSelectedUnit(unit);
                    setIsUnitOpen(false);
                  }}
                  className="w-full px-3 py-2 text-xs text-left text-slate-700 hover:bg-rose-50 hover:text-rose-900 flex items-center justify-between cursor-pointer"
                >
                  <span>{unit}</span>
                  {selectedUnit === unit && <Check className="w-3.5 h-3.5 text-rose-800" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer touch-target"
            aria-label="Notificações"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-800 ring-2 ring-white" />
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 space-y-2 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-1">
                <span className="font-bold text-slate-900 text-xs">Alertas Operacionais</span>
                <span className="text-[10px] text-rose-800 font-bold bg-rose-50 px-2 py-0.5 rounded-full">
                  {notifications.length} Novos
                </span>
              </div>
              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2 bg-slate-50 hover:bg-rose-50/50 rounded-xl transition-all text-xs border border-slate-100">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reception User Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-rose-900 text-white font-bold text-xs flex items-center justify-center border border-rose-800 shadow-2xs shrink-0">
            CD
          </div>
          <div className="text-left text-xs hidden lg:block">
            <p className="font-bold text-slate-800 leading-none">Carla Dias</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{t('header.role', 'Receção & Operações')}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
