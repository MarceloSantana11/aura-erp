import React, { useState } from 'react';
import { Calendar, Plus, Clock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Client, Appointment } from '../../types';
import { Button } from '../ui/Button';
import { useTranslation } from '../../i18n/I18nContext';

interface ClientAppointmentsTabProps {
  client: Client;
  appointments: Appointment[];
  onNewAppointment: () => void;
  onInspectAppointment: (app: Appointment) => void;
}

export const ClientAppointmentsTab: React.FC<ClientAppointmentsTabProps> = ({
  client,
  appointments: allAppointments,
  onNewAppointment,
  onInspectAppointment,
}) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'Todos' | 'Próximos' | 'Concluídos' | 'Cancelados'>('Todos');

  // Filter client appointments
  const clientApps = allAppointments.filter(
    (a) =>
      a.clientName.toLowerCase().includes(client.name.toLowerCase()) ||
      client.name.toLowerCase().includes(a.clientName.toLowerCase())
  );

  const filtered = clientApps.filter((app) => {
    if (filter === 'Próximos') {
      return ['Confirmado', 'Por confirmar', 'Cliente chegou', 'Em atendimento'].includes(app.status);
    }
    if (filter === 'Concluídos') {
      return app.status === 'Concluído';
    }
    if (filter === 'Cancelados') {
      return ['Cancelado', 'Não compareceu'].includes(app.status);
    }
    return true;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-bold">
          {(['Todos', 'Próximos', 'Concluídos', 'Cancelados'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                filter === f
                  ? 'bg-rose-900 text-white border-rose-900 shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <Button variant="primary" size="sm" onClick={onNewAppointment}>
          <Plus className="w-3.5 h-3.5 mr-1" />
          Novo Agendamento
        </Button>
      </div>

      {/* List of Appointments */}
      {filtered.length === 0 ? (
        <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center text-slate-500 space-y-2">
          <Calendar className="w-8 h-8 text-rose-800 mx-auto" />
          <p className="font-bold text-slate-800 text-xs">Nenhum agendamento encontrado no filtro</p>
          <p className="text-[11px]">Selecione outro filtro ou registe um novo agendamento.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((app) => (
            <div
              key={app.id}
              onClick={() => onInspectAppointment(app)}
              className="p-4 bg-white border border-slate-200 hover:border-rose-300 rounded-2xl transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs touch-target"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs text-slate-900">{app.procedure}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-extrabold text-[10px] ${
                      app.status === 'Concluído'
                        ? 'bg-emerald-100 text-emerald-950'
                        : app.status === 'Confirmado'
                        ? 'bg-blue-100 text-blue-950'
                        : app.status === 'Em atendimento'
                        ? 'bg-amber-100 text-amber-950'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-rose-800" />
                    {app.date} às {app.time} ({app.durationMinutes} min)
                  </span>
                  <span>• Profissional: {app.professional}</span>
                </div>

                {app.notes && (
                  <p className="text-[11px] text-slate-500 italic line-clamp-1">
                    "{app.notes}"
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <p className="text-sm font-black text-slate-900">{app.value}€</p>
                  <span className="text-[10px] text-slate-400">{app.paymentStatus}</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNewAppointment();
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-800 hover:text-rose-950 font-bold text-xs flex items-center gap-1 transition-colors"
                  title="Agendar Novamente"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-rose-800" />
                  Repetir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
