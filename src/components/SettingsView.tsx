import React, { useState } from 'react';
import {
  Building2,
  Clock,
  Check,
  Save,
  Globe,
  Layers,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  Trophy,
  History,
} from 'lucide-react';
import { BusinessSettings } from '../types';
import { useBusiness } from '../context/BusinessContext';
import { useTranslation, Language } from '../i18n/I18nContext';
import { MODULE_CATALOG, ModuleCategory } from '../config/modules';
import { ClientTiersSettingsView } from './settings/ClientTiersSettingsView';
import { BusinessScheduleSettingsView } from './settings/BusinessScheduleSettingsView';
import { ActivityLogsView } from './settings/ActivityLogsView';

interface SettingsViewProps {
  settings: BusinessSettings;
  onSaveSettings: (newSettings: BusinessSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings: initialPropSettings,
  onSaveSettings,
}) => {
  const {
    settings,
    updateSettings,
    isModuleEnabled,
    toggleModule,
    applyPreset,
    checkModuleDependencies,
  } = useBusiness();
  const { t, language, setLanguage } = useTranslation();

  const [activeSubTab, setActiveSubTab] = useState<'general' | 'modules' | 'region' | 'hours' | 'tiers' | 'logs'>('modules');
  const [formData, setFormData] = useState<BusinessSettings>(settings);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [dependencyWarning, setDependencyWarning] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDayToggle = (index: number) => {
    const updated = [...formData.operatingHours];
    updated[index].isOpen = !updated[index].isOpen;
    setFormData({ ...formData, operatingHours: updated });
  };

  const categories: { id: string; labelKey: string }[] = [
    { id: 'all', labelKey: 'common.all' },
    { id: 'operacao', labelKey: 'category.operacao' },
    { id: 'gestao', labelKey: 'category.gestao' },
    { id: 'equipa', labelKey: 'category.equipa' },
    { id: 'financeiro', labelKey: 'category.financeiro' },
    { id: 'vendas', labelKey: 'category.vendas' },
    { id: 'marketing', labelKey: 'category.marketing' },
    { id: 'inteligencia', labelKey: 'category.inteligencia' },
  ];

  const filteredModules = MODULE_CATALOG.filter((mod) => {
    if (selectedCategory === 'all') return true;
    return mod.category === selectedCategory;
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {t('settings.title', 'Definições do Salão & Clínica')}
          </h2>
          <p className="text-xs text-slate-500">
            {t('settings.sub', 'Parâmetros operacionais, NIF e horários em Lisboa (Chiado)')}
          </p>
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
        >
          {savedSuccess ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? t('common.saved', 'Guardado com Sucesso!') : t('common.save', 'Guardar Alterações')}</span>
        </button>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('modules')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeSubTab === 'modules'
              ? 'bg-rose-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{t('settings.tabModules', 'Módulos & Funcionalidades')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('general')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeSubTab === 'general'
              ? 'bg-rose-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{t('settings.tabGeneral', 'Dados & Empresa')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('region')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeSubTab === 'region'
              ? 'bg-rose-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>{t('settings.tabRegion', 'Região & Idioma')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('hours')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeSubTab === 'hours'
              ? 'bg-rose-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{t('settings.tabHours', 'Horário de Funcionamento')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('tiers')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeSubTab === 'tiers'
              ? 'bg-rose-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Níveis de Clientes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('logs')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeSubTab === 'logs'
              ? 'bg-rose-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Auditoria & Registos</span>
        </button>
      </div>

      {/* SUBTAB 1: CENTRAL DE MÓDULOS & PRESETS */}
      {activeSubTab === 'modules' && (
        <div className="space-y-6">
          {/* Presets Card */}
          <div className="bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 text-white p-5 rounded-2xl shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-300 animate-pulse" />
              <h3 className="text-sm font-extrabold">{t('modules.presetTitle', 'Perfis Recomendados (Onboarding Rápido)')}</h3>
            </div>
            <p className="text-xs text-rose-100/80">
              Escolha a escala do seu estabelecimento para ativar instantaneamente as ferramentas recomendadas sem complicar a interface.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {[
                { key: 'INDEPENDENT', name: t('preset.INDEPENDENT'), desc: t('preset.INDEPENDENT.desc') },
                { key: 'SMALL_SALON', name: t('preset.SMALL_SALON'), desc: t('preset.SMALL_SALON.desc') },
                { key: 'CLINIC', name: t('preset.CLINIC'), desc: t('preset.CLINIC.desc') },
                { key: 'FULL_SALON', name: t('preset.FULL_SALON'), desc: t('preset.FULL_SALON.desc') },
              ].map((p) => {
                const isCurrent = settings.businessType === p.key;
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => applyPreset(p.key as any)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isCurrent
                        ? 'bg-rose-800/80 border-rose-400 text-white ring-2 ring-rose-400/50 shadow-sm'
                        : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">{p.name}</p>
                      <p className="text-[10px] text-slate-300/80 mt-1">{p.desc}</p>
                    </div>
                    <div className="mt-2 text-[10px] font-bold text-rose-200 uppercase tracking-wider flex items-center justify-between">
                      <span>{isCurrent ? 'Ativo' : 'Aplicar'}</span>
                      {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-rose-300" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Module Catalog Controls */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">{t('modules.title')}</h3>
                <p className="text-xs text-slate-500">{t('modules.desc')}</p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedCategory === c.id
                        ? 'bg-rose-800 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t(c.labelKey, c.id)}
                  </button>
                ))}
              </div>
            </div>

            {/* Dependency Warning Notification */}
            {dependencyWarning && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{dependencyWarning}</span>
              </div>
            )}

            {/* Module Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredModules.map((mod) => {
                const enabled = isModuleEnabled(mod.id);
                return (
                  <div
                    key={mod.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      enabled
                        ? 'bg-white border-rose-200/80 shadow-xs'
                        : 'bg-slate-50/60 border-slate-200 opacity-70'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md">
                            {t(`category.${mod.category}`, mod.category)}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 mt-1">
                            {t(mod.nameKey, mod.id)}
                          </h4>
                        </div>

                        {/* Toggle Switch */}
                        {mod.isEssential ? (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                            Essencial
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              const missingDeps = checkModuleDependencies(mod.id);
                              if (missingDeps.length > 0 && !enabled) {
                                setDependencyWarning(
                                  `O módulo ${t(mod.nameKey)} ativou automaticamente: ${missingDeps.join(', ')}.`
                                );
                                setTimeout(() => setDependencyWarning(null), 4000);
                              }
                              toggleModule(mod.id);
                            }}
                            className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                              enabled ? 'bg-rose-800' : 'bg-slate-300'
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                                enabled ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 leading-snug">
                        {t(mod.descriptionKey)}
                      </p>
                    </div>

                    {mod.dependencies.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        <span>Requer: {mod.dependencies.join(', ')}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: DADOS & EMPRESA */}
      {activeSubTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 className="w-5 h-5 text-rose-800" />
              <h3 className="font-extrabold text-slate-900 text-sm">Dados da Empresa & Identificação Fiscal</h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Nome Comercial</label>
                <input
                  type="text"
                  value={formData.tradeName}
                  onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Firma / Firma Social</label>
                <input
                  type="text"
                  value={formData.legalName}
                  onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">NIF (Nº de Identificação Fiscal)</label>
                <input
                  type="text"
                  value={formData.nif}
                  onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Telefone de Contacto (+351)</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Morada Completa</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-rose-900 via-rose-950 to-slate-950 text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-300">Licença Ativa</span>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/30 text-rose-200 text-[10px] font-bold">
                  Plano Élégance Premier
                </span>
              </div>

              <h4 className="text-lg font-black mt-3">Maison Élégance Lisbon ERP</h4>
              <p className="text-xs text-rose-200/80 mt-1">
                Certificação para Portugal (AT/SAFT), Suporte a Redes/Multissite e Internacionalização.
              </p>
            </div>

            <button
              type="button"
              className="w-full py-2 bg-white text-rose-900 font-bold text-xs rounded-xl hover:bg-rose-50 transition-all cursor-pointer text-center mt-6"
            >
              Ver Detalhes do Contrato
            </button>
          </div>
        </div>
      )}

      {/* SUBTAB 3: REGIÃO & IDIOMA */}
      {activeSubTab === 'region' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Globe className="w-5 h-5 text-rose-800" />
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">{t('region.title')}</h3>
              <p className="text-xs text-slate-500">{t('region.desc')}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">{t('region.country')}</label>
              <select
                value={formData.countryCode || 'PT'}
                onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none cursor-pointer"
              >
                <option value="PT">🇵🇹 Portugal</option>
                <option value="ES">🇪🇸 Espanha</option>
                <option value="BR">🇧🇷 Brasil (Futuro)</option>
                <option value="GB">🇬🇧 Reino Unido</option>
                <option value="US">🇺🇸 Estados Unidos</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">{t('region.userLanguage')}</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none cursor-pointer"
              >
                <option value="pt-PT">Português (PT)</option>
                <option value="en">English (US/UK)</option>
                <option value="es">Español (ES)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">{t('region.currency')}</label>
              <input
                type="text"
                disabled
                value="EUR (€) - Euro"
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-500 font-bold outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">{t('region.timezone')}</label>
              <select
                value={formData.timezone || 'Europe/Lisbon'}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none cursor-pointer"
              >
                <option value="Europe/Lisbon">Europe/Lisbon (WET/WEST)</option>
                <option value="Europe/Madrid">Europe/Madrid (CET/CEST)</option>
                <option value="America/Sao_Paulo">America/Sao_Paulo (BRT)</option>
                <option value="Europe/London">Europe/London (GMT/BST)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">{t('region.dateFormat')}</label>
              <select
                value={formData.dateFormat || 'DD/MM/YYYY'}
                onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none cursor-pointer"
              >
                <option value="DD/MM/YYYY">DD/MM/AAAA (ex: 25/07/2026)</option>
                <option value="YYYY-MM-DD">AAAA-MM-DD (ISO)</option>
                <option value="MM/DD/YYYY">MM/DD/AAAA (US)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">{t('region.weekStartsOn')}</label>
              <select
                value={formData.weekStartsOn ?? 1}
                onChange={(e) => setFormData({ ...formData, weekStartsOn: parseInt(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none cursor-pointer"
              >
                <option value={1}>{t('region.monday')}</option>
                <option value={0}>{t('region.sunday')}</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: HORÁRIO DE FUNCIONAMENTO */}
      {activeSubTab === 'hours' && <BusinessScheduleSettingsView />}

      {/* SUBTAB 5: NÍVEIS DE CLIENTES & FIDELIZAÇÃO */}
      {activeSubTab === 'tiers' && <ClientTiersSettingsView />}

      {/* SUBTAB 6: AUDITORIA & REGISTO DE ATIVIDADES */}
      {activeSubTab === 'logs' && <ActivityLogsView />}
    </form>
  );
};
