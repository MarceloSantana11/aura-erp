import React, { useState } from 'react';
import {
  TrendingUp,
  Clock,
  Calendar,
  Sparkles,
  Heart,
  Coffee,
  Phone,
  UserCheck,
  ChevronRight,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Gift,
} from 'lucide-react';
import { Client, Appointment, ClientPreference } from '../../types';
import { useTranslation } from '../../i18n/I18nContext';
import { Button } from '../ui/Button';

interface ClientOverviewTabProps {
  client: Client;
  nextAppointment?: Appointment;
  onNewAppointment: () => void;
  onInspectAppointment?: (app: Appointment) => void;
  onOpenLoyaltyTab?: () => void;
  onAddPreference?: (pref: Omit<ClientPreference, 'id'>) => void;
}

export const ClientOverviewTab: React.FC<ClientOverviewTabProps> = ({
  client,
  nextAppointment,
  onNewAppointment,
  onInspectAppointment,
  onOpenLoyaltyTab,
  onAddPreference,
}) => {
  const { t, formatCurrency } = useTranslation();
  const [isAddingPref, setIsAddingPref] = useState(false);
  const [prefCategory, setPrefCategory] = useState<ClientPreference['category']>('Bebida');
  const [prefLabel, setPrefLabel] = useState('');
  const [prefValue, setPrefValue] = useState('');

  const estimatedAvgTicket =
    client.totalSpent > 0 ? Math.round(client.totalSpent / 6) : 0;

  const handleSavePref = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prefLabel.trim() || !prefValue.trim()) return;
    if (onAddPreference) {
      onAddPreference({
        category: prefCategory,
        label: prefLabel.trim(),
        value: prefValue.trim(),
      });
    }
    setPrefLabel('');
    setPrefValue('');
    setIsAddingPref(false);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* 1. KPIs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Total Faturado
          </span>
          <p className="text-lg font-black text-slate-900">
            {formatCurrency(client.totalSpent)}
          </p>
          <span className="text-[10px] text-emerald-800 font-bold">Cliente Valioso</span>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Ticket Médio
          </span>
          <p className="text-lg font-black text-slate-900">
            {formatCurrency(estimatedAvgTicket || 65)}
          </p>
          <span className="text-[10px] text-slate-500 font-medium">Estimativa por visita</span>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Última Visita
          </span>
          <p className="text-sm font-extrabold text-slate-900 mt-0.5">
            {client.lastVisit || 'Há 12 dias'}
          </p>
          <span className="text-[10px] text-slate-500 font-medium">No estabelecimento</span>
        </div>

        <div
          onClick={onOpenLoyaltyTab}
          className="p-3.5 bg-rose-50/70 border border-rose-200/80 rounded-2xl space-y-1 cursor-pointer hover:border-rose-300 transition-colors"
        >
          <span className="text-[10px] uppercase font-bold text-rose-800 tracking-wider flex items-center justify-between">
            Fidelização
            <Gift className="w-3.5 h-3.5 text-rose-800" />
          </span>
          <p className="text-lg font-black text-rose-950">
            {client.loyaltyPoints || 480} pts
          </p>
          <span className="text-[10px] text-rose-900 font-bold">
            {client.vipLevel || 'Signature VIP'}
          </span>
        </div>
      </div>

      {/* 2. Próximo Agendamento */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="font-extrabold text-xs text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-rose-800" />
            Próximo Agendamento
          </h3>
          {nextAppointment && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 font-extrabold text-[10px]">
              {nextAppointment.status}
            </span>
          )}
        </div>

        {nextAppointment ? (
          <div
            onClick={() => onInspectAppointment && onInspectAppointment(nextAppointment)}
            className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-extrabold text-xs text-slate-900">
                <span>{nextAppointment.procedure}</span>
                <span className="text-rose-800">• {nextAppointment.value}€</span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium flex items-center gap-2">
                <span>
                  {nextAppointment.date} às {nextAppointment.time}
                </span>
                <span>({nextAppointment.durationMinutes} min)</span>
              </p>
              <p className="text-[10px] text-slate-400">
                Profissional: <strong>{nextAppointment.professional}</strong> • Sala:{' '}
                {nextAppointment.room || 'Cadeira 01'}
              </p>
            </div>

            <Button variant="outline" size="sm">
              Ver Detalhes
            </Button>
          </div>
        ) : (
          <div className="p-4 text-center bg-slate-50/70 rounded-xl border border-dashed border-slate-200 space-y-2">
            <p className="text-xs font-bold text-slate-700">
              Nenhum agendamento futuro registado
            </p>
            <p className="text-[11px] text-slate-500">
              Garante a retenção agendando a próxima visita antes da saída do cliente.
            </p>
            <Button variant="primary" size="sm" onClick={onNewAppointment}>
              <Plus className="w-3.5 h-3.5 mr-1" />
              Agendar Agora
            </Button>
          </div>
        )}
      </div>

      {/* 3. Preferências Pessoais & Ritual */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="font-extrabold text-xs text-slate-900 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-800" />
            Preferências Pessoais & Especificações de Atendimento
          </h3>
          <button
            onClick={() => setIsAddingPref(!isAddingPref)}
            className="text-[11px] font-bold text-rose-800 hover:text-rose-950 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            Adicionar Preferência
          </button>
        </div>

        {/* Form to add preference */}
        {isAddingPref && (
          <form
            onSubmit={handleSavePref}
            className="p-3 bg-rose-50/60 border border-rose-200 rounded-xl space-y-3 animate-in fade-in duration-150 text-xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Categoria
                </label>
                <select
                  value={prefCategory}
                  onChange={(e) =>
                    setPrefCategory(e.target.value as ClientPreference['category'])
                  }
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 font-bold text-slate-900"
                >
                  <option value="Bebida">Bebida</option>
                  <option value="Cabelo">Cabelo</option>
                  <option value="Estética">Estética</option>
                  <option value="Unhas">Unhas</option>
                  <option value="Atendimento">Atendimento</option>
                  <option value="Sensibilidades">Sensibilidades</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Rótulo / Título
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Café / Tom Balayage"
                  value={prefLabel}
                  onChange={(e) => setPrefLabel(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Valor / Especificação
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Sem açúcar, hortelã"
                  value={prefValue}
                  onChange={(e) => setPrefValue(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingPref(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-rose-800 text-white font-bold"
              >
                Guardar
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
            <UserCheck className="w-4 h-4 text-rose-800 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Profissional de Preferência
              </span>
              <p className="font-extrabold text-slate-900">
                {client.preferredProfessional || 'Dra. Helena Silva'}
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
            <Coffee className="w-4 h-4 text-rose-800 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Bebida de Boas-Vindas
              </span>
              <p className="font-extrabold text-slate-900">
                {client.preferredDrink || 'Chá verde com hortelã morno'}
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
            <Phone className="w-4 h-4 text-rose-800 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Canal de Lembretes Preferido
              </span>
              <p className="font-extrabold text-slate-900">
                {client.preferredContact || 'WhatsApp (+351)'}
              </p>
            </div>
          </div>

          {client.preferences?.map((pref) => (
            <div
              key={pref.id}
              className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5"
            >
              <Sparkles className="w-4 h-4 text-rose-800 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  {pref.category}: {pref.label}
                </span>
                <p className="font-extrabold text-slate-900">{pref.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Timeline Recente */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
        <h3 className="font-extrabold text-xs text-slate-900 border-b border-slate-100 pb-2">
          Histórico Operacional & Atividade Recente
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex gap-3 items-start">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-950 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900">
                Atendimento Concluído & Liquidado
              </p>
              <p className="text-[11px] text-slate-600">
                Coloração & Balayage Élégance (160€) — Dra. Helena Silva
              </p>
              <span className="text-[10px] text-slate-400">Há 12 dias • Unidade Lisboa</span>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-950 flex items-center justify-center shrink-0 mt-0.5">
              <Gift className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900">
                Atribuição de 160 Pontos de Fidelização
              </p>
              <p className="text-[11px] text-slate-600">
                Acumulado automaticamente pelo checkout no balcão
              </p>
              <span className="text-[10px] text-slate-400">Há 12 dias</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
