import React from 'react';
import {
  Calendar,
  Users,
  Clock,
  Euro,
  Sparkles,
  Plus,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  PhoneCall,
  Eye
} from 'lucide-react';
import { Appointment, Client, Transaction, TabType } from '../types';
import { initialAuraInsights } from '../data/mockData';
import { useBusiness } from '../context/BusinessContext';
import { useTranslation } from '../i18n/I18nContext';

interface DashboardViewProps {
  appointments: Appointment[];
  clients: Client[];
  transactions: Transaction[];
  onNewAppointment: () => void;
  onNewSale: () => void;
  onSelectTab: (tab: TabType) => void;
  onInspectAppointment: (app: Appointment) => void;
  onUpdateAppointmentStatus: (id: string, newStatus: Appointment['status']) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  appointments,
  clients,
  transactions,
  onNewAppointment,
  onNewSale,
  onSelectTab,
  onInspectAppointment,
  onUpdateAppointmentStatus,
}) => {
  const { isModuleEnabled, settings, activeLocationName } = useBusiness();
  const { t, formatCurrency } = useTranslation();

  // Calculated KPIs
  const todayRevenue = appointments
    .filter((a) => a.status === 'Concluído' || a.status === 'Em atendimento' || a.paymentStatus === 'Pago')
    .reduce((acc, curr) => acc + curr.value, 215); // base sales

  const todayAppointmentsCount = appointments.length;
  const waitingClientsCount = appointments.filter((a) => a.status === 'Cliente chegou').length;
  const pendingPaymentsValue = appointments
    .filter((a) => a.paymentStatus === 'Pendente' || a.paymentStatus === 'Sinal Pago')
    .reduce((acc, curr) => acc + (curr.value - (curr.depositPaid || 0)), 125);
  const canceledCount = appointments.filter((a) => a.status === 'Cancelado' || a.status === 'Não compareceu').length;

  return (
    <div className="space-y-6">
      {/* SEÇÃO 1: CABEÇALHO DA RECEÇÃO */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
              {activeLocationName} • Receção Ativa
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Bom dia, Receção!
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sábado, 25 de Julho de 2026 • {todayAppointmentsCount} atendimentos agendados para hoje
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onNewAppointment}
            className="bg-rose-800 hover:bg-rose-900 active:scale-[0.98] text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Agendamento</span>
          </button>
          {isModuleEnabled('caixa') && (
            <button
              onClick={onNewSale}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer text-xs"
            >
              <ShoppingBag className="w-4 h-4 text-rose-300" />
              <span>Nova Venda / Caixa</span>
            </button>
          )}
        </div>
      </div>

      {/* SEÇÃO 2: INDICADORES PRINCIPAIS (KPIs) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-2xs hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Faturação Hoje</span>
            <Euro className="w-4 h-4 text-rose-800" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-2">{formatCurrency(todayRevenue)}</p>
          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" /> +14% vs. sábado passado
          </span>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-2xs hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Agendamentos</span>
            <Calendar className="w-4 h-4 text-rose-800" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-2">{todayAppointmentsCount}</p>
          <span className="text-[10px] text-slate-500 font-medium mt-1">100% da capacidade manhã</span>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-2xs hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Ocupação</span>
            <Clock className="w-4 h-4 text-rose-800" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-2">82%</p>
          <span className="text-[10px] text-slate-500 font-medium mt-1">3 vagas à tarde</span>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-2xs hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Na Receção</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-black text-amber-900 mt-2">{waitingClientsCount} cliente</p>
          <span className="text-[10px] text-amber-700 font-bold mt-1">Aguardando atendimento</span>
        </div>

        {/* KPI 5 */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-2xs hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pendente</span>
            <Euro className="w-4 h-4 text-rose-800" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-2">{formatCurrency(pendingPaymentsValue)}</p>
          <span className="text-[10px] text-slate-500 font-medium mt-1">A cobrar no fecho</span>
        </div>

        {/* KPI 6 */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-2xs hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Faltas / Canc.</span>
            <ShieldAlert className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-xl font-black text-slate-700 mt-2">{canceledCount}</p>
          <span className="text-[10px] text-emerald-700 font-bold mt-1">Taxa de comparência 100%</span>
        </div>
      </div>

      {/* SEÇÃO 3: PRIORIDADES AGORA (ALERTAS OPERACIONAIS) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-800" />
            <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">Prioridades de Atendimento Agora</h3>
          </div>
          <span className="text-[11px] font-bold text-slate-400">3 Itens a requerer ação</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Priority 1 */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-800 uppercase bg-amber-100 px-2 py-0.5 rounded">
                  Cliente em Espera
                </span>
                <span className="text-[11px] font-bold text-amber-900">11:00</span>
              </div>
              <p className="text-xs font-bold text-slate-900 mt-1.5">Ana Cláudia Silva chegou</p>
              <p className="text-[11px] text-slate-600 mt-0.5">Manicure Russa com Beatriz Santos (Mesa 01)</p>
            </div>
            <button
              onClick={() => {
                const app = appointments.find((a) => a.clientName.includes('Ana Cláudia'));
                if (app) onUpdateAppointmentStatus(app.id, 'Em atendimento');
              }}
              className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-all cursor-pointer flex items-center justify-center gap-1 mt-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Iniciar Atendimento</span>
            </button>
          </div>

          {/* Priority 2 */}
          <div className="p-3.5 bg-rose-50/70 border border-rose-200/80 rounded-xl space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-rose-800 uppercase bg-rose-100 px-2 py-0.5 rounded">
                  Confirmar Agendamento
                </span>
                <span className="text-[11px] font-bold text-slate-500">16:00</span>
              </div>
              <p className="text-xs font-bold text-slate-900 mt-1.5">Carlos Eduardo sem confirmação</p>
              <p className="text-[11px] text-slate-600 mt-0.5">Corte Masculino com Carlos Mendes</p>
            </div>
            <button
              onClick={() => {
                const app = appointments.find((a) => a.clientName.includes('Carlos Eduardo'));
                if (app) onUpdateAppointmentStatus(app.id, 'Confirmado');
              }}
              className="w-full bg-rose-800 hover:bg-rose-900 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-all cursor-pointer flex items-center justify-center gap-1 mt-1"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Confirmar Via SMS/WhatsApp</span>
            </button>
          </div>

          {/* Priority 3 */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-600 uppercase bg-slate-200 px-2 py-0.5 rounded">
                  Lista de Espera
                </span>
                <span className="text-[11px] font-bold text-rose-800">Inês Carmo</span>
              </div>
              <p className="text-xs font-bold text-slate-900 mt-1.5">Vaga às 15:30 disponível</p>
              <p className="text-[11px] text-slate-600 mt-0.5">Correspondência para Coloração & Balayage</p>
            </div>
            <button
              onClick={() => onSelectTab('waitlist')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-all cursor-pointer flex items-center justify-center gap-1 mt-1"
            >
              <span>Atribuir Vaga</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SEÇÃO 4: AGENDA DE HOJE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Agenda de Atendimentos de Hoje</h3>
            <p className="text-xs text-slate-500">Fluxo em tempo real na receção</p>
          </div>
          <button
            onClick={() => onSelectTab('agenda')}
            className="text-xs font-bold text-rose-800 hover:text-rose-900 flex items-center gap-1 cursor-pointer"
          >
            <span>Ver Agenda Completa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {appointments.map((app) => (
            <div
              key={app.id}
              className="p-3.5 bg-slate-50/70 hover:bg-rose-50/30 border border-slate-200/80 rounded-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 text-center shrink-0">
                  <span className="text-xs font-black text-slate-900 block">{app.time}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{app.durationMinutes}m</span>
                </div>

                <div className="h-8 w-px bg-slate-200 hidden md:block" />

                <img
                  src={app.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                  alt={app.clientName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-xs">{app.clientName}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        app.status === 'Em atendimento'
                          ? 'bg-rose-100 text-rose-900'
                          : app.status === 'Cliente chegou'
                          ? 'bg-amber-100 text-amber-900'
                          : app.status === 'Concluído'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {app.procedure} • <span className="font-semibold">{app.professional}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                <div className="text-right">
                  <span className="text-xs font-black text-slate-900 block">{app.value}€</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{app.paymentStatus}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onInspectAppointment(app)}
                    className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                    title="Ver detalhes"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  {app.status === 'Confirmado' && (
                    <button
                      onClick={() => onUpdateAppointmentStatus(app.id, 'Cliente chegou')}
                      className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-all"
                    >
                      Chegou
                    </button>
                  )}

                  {app.status === 'Cliente chegou' && (
                    <button
                      onClick={() => onUpdateAppointmentStatus(app.id, 'Em atendimento')}
                      className="px-2.5 py-1.5 bg-rose-800 hover:bg-rose-900 text-white rounded-lg text-xs font-bold cursor-pointer transition-all"
                    >
                      Iniciar
                    </button>
                  )}

                  {app.status === 'Em atendimento' && (
                    <button
                      onClick={() => onUpdateAppointmentStatus(app.id, 'Concluído')}
                      className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-all"
                    >
                      Finalizar & Cobrar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEÇÃO 6: AURA AI INSIGHTS & FERRAMENTAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Aura AI Panel */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 text-white rounded-2xl p-5 shadow-lg border border-rose-900/40 space-y-4">
          <div className="flex items-center justify-between border-b border-rose-800/40 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-800/60 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-rose-200 animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">Aura AI • Assistente Operacional</h3>
                <p className="text-[10px] text-rose-200/70">Recomendações contextuais ativas para a receção</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-900/60 text-rose-200 border border-rose-700/50 rounded-full">
              Demonstração Interativa
            </span>
          </div>

          <div className="space-y-2.5">
            {initialAuraInsights.map((insight) => (
              <div
                key={insight.id}
                className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase text-rose-300 bg-rose-900/40 px-1.5 py-0.5 rounded">
                      {insight.type}
                    </span>
                    <h4 className="font-bold text-xs text-white">{insight.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">{insight.description}</p>
                  <p className="text-[10px] font-bold text-emerald-300 mt-0.5">{insight.impact}</p>
                </div>

                {insight.actionTab && (
                  <button
                    onClick={() => onSelectTab(insight.actionTab!)}
                    className="shrink-0 bg-white hover:bg-rose-50 text-rose-950 font-bold py-1.5 px-3 rounded-lg text-xs transition-all cursor-pointer shadow-xs text-center"
                  >
                    {insight.actionLabel}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tools */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
          <h3 className="font-extrabold text-slate-900 text-sm">Ferramentas Rápidas de Balcão</h3>
          <div className="space-y-2 text-xs">
            <button
              onClick={() => onSelectTab('caixa')}
              className="w-full p-3 bg-slate-50 hover:bg-rose-50/50 border border-slate-200 rounded-xl flex items-center justify-between font-bold text-slate-800 transition-all cursor-pointer"
            >
              <span>Abrir Ponto de Venda / Caixa</span>
              <ShoppingBag className="w-4 h-4 text-rose-800" />
            </button>

            <button
              onClick={() => onSelectTab('clients')}
              className="w-full p-3 bg-slate-50 hover:bg-rose-50/50 border border-slate-200 rounded-xl flex items-center justify-between font-bold text-slate-800 transition-all cursor-pointer"
            >
              <span>Cadastrar Novo Cliente</span>
              <Users className="w-4 h-4 text-rose-800" />
            </button>

            <button
              onClick={() => onSelectTab('waitlist')}
              className="w-full p-3 bg-slate-50 hover:bg-rose-50/50 border border-slate-200 rounded-xl flex items-center justify-between font-bold text-slate-800 transition-all cursor-pointer"
            >
              <span>Consultar Lista de Espera</span>
              <Clock className="w-4 h-4 text-rose-800" />
            </button>

            <button
              onClick={() => onSelectTab('stock')}
              className="w-full p-3 bg-slate-50 hover:bg-rose-50/50 border border-slate-200 rounded-xl flex items-center justify-between font-bold text-slate-800 transition-all cursor-pointer"
            >
              <span>Verificar Armazém / Estoque</span>
              <ShieldAlert className="w-4 h-4 text-rose-800" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
