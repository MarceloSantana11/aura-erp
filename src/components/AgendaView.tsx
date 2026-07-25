import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Eye,
  CheckCircle2,
  PhoneCall,
  Building2,
  Filter,
} from 'lucide-react';
import { Appointment, WaitlistItem } from '../types';
import { initialWaitlist, initialProfessionals } from '../data/mockData';
import { PageHeader } from './ui/PageHeader';
import { Button } from './ui/Button';
import { useTranslation } from '../i18n/I18nContext';

interface AgendaViewProps {
  appointments: Appointment[];
  waitlist?: WaitlistItem[];
  onNewAppointment: () => void;
  onInspectAppointment: (app: Appointment) => void;
  onUpdateAppointmentStatus: (id: string, newStatus: Appointment['status']) => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  appointments,
  waitlist: waitlistProp = initialWaitlist,
  onNewAppointment,
  onInspectAppointment,
  onUpdateAppointmentStatus,
}) => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'profissionais' | 'lista' | 'salas'>('profissionais');
  const [selectedProFilter, setSelectedProFilter] = useState<string>('todos');
  const waitlist = waitlistProp;

  const hours = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
  ];

  const filteredAppointments =
    selectedProFilter === 'todos'
      ? appointments
      : appointments.filter((a) => a.professional.includes(selectedProFilter));

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('tab.agenda', 'Agenda Operacional')}
        description={t(
          'agenda.sub',
          'Mapa diário de atendimentos, controlo de presenças na receção e alocação da equipa'
        )}
        primaryAction={{
          label: t('dashboard.newAppointment', 'Novo Agendamento'),
          icon: Plus,
          onClick: onNewAppointment,
        }}
      >
        {/* Responsive Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 border border-slate-200 rounded-2xl shadow-2xs">
          {/* Date Selector */}
          <div className="flex items-center gap-2 justify-between sm:justify-start">
            <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition-all cursor-pointer touch-target">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 font-extrabold text-slate-900 text-xs sm:text-sm">
              <CalendarIcon className="w-4 h-4 text-rose-800 shrink-0" />
              <span>Sábado, 25 de Julho de 2026</span>
            </div>
            <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition-all cursor-pointer touch-target">
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-bold uppercase bg-rose-100 text-rose-900 px-2 py-0.5 rounded border border-rose-200">
              Hoje
            </span>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
            <button
              onClick={() => setViewMode('profissionais')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                viewMode === 'profissionais'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Por Profissional
            </button>
            <button
              onClick={() => setViewMode('lista')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                viewMode === 'lista'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lista Sequencial
            </button>
          </div>
        </div>
      </PageHeader>

      {/* Professional Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <span className="text-xs font-bold text-slate-500 shrink-0 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-rose-800" /> Profissional:
        </span>
        <button
          onClick={() => setSelectedProFilter('todos')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            selectedProFilter === 'todos'
              ? 'bg-rose-800 text-white shadow-2xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Todos os Profissionais
        </button>
        {initialProfessionals.map((pro) => (
          <button
            key={pro.id}
            onClick={() => setSelectedProFilter(pro.name.split(' ')[0])}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              selectedProFilter === pro.name.split(' ')[0]
                ? 'bg-rose-800 text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <img src={pro.avatar} alt={pro.name} className="w-4 h-4 rounded-full object-cover" />
            <span>{pro.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Main Agenda Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Agenda View Grid / List */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          {/* MOBILE VIEW (ALWAYS RENDERED ON SMALL SCREENS OR WHEN IN LIST MODE) */}
          <div className="block lg:hidden p-4 space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 mb-2">
              Cronograma do Dia ({filteredAppointments.length} atendimentos)
            </h3>
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                Nenhum agendamento para o filtro selecionado.
              </div>
            ) : (
              filteredAppointments.map((app) => (
                <div
                  key={app.id}
                  className="p-4 bg-slate-50/80 hover:bg-rose-50/30 border border-slate-200 rounded-2xl space-y-3 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-rose-800 bg-rose-100 px-2.5 py-1 rounded-lg">
                        {app.time}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          app.status === 'Em atendimento'
                            ? 'bg-rose-800 text-white'
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
                    <span className="font-extrabold text-slate-900 text-sm">{app.value}€</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{app.clientName}</h4>
                    <p className="text-xs text-rose-800 font-medium mt-0.5">{app.procedure}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Profissional: <strong className="text-slate-800">{app.professional}</strong> •{' '}
                      {app.durationMinutes} min
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Eye}
                      onClick={() => onInspectAppointment(app)}
                    >
                      Detalhes
                    </Button>

                    {app.status === 'Confirmado' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onUpdateAppointmentStatus(app.id, 'Cliente chegou')}
                      >
                        Chegou
                      </Button>
                    )}

                    {app.status === 'Cliente chegou' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onUpdateAppointmentStatus(app.id, 'Em atendimento')}
                      >
                        Iniciar
                      </Button>
                    )}

                    {app.status === 'Em atendimento' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onUpdateAppointmentStatus(app.id, 'Concluído')}
                      >
                        Finalizar
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* DESKTOP MULTI-COLUMN GRID (HIDDEN ON MOBILE) */}
          <div className="hidden lg:block overflow-x-auto">
            {viewMode === 'profissionais' && (
              <div className="min-w-[750px]">
                {/* Professional Column Headers */}
                <div className="grid grid-cols-5 border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-700">
                  <div className="p-3 border-r border-slate-200 text-slate-400 uppercase text-[10px] font-mono">
                    Horário
                  </div>
                  {initialProfessionals.map((p) => (
                    <div key={p.id} className="p-3 border-r border-slate-200 flex items-center gap-2">
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-7 h-7 rounded-full object-cover border border-rose-200"
                      />
                      <div className="min-w-0">
                        <p className="font-extrabold text-slate-900 truncate text-[11px]">{p.name}</p>
                        <p className="text-[9px] text-slate-400 truncate">{p.role}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hour Rows */}
                <div className="divide-y divide-slate-100">
                  {hours.map((timeSlot) => (
                    <div key={timeSlot} className="grid grid-cols-5 min-h-[72px] text-xs">
                      {/* Time Slot Label */}
                      <div className="p-3 border-r border-slate-200 text-slate-400 font-bold text-[11px] bg-slate-50/50 flex items-start justify-center">
                        {timeSlot}
                      </div>

                      {/* Columns */}
                      {initialProfessionals.map((prof) => {
                        const matchingApps = appointments.filter(
                          (a) =>
                            a.professional.includes(prof.name.split(' ')[1] || prof.name) &&
                            a.time.startsWith(timeSlot.split(':')[0])
                        );

                        return (
                          <div
                            key={prof.id}
                            className="p-1.5 border-r border-slate-200 bg-slate-50/10 hover:bg-rose-50/20 transition-all flex flex-col gap-1.5 relative group cursor-pointer"
                            onClick={() => {
                              if (matchingApps.length === 0) onNewAppointment();
                            }}
                          >
                            {matchingApps.length === 0 ? (
                              <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-rose-800 font-bold text-[10px]">
                                + Agendar
                              </div>
                            ) : (
                              matchingApps.map((app) => (
                                <div
                                  key={app.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onInspectAppointment(app);
                                  }}
                                  className={`p-2.5 rounded-xl border shadow-2xs space-y-1 transition-all text-left ${
                                    app.status === 'Em atendimento'
                                      ? 'bg-rose-900 text-white border-rose-800'
                                      : app.status === 'Cliente chegou'
                                      ? 'bg-amber-100 text-amber-950 border-amber-300'
                                      : 'bg-slate-50 text-slate-900 border-slate-200 hover:border-rose-400'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-extrabold text-[11px] truncate">
                                      {app.clientName}
                                    </span>
                                    <span className="font-black text-[10px] shrink-0">{app.value}€</span>
                                  </div>
                                  <p className="text-[10px] opacity-90 truncate">{app.procedure}</p>
                                  <div className="flex items-center justify-between text-[9px] pt-1 opacity-80 border-t border-current/10">
                                    <span>{app.room || 'Bancada'}</span>
                                    <span className="font-bold">{app.status}</span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {viewMode === 'lista' && (
              <div className="p-4 space-y-3">
                {filteredAppointments.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-black text-rose-800 text-sm w-12">{app.time}</span>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{app.clientName}</h4>
                        <p className="text-[11px] text-slate-500">
                          {app.procedure} • {app.professional}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-slate-900 text-xs">{app.value}€</span>
                      <button
                        onClick={() => onInspectAppointment(app)}
                        className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-100 transition-all cursor-pointer"
                      >
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Panel: Waitlist & Quick Actions */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-800" />
                <h3 className="font-extrabold text-slate-900 text-xs">Lista de Espera Hoje</h3>
              </div>
              <span className="text-[10px] font-bold bg-rose-50 text-rose-800 px-2 py-0.5 rounded-full">
                {waitlist.length} Clientes
              </span>
            </div>

            <div className="space-y-2">
              {waitlist.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{item.clientName}</span>
                    <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-1.5 py-0.5 rounded">
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">{item.serviceName}</p>
                  <p className="text-[10px] text-slate-400">Prefere: {item.preferredTimeWindow}</p>

                  <button
                    onClick={onNewAppointment}
                    className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-1.5 px-2 rounded-lg text-xs transition-all cursor-pointer"
                  >
                    Atribuir Horário Livre
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
