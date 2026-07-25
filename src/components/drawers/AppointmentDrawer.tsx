import React from 'react';
import {
  X,
  ArrowLeft,
  Calendar,
  Clock,
  User,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  ShoppingBag,
  UserCheck,
  Building2,
  FileText,
} from 'lucide-react';
import { Appointment, AppointmentStatus } from '../../types';
import { useDrawer } from '../../context/DrawerContext';
import { useOperational, isValidTransition } from '../../context/OperationalContext';
import { Button } from '../ui/Button';

interface AppointmentDrawerProps {
  appointment: Appointment;
  onOpenCheckout?: (app: Appointment) => void;
}

export const AppointmentDrawer: React.FC<AppointmentDrawerProps> = ({
  appointment,
  onOpenCheckout,
}) => {
  const { drawerStack, popDrawer, closeDrawer, pushDrawer } = useDrawer();
  const { clients, updateAppointmentStatus, showToast } = useOperational();

  const isStacked = drawerStack.length > 1;

  // Find associated client
  const clientObj = clients.find(
    (c) =>
      c.name.toLowerCase() === appointment.clientName.toLowerCase() ||
      appointment.clientName.toLowerCase().includes(c.name.toLowerCase())
  );

  const handleStatusChange = (newStatus: AppointmentStatus) => {
    if (!isValidTransition(appointment.status, newStatus)) {
      showToast(
        'Transição Inválida',
        `Não é possível alterar o estado de "${appointment.status}" para "${newStatus}".`,
        'warning'
      );
      return;
    }

    const res = updateAppointmentStatus(appointment.id, newStatus);
    if (res.success) {
      showToast('Estado Atualizado', `Agendamento alterado para "${newStatus}".`, 'success');
    }
  };

  const handleInspectClient = () => {
    if (clientObj) {
      pushDrawer('client', clientObj);
    } else {
      showToast('Cliente não localizado', 'Ficha do cliente não encontrada no cadastro.', 'info');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 text-slate-900 font-sans">
      {/* Drawer Header */}
      <div className="p-4 bg-white border-b border-slate-200/90 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-2">
          {isStacked ? (
            <button
              onClick={popDrawer}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-rose-900 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Anterior</span>
            </button>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-950 font-extrabold text-[10px] tracking-wider uppercase">
              Agendamento
            </span>
          )}

          <h3 className="font-black text-sm text-slate-900 truncate max-w-[180px] sm:max-w-xs">
            {appointment.procedure}
          </h3>
        </div>

        <button
          onClick={closeDrawer}
          className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Drawer Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {/* Status Banner & Transition Actions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Estado Atual do Atendimento
            </span>
            <span
              className={`px-3 py-1 rounded-full font-black text-xs ${
                appointment.status === 'Concluído'
                  ? 'bg-emerald-100 text-emerald-950'
                  : appointment.status === 'Em atendimento'
                  ? 'bg-amber-100 text-amber-950'
                  : appointment.status === 'Confirmado'
                  ? 'bg-blue-100 text-blue-950'
                  : 'bg-slate-100 text-slate-800'
              }`}
            >
              {appointment.status}
            </span>
          </div>

          <p className="text-xs font-semibold text-slate-600">
            Ações Rápidas de Transição de Estado:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {appointment.status !== 'Confirmado' && (
              <button
                onClick={() => handleStatusChange('Confirmado')}
                className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs border border-blue-200 transition-colors"
              >
                Confirmar
              </button>
            )}

            {appointment.status !== 'Cliente chegou' && (
              <button
                onClick={() => handleStatusChange('Cliente chegou')}
                className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs border border-purple-200 transition-colors"
              >
                Cliente Chegou
              </button>
            )}

            {appointment.status !== 'Em atendimento' && (
              <button
                onClick={() => handleStatusChange('Em atendimento')}
                className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs border border-amber-200 transition-colors flex items-center justify-center gap-1"
              >
                <Play className="w-3.5 h-3.5 fill-amber-950" />
                Iniciar Atendimento
              </button>
            )}

            {appointment.status !== 'Concluído' && (
              <button
                onClick={() => handleStatusChange('Concluído')}
                className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-xs border border-emerald-200 transition-colors flex items-center justify-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                Concluir
              </button>
            )}

            {appointment.status !== 'Cancelado' && (
              <button
                onClick={() => handleStatusChange('Cancelado')}
                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 font-bold text-xs border border-rose-200 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>

        {/* Client & Service Info Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-rose-800" />
              Ficha do Cliente
            </h4>

            <button
              onClick={handleInspectClient}
              className="text-xs font-bold text-rose-800 hover:text-rose-950 transition-colors cursor-pointer"
            >
              Abrir Perfil 360º →
            </button>
          </div>

          <div
            onClick={handleInspectClient}
            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer flex items-center justify-between"
          >
            <div>
              <p className="font-black text-sm text-slate-900">{appointment.clientName}</p>
              <p className="text-[11px] text-slate-500 font-medium">
                {appointment.clientPhone || '+351 912 888 777'}
              </p>
            </div>
            <span className="text-xs font-bold text-rose-800">Ver Ficha</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Data & Hora
              </span>
              <p className="font-extrabold text-slate-900">
                {appointment.date} às {appointment.time}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Duração Estimada
              </span>
              <p className="font-extrabold text-slate-900">{appointment.durationMinutes} minutos</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Profissional Atribuído
              </span>
              <p className="font-extrabold text-slate-900">{appointment.professional}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Sala / Cabine
              </span>
              <p className="font-extrabold text-slate-900">{appointment.room || 'Cadeira 01'}</p>
            </div>
          </div>
        </div>

        {/* Pricing & Checkout Action */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Valor do Atendimento
              </span>
              <p className="text-xl font-black text-slate-900">{appointment.value}€</p>
            </div>

            <button
              onClick={() => onOpenCheckout && onOpenCheckout(appointment)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer touch-target"
            >
              <ShoppingBag className="w-4 h-4 text-rose-300" />
              Finalizar no Caixa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
