import React, { useState } from 'react';
import { Crown, Gift, Award, Plus, Sparkles, CheckCircle2, History, AlertCircle, Edit2, ShieldAlert, RotateCcw } from 'lucide-react';
import { Client, LoyaltyTier, LoyaltyReward } from '../../types';
import { initialLoyaltyRewards } from '../../data/mockData';
import { Button } from '../ui/Button';
import { useOperational } from '../../context/OperationalContext';

interface ClientLoyaltyTabProps {
  client: Client;
}

export const ClientLoyaltyTab: React.FC<ClientLoyaltyTabProps> = ({ client }) => {
  const {
    loyaltyTiers,
    tierAssignments,
    assignClientTierManual,
    removeClientTierOverride,
    calculateClientTier,
    updateClient,
    showToast,
  } = useOperational();

  const [isAdjustingPoints, setIsAdjustingPoints] = useState(false);
  const [pointDelta, setPointDelta] = useState<number>(50);
  const [adjustReason, setAdjustReason] = useState('');

  const [isTierOverrideOpen, setIsTierOverrideOpen] = useState(false);
  const [selectedTierId, setSelectedTierId] = useState('');
  const [tierOverrideReason, setTierOverrideReason] = useState('');
  const [overrideType, setOverrideType] = useState<'permanent' | 'until_date' | 'until_recalc'>('permanent');
  const [overrideUntilDate, setOverrideUntilDate] = useState('');

  const currentPoints = client.loyaltyPoints || 0;
  const currentTierName = client.vipLevel || 'Cliente novo';

  // Find current tier object
  const activeTiers = [...loyaltyTiers].sort((a, b) => a.order - b.order);
  const currentTier =
    activeTiers.find((t) => t.name === currentTierName) ||
    calculateClientTier(client);

  // Auto calculated tier for recommendation
  const autoCalculatedTier = calculateClientTier(client);

  // Find next tier
  const currentIdx = activeTiers.findIndex((t) => t.id === currentTier.id);
  const nextTier = activeTiers[currentIdx + 1] || null;

  // Calculate progress toward next tier
  const minSpendNeeded = nextTier?.minSpend || 0;
  const minVisitsNeeded = nextTier?.minVisits || 0;
  const currentSpend = client.totalSpent || 0;
  const currentVisits = client.visitCount || 0;

  const spendLeft = Math.max(0, minSpendNeeded - currentSpend);
  const visitsLeft = Math.max(0, minVisitsNeeded - currentVisits);

  const spendProgress = minSpendNeeded > 0 ? Math.min(100, (currentSpend / minSpendNeeded) * 100) : 100;
  const visitsProgress = minVisitsNeeded > 0 ? Math.min(100, (currentVisits / minVisitsNeeded) * 100) : 100;
  const overallProgress = nextTier
    ? nextTier.combinationMode === 'spend_and_visits'
      ? Math.min(spendProgress, visitsProgress)
      : Math.max(spendProgress, visitsProgress)
    : 100;

  const handleManualTierChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTierId) return;
    assignClientTierManual(
      client.id,
      selectedTierId,
      tierOverrideReason,
      overrideType,
      overrideUntilDate
    );
    setIsTierOverrideOpen(false);
    setTierOverrideReason('');
  };

  const handleRedeemReward = (reward: LoyaltyReward) => {
    if (currentPoints < reward.pointsCost) {
      showToast(
        'Pontos Insuficientes',
        `O cliente necessita de ${reward.pointsCost} pontos para resgatar este benefício.`,
        'warning'
      );
      return;
    }

    const newPoints = currentPoints - reward.pointsCost;
    updateClient(client.id, { loyaltyPoints: newPoints });

    showToast(
      'Recompensa Resgatada com Sucesso!',
      `Voucher "${reward.name}" atribuído ao cliente. Desconto será sugerido no checkout.`,
      'success'
    );
  };

  const handleAdjustPointsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustReason.trim()) return;

    const newPoints = Math.max(0, currentPoints + pointDelta);
    updateClient(client.id, { loyaltyPoints: newPoints });

    showToast(
      'Pontos Atualizados',
      `Saldo de pontos de ${client.name} ajustado para ${newPoints} pts.`,
      'info'
    );

    setAdjustReason('');
    setIsAdjustingPoints(false);
  };

  // Client history of tier changes
  const clientTierHistory = tierAssignments.filter((a) => a.clientId === client.id);

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Active Manual Override Callout */}
      {client.manualOverrideActive && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-black text-amber-950 block">
                Sobreposição Manual Ativa ({client.overrideType === 'permanent' ? 'Permanente' : client.overrideType === 'until_date' ? `Até ${client.overrideUntilDate}` : 'Até ao próximo recálculo'})
              </strong>
              <span>
                Nível aplicado: <strong>{client.vipLevel}</strong> | Recomendação Automática do Sistema: <strong>{client.recommendedTierName || autoCalculatedTier.name}</strong>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => removeClientTierOverride(client.id)}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restaurar Nível Automático
          </button>
        </div>
      )}

      {/* Current Tier & Points Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-md space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Crown className="w-32 h-32 text-amber-300" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div>
            <span className="text-[10px] uppercase font-bold text-rose-300 tracking-wider flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              Nível Comercial de Cliente
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <h3 className="text-xl font-black text-white">{currentTier.name}</h3>
              <button
                type="button"
                onClick={() => setIsTierOverrideOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-rose-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                title="Ajustar Nível Manualmente"
              >
                <Edit2 className="w-3 h-3" />
                Alterar Nível
              </button>
            </div>
          </div>

          <div className="text-left sm:text-right flex items-center sm:block gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Total Gasto
              </span>
              <p className="text-lg font-black text-white">{currentSpend.toFixed(2)}€</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Pontos de Fidelização
              </span>
              <p className="text-xl font-black text-amber-400">{currentPoints} pts</p>
            </div>
          </div>
        </div>

        {/* Progress Bar towards Next Tier */}
        {nextTier && !client.manualOverrideActive && currentTier.automaticProgression !== false ? (
          <div className="space-y-1.5 relative z-10 pt-2 border-t border-slate-800">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <span>Próximo Nível: {nextTier.name}</span>
              <span>{Math.round(overallProgress)}% Concluído</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <div className="text-xs font-bold text-amber-300 pt-0.5">
              {nextTier.combinationMode === 'spend_and_visits' ? (
                <span>
                  Faltam <strong>{spendLeft.toFixed(0)}€</strong> e <strong>{visitsLeft}</strong> visita(s) para alcançar {nextTier.name}.
                </span>
              ) : (
                <span>
                  Faltam <strong>{spendLeft.toFixed(0)}€</strong> ou <strong>{visitsLeft}</strong> visita(s) para alcançar {nextTier.name}.
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="pt-2 border-t border-slate-800 text-xs text-amber-300 font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            {client.manualOverrideActive
              ? 'Nível gerido por sobreposição manual do gestor.'
              : 'Nível máximo atingido! O cliente desfruta das maiores vantagens exclusivas do estabelecimento.'}
          </div>
        )}

        {/* Tier Benefits */}
        <div className="pt-2 border-t border-slate-800 space-y-2 relative z-10">
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            Vantagens Ativas de {currentTier.name}:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {(currentTier.benefits || []).map((b, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Manual Tier Override Form Modal */}
      {isTierOverrideOpen && (
        <form
          onSubmit={handleManualTierChangeSubmit}
          className="p-4 bg-white border border-slate-200 rounded-2xl shadow-lg space-y-3 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-800" />
              Atribuição Manual de Nível de Cliente (Sobreposição Gestão)
            </h4>
            <button
              type="button"
              onClick={() => setIsTierOverrideOpen(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Fechar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                Selecionar Novo Nível *
              </label>
              <select
                required
                value={selectedTierId}
                onChange={(e) => setSelectedTierId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-rose-800"
              >
                <option value="">-- Escolher Nível --</option>
                {activeTiers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (Min: {t.minSpend}€ / {t.minVisits} visitas)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                Tipo de Sobreposição *
              </label>
              <select
                value={overrideType}
                onChange={(e) => setOverrideType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-rose-800"
              >
                <option value="permanent">Permanente</option>
                <option value="until_date">Até uma data específica</option>
                <option value="until_recalc">Até ao próximo recálculo automático</option>
              </select>
            </div>

            {overrideType === 'until_date' && (
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                  Validade da Sobreposição *
                </label>
                <input
                  type="date"
                  required
                  value={overrideUntilDate}
                  onChange={(e) => setOverrideUntilDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-rose-800"
                />
              </div>
            )}

            <div className={overrideType === 'until_date' ? 'sm:col-span-1' : 'sm:col-span-2'}>
              <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                Motivo do Ajuste Manual *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Cliente VIP recomendado por Direção, Acordo comercial"
                value={tierOverrideReason}
                onChange={(e) => setTierOverrideReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-rose-800"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" onClick={() => setIsTierOverrideOpen(false)} type="button">
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Confirmar Alteração de Nível
            </Button>
          </div>
        </form>
      )}

      {/* History of Tier Changes */}
      {clientTierHistory.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
          <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            Histórico de Alterações de Nível do Cliente
          </h4>
          <div className="space-y-1.5 text-xs">
            {clientTierHistory.map((h) => (
              <div key={h.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">
                    {h.previousTierName || 'Nenhum'} → <strong className="text-rose-900">{h.tierName}</strong>
                    {h.source === 'manual' && <span className="ml-2 px-1.5 py-0.5 text-[9px] bg-amber-100 text-amber-900 rounded-md font-extrabold">Manual ({h.overrideType || 'permanente'})</span>}
                  </span>
                  {h.reason && <p className="text-[11px] text-slate-500 italic">{h.reason}</p>}
                </div>
                <div className="text-right text-[10px] text-slate-400 font-semibold">
                  <span>{h.assignedAt}</span>
                  <span className="block">{h.assignedBy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Redeemable Rewards Catalogue */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="font-extrabold text-xs text-slate-900 flex items-center gap-2">
            <Gift className="w-4 h-4 text-rose-800" />
            Catálogo de Recompensas & Vouchers Disponíveis
          </h3>

          <button
            onClick={() => setIsAdjustingPoints(!isAdjustingPoints)}
            className="text-xs font-bold text-rose-800 hover:text-rose-950 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Ajuste Manual de Pontos
          </button>
        </div>

        {/* Form for manual point adjustment */}
        {isAdjustingPoints && (
          <form
            onSubmit={handleAdjustPointsSubmit}
            className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl space-y-3 text-xs animate-in fade-in duration-150"
          >
            <h4 className="font-bold text-amber-950 flex items-center gap-1">
              <Award className="w-4 h-4 text-amber-600" />
              Ajuste Manual de Pontos
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-amber-900 uppercase mb-1">
                  Variação de Pontos (+ / -)
                </label>
                <input
                  type="number"
                  required
                  value={pointDelta}
                  onChange={(e) => setPointDelta(Number(e.target.value))}
                  className="w-full bg-white border border-amber-200 rounded-lg p-2 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-amber-900 uppercase mb-1">
                  Motivo do Ajuste
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Aniversário, compensação por atraso"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full bg-white border border-amber-200 rounded-lg p-2 font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdjustingPoints(false)}
                className="px-3 py-1.5 rounded-lg border border-amber-200 text-amber-900 font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold cursor-pointer"
              >
                Confirmar Ajuste
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {initialLoyaltyRewards.map((rew) => {
            const canAfford = currentPoints >= rew.pointsCost;

            return (
              <div
                key={rew.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between font-extrabold text-xs text-slate-900">
                    <span>{rew.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 text-[10px]">
                      {rew.pointsCost} pts
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">
                    {rew.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold">
                    {canAfford ? 'Saldo Suficiente' : 'Pontos Insuficientes'}
                  </span>

                  <button
                    disabled={!canAfford}
                    onClick={() => handleRedeemReward(rew)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-rose-900 hover:bg-rose-950 text-white shadow-2xs'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Resgatar Recompensa
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
