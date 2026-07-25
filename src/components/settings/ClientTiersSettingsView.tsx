import React, { useState } from 'react';
import {
  Trophy,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit,
  RotateCw,
  Users,
  CheckCircle,
  Archive,
  Star,
  Info,
} from 'lucide-react';
import { LoyaltyTier } from '../../types';
import { useOperational } from '../../context/OperationalContext';
import { LoyaltyTierModal } from '../modals/LoyaltyTierModal';
import { Button } from '../ui/Button';

export const ClientTiersSettingsView: React.FC = () => {
  const {
    loyaltyTiers,
    clients,
    addLoyaltyTier,
    updateLoyaltyTier,
    reorderLoyaltyTiers,
    recalculateAllClientTiers,
    archiveLoyaltyTierWithFallback,
    showToast,
  } = useOperational();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<LoyaltyTier | null>(null);

  // Archiving modal state
  const [tierToArchive, setTierToArchive] = useState<LoyaltyTier | null>(null);
  const [fallbackTierId, setFallbackTierId] = useState('');

  const activeTiers = [...loyaltyTiers].sort((a, b) => a.order - b.order);

  const getClientCountForTier = (tierName: string) => {
    return clients.filter((c) => c.vipLevel === tierName).length;
  };

  const handleOpenCreate = () => {
    setEditingTier(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tier: LoyaltyTier) => {
    setEditingTier(tier);
    setIsModalOpen(true);
  };

  const handleSaveTier = (tierData: any) => {
    if (editingTier) {
      updateLoyaltyTier(editingTier.id, tierData);
    } else {
      addLoyaltyTier(tierData);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const items = [...activeTiers];
    const temp = items[index];
    items[index] = items[index - 1];
    items[index - 1] = temp;
    reorderLoyaltyTiers(items);
  };

  const handleMoveDown = (index: number) => {
    if (index >= activeTiers.length - 1) return;
    const items = [...activeTiers];
    const temp = items[index];
    items[index] = items[index + 1];
    items[index + 1] = temp;
    reorderLoyaltyTiers(items);
  };

  const handleToggleStatus = (tier: LoyaltyTier) => {
    const clientCount = getClientCountForTier(tier.name);
    if (tier.status === 'Ativo' && clientCount > 0) {
      setTierToArchive(tier);
      const defaultFallback = activeTiers.find((t) => t.id !== tier.id && t.status === 'Ativo');
      setFallbackTierId(defaultFallback?.id || '');
      return;
    }

    const newStatus = tier.status === 'Inativo' ? 'Ativo' : 'Inativo';
    updateLoyaltyTier(tier.id, { status: newStatus });
    showToast('Estado do Nível Alterado', `Nível "${tier.name}" ${newStatus.toLowerCase()}.`, 'info');
  };

  const handleConfirmArchiveWithFallback = () => {
    if (!tierToArchive) return;
    archiveLoyaltyTierWithFallback(tierToArchive.id, fallbackTierId);
    setTierToArchive(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner & Control Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-900">
              <Trophy className="w-4 h-4" />
            </span>
            <span className="text-[10px] uppercase font-black tracking-wider text-amber-800">
              Clientes & Fidelização
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-900">
            Níveis e Classificação de Clientes
          </h3>
          <p className="text-xs text-slate-500">
            Configure hierarquias, critérios de faturação/visitas e benefícios por nível de cliente
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={recalculateAllClientTiers}
            className="flex-1 sm:flex-initial text-xs font-bold"
          >
            <RotateCw className="w-3.5 h-3.5 mr-1.5 text-rose-800" />
            Recalcular Todos os Clientes
          </Button>

          <Button variant="primary" onClick={handleOpenCreate} className="flex-1 sm:flex-initial">
            <Plus className="w-4 h-4 mr-1.5" />
            Criar Nível
          </Button>
        </div>
      </div>

      {/* Info Callout */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-slate-900 block mb-0.5">
            Classificação Comercial vs. Pontos vs. Etiquetas
          </strong>
          Os <strong>Níveis de Cliente</strong> representam a relação comercial contínua e o valor total acumulado. São independentes do saldo de <strong>Pontos de Fidelização</strong> (para resgate) e das <strong>Etiquetas Operacionais</strong> (como VIP ou Prefere WhatsApp).
        </div>
      </div>

      {/* Tiers List */}
      <div className="space-y-3">
        {activeTiers.map((tier, idx) => {
          const clientCount = getClientCountForTier(tier.name);
          const isInactive = tier.status === 'Inativo';

          return (
            <div
              key={tier.id}
              className={`p-5 rounded-2xl border transition-all bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                isInactive
                  ? 'border-slate-200 opacity-60 bg-slate-50/50'
                  : 'border-slate-200/90 hover:border-slate-300 shadow-2xs'
              }`}
            >
              {/* Left Rank & Title */}
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex flex-col items-center justify-center gap-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMoveUp(idx)}
                    className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Mover para cima"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-black text-slate-400">#{tier.order}</span>
                  <button
                    disabled={idx === activeTiers.length - 1}
                    onClick={() => handleMoveDown(idx)}
                    className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Mover para baixo"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black border ${tier.color}`}
                    >
                      {tier.name}
                    </span>

                    {tier.name === 'Cliente novo' && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold">
                        Estado Inicial
                      </span>
                    )}

                    {isInactive && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-600 text-[10px] font-bold">
                        Inativo
                      </span>
                    )}
                  </div>

                  {tier.description && (
                    <p className="text-xs text-slate-500 font-medium truncate">
                      {tier.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 pt-1">
                    <span>
                      Mínimo Total: <strong>{tier.minSpend}€</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Mín. Visitas: <strong>{tier.minVisits || 0}</strong>
                    </span>
                    <span>•</span>
                    <span className="capitalize">
                      Regra: {tier.combinationMode === 'spend_and_visits' ? '€ E Visitas' : '€ OU Visitas'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Benefits & Stats */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 min-w-[200px]">
                  <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider block mb-1">
                    Benefícios Destacados
                  </span>
                  <ul className="text-xs font-medium text-slate-700 space-y-0.5">
                    {(tier.benefits || []).slice(0, 2).map((b, i) => (
                      <li key={i} className="truncate flex items-center gap-1.5">
                        <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                    {(tier.benefits || []).length > 2 && (
                      <span className="text-[10px] font-bold text-slate-500 block pt-0.5">
                        +{(tier.benefits || []).length - 2} outros benefícios
                      </span>
                    )}
                  </ul>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right px-3">
                    <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider block">
                      Clientes Atuais
                    </span>
                    <span className="text-base font-black text-slate-900 flex items-center justify-end gap-1">
                      <Users className="w-4 h-4 text-rose-800" />
                      {clientCount}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleStatus(tier)}
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                      title={isInactive ? 'Ativar Nível' : 'Desativar Nível'}
                    >
                      <Archive className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleOpenEdit(tier)}
                      className="p-2.5 rounded-xl bg-rose-50 text-rose-800 font-extrabold hover:bg-rose-100 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <LoyaltyTierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTier}
        initialData={editingTier}
        existingOrders={activeTiers.map((t) => t.order)}
      />

      {/* Confirmation Modal for Archiving Tier with Active Clients */}
      {tierToArchive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-900">
              <div className="p-3 rounded-2xl bg-rose-100">
                <Archive className="w-6 h-6 text-rose-800" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900">Desativar / Arquivar Nível</h3>
                <p className="text-xs text-slate-500">Existem clientes ativos neste nível</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              O nível <strong>"{tierToArchive.name}"</strong> possui atualmente{' '}
              <strong className="text-rose-900">{getClientCountForTier(tierToArchive.name)} cliente(s) ativo(s)</strong>.
              Para proceder ao arquivamento, selecione para qual nível os clientes serão reatribuídos:
            </p>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                Nível de Destino (Fallback) *
              </label>
              <select
                value={fallbackTierId}
                onChange={(e) => setFallbackTierId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-rose-800"
              >
                {activeTiers
                  .filter((t) => t.id !== tierToArchive.id && t.status === 'Ativo')
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button variant="ghost" onClick={() => setTierToArchive(null)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleConfirmArchiveWithFallback}>
                Confirmar & Migrar Clientes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
