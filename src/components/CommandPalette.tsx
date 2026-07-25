import React, { useState, useEffect } from 'react';
import { Search, Calendar, Plus, ShoppingBag, DollarSign, Users, Sparkles, X, ChevronRight } from 'lucide-react';
import { TabType } from '../types';
import { useBusiness } from '../context/BusinessContext';
import { useTranslation } from '../i18n/I18nContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: TabType) => void;
  onNewAppointment: () => void;
  onNewSale?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onNewAppointment,
  onNewSale,
}) => {
  const [query, setQuery] = useState('');
  const { isModuleEnabled, settings } = useBusiness();
  const { t } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    {
      id: 'act-new-app',
      moduleId: 'agenda',
      title: 'Criar Novo Agendamento',
      subtitle: 'Marcar horário para cliente em agenda',
      icon: Plus,
      action: () => {
        onNewAppointment();
        onClose();
      },
    },
    ...(onNewSale && isModuleEnabled('caixa')
      ? [
          {
            id: 'act-new-sale',
            moduleId: 'caixa',
            title: 'Registrar Nova Venda / Caixa',
            subtitle: 'Checkout de serviços, produtos ou pacotes',
            icon: ShoppingBag,
            action: () => {
              onNewSale();
              onClose();
            },
          },
        ]
      : []),
    {
      id: 'act-goto-agenda',
      moduleId: 'agenda',
      title: 'Ir para a Agenda Operacional',
      subtitle: 'Visualizar ocupação por profissional e salas',
      icon: Calendar,
      action: () => {
        onNavigate('agenda');
        onClose();
      },
    },
    {
      id: 'act-goto-clients',
      moduleId: 'clients',
      title: 'Procurar no CRM de Clientes',
      subtitle: 'Consultar histórico, notas e preferências',
      icon: Users,
      action: () => {
        onNavigate('clients');
        onClose();
      },
    },
    {
      id: 'act-goto-caixa',
      moduleId: 'caixa',
      title: 'Abrir Caixa & Ponto de Venda',
      subtitle: 'Movimentações diárias e fecho de caixa',
      icon: DollarSign,
      action: () => {
        onNavigate('caixa');
        onClose();
      },
    },
    {
      id: 'act-goto-services',
      moduleId: 'services',
      title: 'Catálogo de Serviços & Tabela de Preços',
      subtitle: 'Ver preços em Euro (€) e durações',
      icon: Sparkles,
      action: () => {
        onNavigate('services');
        onClose();
      },
    },
  ];

  const allowedActions = quickActions.filter((act) => isModuleEnabled(act.moduleId));

  const filteredActions = allowedActions.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-rose-800" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite um comando, cliente, serviço ou atalho (Ctrl + K)..."
            className="w-full bg-transparent text-sm font-medium text-slate-800 focus:outline-none placeholder:text-slate-400"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action List */}
        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Ações Rápidas Sugeridas
          </div>

          {filteredActions.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              Nenhum comando ou resultado encontrado para "{query}".
            </div>
          ) : (
            filteredActions.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center gap-3.5 p-3 rounded-xl hover:bg-rose-50/80 transition-all text-left group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center shrink-0 group-hover:bg-rose-800 group-hover:text-white transition-all">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 group-hover:text-rose-900 transition-all">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{item.subtitle}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-rose-800 group-hover:translate-x-0.5 transition-all" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>
            Pressione <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-mono text-[10px]">ESC</kbd> para fechar
          </span>
          <span className="font-semibold text-rose-800">{settings.tradeName || 'Maison Élégance'} ERP</span>
        </div>
      </div>
    </div>
  );
};
