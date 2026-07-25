import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { ScheduleException, TimePeriod } from '../../types';
import { Button } from '../ui/Button';

interface ScheduleExceptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exception: Omit<ScheduleException, 'id'> | ScheduleException) => void;
  initialData?: ScheduleException | null;
}

export const ScheduleExceptionModal: React.FC<ScheduleExceptionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const isEdit = !!initialData;

  const [date, setDate] = useState('');
  const [type, setType] = useState<ScheduleException['type']>('Horário Especial');
  const [isOpenDay, setIsOpenDay] = useState(true);
  const [reason, setReason] = useState('');
  const [periods, setPeriods] = useState<TimePeriod[]>([
    { startTime: '09:00', endTime: '14:00' },
  ]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date || '');
      setType(initialData.type || 'Horário Especial');
      setIsOpenDay(initialData.isOpen);
      setReason(initialData.reason || '');
      setPeriods(
        initialData.periods && initialData.periods.length > 0
          ? initialData.periods
          : [{ startTime: '09:00', endTime: '14:00' }]
      );
    } else {
      setDate('');
      setType('Horário Especial');
      setIsOpenDay(true);
      setReason('');
      setPeriods([{ startTime: '09:00', endTime: '14:00' }]);
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAddPeriod = () => {
    setPeriods([...periods, { startTime: '15:00', endTime: '19:00' }]);
  };

  const handleRemovePeriod = (index: number) => {
    setPeriods(periods.filter((_, i) => i !== index));
  };

  const handlePeriodChange = (index: number, field: keyof TimePeriod, value: string) => {
    const updated = [...periods];
    updated[index] = { ...updated[index], [field]: value };
    setPeriods(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      setError('A data da exceção é obrigatória.');
      return;
    }
    if (!reason.trim()) {
      setError('O motivo/descrição da exceção é obrigatório.');
      return;
    }

    if (isOpenDay) {
      if (periods.length === 0) {
        setError('Especifique pelo menos um período de funcionamento para o dia aberto.');
        return;
      }
      for (const p of periods) {
        if (p.startTime >= p.endTime) {
          setError('A hora de abertura deve ser anterior à hora de fecho.');
          return;
        }
      }
    }

    const payload = {
      ...(initialData ? { id: initialData.id } : {}),
      date,
      type,
      isOpen: isOpenDay,
      periods: isOpenDay ? periods : [],
      reason: reason.trim(),
      status: 'Ativo' as const,
    };

    onSave(payload as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-100 text-rose-800">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                {isEdit ? 'Editar Exceção de Horário' : 'Adicionar Exceção de Horário'}
              </h3>
              <p className="text-xs text-slate-500">Feriados, horários especiais e encerramentos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Data (DD/MM/AAAA) *</label>
              <input
                type="text"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Ex: 24/12/2026"
                className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-rose-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Exceção</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-rose-800"
              >
                <option value="Feriado">Feriado</option>
                <option value="Horário Especial">Horário Especial</option>
                <option value="Encerramento">Encerramento Extraordinário</option>
                <option value="Evento">Evento / Formação</option>
                <option value="Manutenção">Manutenção Técnica</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Motivo / Descrição *</label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Véspera de Natal, Tolerância de ponto..."
              className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:border-rose-800"
            />
          </div>

          {/* Toggle Aberto / Encerrado */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold text-slate-900 block">
                Estado de Funcionamento
              </span>
              <span className="text-[11px] text-slate-500">
                {isOpenDay ? 'Estabelecimento aberto nesta data' : 'Estabelecimento completamente encerrado'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsOpenDay(!isOpenDay)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isOpenDay
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}
            >
              {isOpenDay ? 'Aberto' : 'Encerrado'}
            </button>
          </div>

          {/* Periods if Open */}
          {isOpenDay && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Períodos de Atendimento</label>
                <button
                  type="button"
                  onClick={handleAddPeriod}
                  className="text-xs font-bold text-rose-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Adicionar Turno
                </button>
              </div>

              {periods.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="time"
                    value={p.startTime}
                    onChange={(e) => handlePeriodChange(i, 'startTime', e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-bold rounded-xl border border-slate-200"
                  />
                  <span className="text-xs text-slate-400">até</span>
                  <input
                    type="time"
                    value={p.endTime}
                    onChange={(e) => handlePeriodChange(i, 'endTime', e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-bold rounded-xl border border-slate-200"
                  />
                  {periods.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePeriod(i)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="ghost" onClick={onClose} type="button">
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {isEdit ? 'Guardar Alterações' : 'Adicionar Exceção'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
