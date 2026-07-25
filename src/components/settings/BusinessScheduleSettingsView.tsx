import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  Plus,
  Copy,
  Trash2,
  Save,
  CheckCircle,
  AlertTriangle,
  Globe,
  Info,
} from 'lucide-react';
import { BusinessSchedule, DaySchedule, ScheduleException, TimePeriod } from '../../types';
import { useOperational } from '../../context/OperationalContext';
import { ScheduleExceptionModal } from '../modals/ScheduleExceptionModal';
import { Button } from '../ui/Button';

export const BusinessScheduleSettingsView: React.FC = () => {
  const {
    businessSchedule,
    updateBusinessSchedule,
    addScheduleException,
    updateScheduleException,
    deleteScheduleException,
    showToast,
  } = useOperational();

  const [scheduleData, setScheduleData] = useState<BusinessSchedule>(businessSchedule);
  const [isExceptionModalOpen, setIsExceptionModalOpen] = useState(false);
  const [editingException, setEditingException] = useState<ScheduleException | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleDayToggle = (dayIndex: number) => {
    const updatedWeekly = [...scheduleData.weeklyHours];
    updatedWeekly[dayIndex] = {
      ...updatedWeekly[dayIndex],
      isOpen: !updatedWeekly[dayIndex].isOpen,
      periods: !updatedWeekly[dayIndex].isOpen
        ? updatedWeekly[dayIndex].periods.length > 0
          ? updatedWeekly[dayIndex].periods
          : [{ startTime: '09:00', endTime: '19:00' }]
        : [],
    };
    setScheduleData({ ...scheduleData, weeklyHours: updatedWeekly });
  };

  const handleAddPeriod = (dayIndex: number) => {
    const updatedWeekly = [...scheduleData.weeklyHours];
    const day = updatedWeekly[dayIndex];
    day.periods.push({ startTime: '14:00', endTime: '19:00' });
    setScheduleData({ ...scheduleData, weeklyHours: updatedWeekly });
  };

  const handleRemovePeriod = (dayIndex: number, periodIndex: number) => {
    const updatedWeekly = [...scheduleData.weeklyHours];
    updatedWeekly[dayIndex].periods.splice(periodIndex, 1);
    setScheduleData({ ...scheduleData, weeklyHours: updatedWeekly });
  };

  const handlePeriodChange = (
    dayIndex: number,
    periodIndex: number,
    field: keyof TimePeriod,
    val: string
  ) => {
    const updatedWeekly = [...scheduleData.weeklyHours];
    updatedWeekly[dayIndex].periods[periodIndex][field] = val;
    setScheduleData({ ...scheduleData, weeklyHours: updatedWeekly });
  };

  const handleCopyFirstDayToWeekdays = () => {
    const monday = scheduleData.weeklyHours[0]; // Monday
    if (!monday) return;

    const updatedWeekly = scheduleData.weeklyHours.map((d, idx) => {
      // Copy to Mon-Fri (indices 0 to 4)
      if (idx < 5) {
        return {
          ...d,
          isOpen: monday.isOpen,
          periods: monday.periods.map((p) => ({ ...p })),
        };
      }
      return d;
    });

    setScheduleData({ ...scheduleData, weeklyHours: updatedWeekly });
    showToast('Horário Copiado', 'Horário de Segunda-feira replicado para todos os dias úteis (Seg-Sex).', 'info');
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    for (const day of scheduleData.weeklyHours) {
      if (day.isOpen) {
        if (day.periods.length === 0) {
          showToast('Aviso de Horário', `Adicione pelo menos um período para ${day.dayLabel}.`, 'warning');
          return;
        }
        for (const p of day.periods) {
          if (p.startTime >= p.endTime) {
            showToast('Aviso de Horário', `Verifique os horários em ${day.dayLabel} (${p.startTime} - ${p.endTime}).`, 'warning');
            return;
          }
        }
      }
    }

    updateBusinessSchedule(scheduleData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleOpenCreateException = () => {
    setEditingException(null);
    setIsExceptionModalOpen(true);
  };

  const handleOpenEditException = (exc: ScheduleException) => {
    setEditingException(exc);
    setIsExceptionModalOpen(true);
  };

  const handleSaveException = (excData: any) => {
    if (editingException) {
      updateScheduleException(editingException.id, excData);
    } else {
      addScheduleException(excData);
    }
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner & Control Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-rose-100 text-rose-800">
              <Clock className="w-4 h-4" />
            </span>
            <span className="text-[10px] uppercase font-black tracking-wider text-rose-800">
              Estabelecimento & Operação
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-900">
            Horário de Funcionamento do Salão
          </h3>
          <p className="text-xs text-slate-500">
            Defina a disponibilidade geral por dia da semana, turnos/pausas e exceções/feriados
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleCopyFirstDayToWeekdays}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            Copiar Seg-Sex
          </button>

          <Button variant="primary" type="submit">
            {isSaved ? <CheckCircle className="w-4 h-4 mr-1.5" /> : <Save className="w-4 h-4 mr-1.5" />}
            {isSaved ? 'Guardado!' : 'Guardar Horário'}
          </Button>
        </div>
      </div>

      {/* Timezone Info & Global Specs */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Globe className="w-4 h-4 text-rose-800 shrink-0" />
          <div>
            <span className="font-bold text-slate-900">Fuso Horário & Localização: </span>
            Europe/Lisbon (GMT+0 / WET). Formato de 24 Horas ativado.
          </div>
        </div>
      </div>

      {/* Weekly Schedule Table */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
        <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-rose-800" />
          Horário Semanal de Abertura e Fecho
        </h4>

        <div className="space-y-3">
          {scheduleData.weeklyHours.map((day, dIdx) => (
            <div
              key={day.dayOfWeek}
              className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                day.isOpen
                  ? 'border-slate-200/90 bg-white'
                  : 'border-slate-200/60 bg-slate-50/70 opacity-75'
              }`}
            >
              {/* Day Label & Toggle */}
              <div className="flex items-center gap-3 min-w-[180px]">
                <button
                  type="button"
                  onClick={() => handleDayToggle(dIdx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    day.isOpen
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-slate-200 text-slate-600 border border-slate-300'
                  }`}
                >
                  {day.isOpen ? 'Aberto' : 'Encerrado'}
                </button>

                <span className="text-sm font-extrabold text-slate-900">{day.dayLabel}</span>
              </div>

              {/* Periods List */}
              <div className="flex-1 w-full md:w-auto">
                {day.isOpen ? (
                  <div className="space-y-2">
                    {day.periods.map((p, pIdx) => (
                      <div key={pIdx} className="flex items-center gap-2 text-xs font-semibold">
                        <span className="text-slate-400 font-bold text-[11px] w-12">
                          Turno {pIdx + 1}:
                        </span>
                        <input
                          type="time"
                          value={p.startTime}
                          onChange={(e) =>
                            handlePeriodChange(dIdx, pIdx, 'startTime', e.target.value)
                          }
                          className="px-3 py-1.5 rounded-xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-rose-800"
                        />
                        <span className="text-slate-400">até</span>
                        <input
                          type="time"
                          value={p.endTime}
                          onChange={(e) =>
                            handlePeriodChange(dIdx, pIdx, 'endTime', e.target.value)
                          }
                          className="px-3 py-1.5 rounded-xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-rose-800"
                        />

                        {day.periods.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePeriod(dIdx, pIdx)}
                            className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer ml-1"
                            title="Remover turno"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-slate-400 italic">
                    Sem atendimento ao público
                  </span>
                )}
              </div>

              {/* Add Turn Action */}
              {day.isOpen && (
                <button
                  type="button"
                  onClick={() => handleAddPeriod(dIdx)}
                  className="text-xs font-bold text-rose-800 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Adicionar Intervalo / Pausa
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Special Exceptions & Holidays Section */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-800" />
              Exceções, Feriados e Encerramentos Especiais
            </h4>
            <p className="text-xs text-slate-500">
              Datas específicas que sobrepõem o horário semanal normal
            </p>
          </div>

          <Button variant="outline" type="button" onClick={handleOpenCreateException}>
            <Plus className="w-4 h-4 mr-1.5 text-rose-800" />
            Adicionar Exceção
          </Button>
        </div>

        <div className="space-y-2">
          {(businessSchedule.exceptions || []).length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4 text-center">
              Nenhuma exceção agendada.
            </p>
          ) : (
            businessSchedule.exceptions.map((exc) => (
              <div
                key={exc.id}
                className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                      exc.isOpen
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        : 'bg-rose-100 text-rose-900 border border-rose-200'
                    }`}
                  >
                    {exc.isOpen ? 'Horário Especial' : 'Encerrado'}
                  </span>

                  <div>
                    <span className="text-xs font-black text-slate-900 block">
                      {exc.date} — {exc.reason}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {exc.isOpen && exc.periods
                        ? `Aberto das ${exc.periods.map((p) => `${p.startTime} às ${p.endTime}`).join(', ')}`
                        : 'Encerramento completo durante todo o dia'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEditException(exc)}
                    className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteScheduleException(exc.id)}
                    className="p-1.5 rounded-xl text-rose-700 hover:bg-rose-50 cursor-pointer"
                    title="Eliminar exceção"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ScheduleExceptionModal
        isOpen={isExceptionModalOpen}
        onClose={() => setIsExceptionModalOpen(false)}
        onSave={handleSaveException}
        initialData={editingException}
      />
    </form>
  );
};
