import React, { useState } from 'react';
import { X, Clock, User, Sparkles, Euro, UserPlus } from 'lucide-react';
import { Appointment } from '../types';
import { useOperational } from '../context/OperationalContext';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAppointment?: (appointment: Omit<Appointment, 'id'>) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onAddAppointment,
}) => {
  const { clients, services, professionals, addAppointment, addClient } = useOperational();

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('+351 9');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || '');
  const [professional, setProfessional] = useState<string>(
    professionals[0]?.name || 'Dra. Helena Silva'
  );
  const [time, setTime] = useState('10:00');
  const [customValue, setCustomValue] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const currentService = services.find((s) => s.id === selectedServiceId) || services[0];
  const finalValue = customValue ? parseFloat(customValue) : currentService?.price || 65;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    // Check if client exists, if not, auto-register in CRM
    const existingClient = clients.find(
      (c) => c.name.toLowerCase() === clientName.trim().toLowerCase()
    );

    if (!existingClient && clientName.trim()) {
      addClient({
        name: clientName.trim(),
        phone: clientPhone || '+351 912 345 678',
        email: `${clientName.trim().toLowerCase().replace(/\s+/g, '.')}@email.pt`,
        totalSpent: 0,
        lastVisit: 'Hoje',
        status: 'Novo',
        vipLevel: 'Standard',
        notes: 'Cliente registado via rápido agendamento na receção.',
      });
    }

    const procedureName = currentService ? currentService.name : 'Tratamento Estético';

    const newApp: Omit<Appointment, 'id'> = {
      date: '25/07/2026',
      time,
      durationMinutes: currentService?.durationMinutes || 60,
      clientName: clientName.trim(),
      clientPhone: clientPhone,
      procedure: procedureName,
      services: currentService ? [currentService] : [],
      professional,
      value: finalValue,
      depositPaid: 0,
      status: 'Confirmado',
      paymentStatus: 'Pendente',
      notes,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    };

    if (onAddAppointment) {
      onAddAppointment(newApp);
    } else {
      addAppointment(newApp);
    }

    setClientName('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Novo Agendamento Operacional</h3>
            <p className="text-xs text-slate-500">Registar marcação ou encaixe no fluxo de trabalho</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">
              Cliente (Selecionar ou Escrever Novo)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-rose-800 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                list="client-suggestions"
                placeholder="Ex: Mariana Oliveira"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 font-bold outline-none focus:border-rose-800"
              />
              <datalist id="client-suggestions">
                {clients.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.phone}
                  </option>
                ))}
              </datalist>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">
              Serviço do Catálogo
            </label>
            <div className="relative">
              <Sparkles className="w-4 h-4 text-rose-800 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={selectedServiceId}
                onChange={(e) => {
                  setSelectedServiceId(e.target.value);
                  setCustomValue('');
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 font-bold outline-none cursor-pointer focus:border-rose-800"
              >
                {services.map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.name} — {srv.price}€ ({srv.durationMinutes}m)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">
                Profissional Atribuído
              </label>
              <select
                value={professional}
                onChange={(e) => setProfessional(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-bold outline-none cursor-pointer focus:border-rose-800"
              >
                {professionals.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">
                Horário
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-rose-800 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 font-bold outline-none focus:border-rose-800"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">
              Valor do Procedimento (€)
            </label>
            <div className="relative">
              <Euro className="w-4 h-4 text-rose-800 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                placeholder={`${currentService?.price || 65}`}
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 font-bold outline-none focus:border-rose-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">
              Notas de Atendimento / Preferências
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Pedido especial de bebidas, alergias ou tom desejado..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium outline-none focus:border-rose-800"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-extrabold transition-all cursor-pointer shadow-xs"
            >
              Confirmar Agendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
