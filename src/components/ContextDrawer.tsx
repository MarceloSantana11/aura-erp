import React from 'react';
import {
  X,
  Calendar,
  Phone,
  Mail,
  CreditCard,
  Clock,
  MapPin,
  CheckCircle2,
  UserCheck,
  Play,
  XCircle,
  PlusCircle,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { Client, Appointment, Product, Professional, Transaction } from '../types';
import { useOperational } from '../context/OperationalContext';

export interface ContextDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'client' | 'appointment' | 'product' | 'professional' | 'transaction';
  data: any;
  onOpenCheckout?: (app: Appointment) => void;
  onNewAppointmentWithClient?: (clientName: string) => void;
}

export const ContextDrawer: React.FC<ContextDrawerProps> = ({
  isOpen,
  onClose,
  type,
  data,
  onOpenCheckout,
  onNewAppointmentWithClient,
}) => {
  const { updateAppointmentStatus, updateClient } = useOperational();

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-2xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div>
            <span className="text-[10px] font-extrabold tracking-wider text-rose-900 uppercase bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200">
              {type === 'client' && 'Ficha CRM de Cliente'}
              {type === 'appointment' && 'Atendimento Operacional'}
              {type === 'product' && 'Ficha de Produto & Estoque'}
              {type === 'professional' && 'Perfil do Profissional'}
              {type === 'transaction' && 'Registo Financeiro'}
            </span>
            <h3 className="text-base font-extrabold text-slate-900 mt-1.5">
              {type === 'client' && data.name}
              {type === 'appointment' && data.procedure}
              {type === 'product' && data.name}
              {type === 'professional' && data.name}
              {type === 'transaction' && data.clientName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-all cursor-pointer touch-target"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-slate-700">
          {/* CLIENT CONTENT */}
          {type === 'client' && (
            <div className="space-y-5">
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-2xs">
                <img
                  src={
                    data.avatar ||
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
                  }
                  alt={data.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-rose-200 shrink-0"
                />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{data.name}</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">{data.email}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="px-2.5 py-0.5 bg-rose-100 text-rose-900 font-bold text-[10px] rounded-full">
                      {data.vipLevel || 'Standard'}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      NIF: {data.nif || 'Consumidor Final'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Total Gasto</span>
                  <p className="text-base font-black text-slate-900 mt-0.5">{data.totalSpent}€</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Pontos Fidelidade</span>
                  <p className="text-base font-black text-rose-800 mt-0.5">{data.loyaltyPoints || 0} pts</p>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                  Contactos e Localização
                </h5>
                <div className="space-y-2 text-slate-700 bg-white border border-slate-200 p-3.5 rounded-2xl">
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-rose-800 shrink-0" />
                    <span className="font-medium">{data.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-rose-800 shrink-0" />
                    <span className="font-medium">{data.email}</span>
                  </div>
                  {data.address && (
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-rose-800 shrink-0" />
                      <span className="font-medium">{data.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {data.notes && (
                <div className="space-y-1.5">
                  <h5 className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                    Observações & Preferências
                  </h5>
                  <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-2xl text-amber-950 font-medium">
                    {data.notes}
                  </div>
                </div>
              )}

              {onNewAppointmentWithClient && (
                <button
                  onClick={() => {
                    onClose();
                    onNewAppointmentWithClient(data.name);
                  }}
                  className="w-full bg-rose-800 hover:bg-rose-900 text-white font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Novo Agendamento para Este Cliente</span>
                </button>
              )}
            </div>
          )}

          {/* APPOINTMENT CONTENT & STATE TRANSITION MACHINE */}
          {type === 'appointment' && (
            <div className="space-y-5">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${
                      data.status === 'Em atendimento'
                        ? 'bg-rose-800 text-white'
                        : data.status === 'Cliente chegou'
                        ? 'bg-amber-100 text-amber-950'
                        : data.status === 'Concluído'
                        ? 'bg-emerald-100 text-emerald-950'
                        : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    Estado: {data.status}
                  </span>
                  <span className="text-base font-black text-slate-900">{data.value}€</span>
                </div>

                <div className="space-y-1">
                  <p className="font-extrabold text-slate-900 text-sm">{data.procedure}</p>
                  <p className="text-slate-600">
                    Cliente: <strong className="text-slate-900 font-bold">{data.clientName}</strong>
                  </p>
                  <p className="text-slate-600">
                    Profissional:{' '}
                    <strong className="text-slate-900 font-bold">{data.professional}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-4 text-[11px] text-slate-500 border-t border-slate-200/80 pt-2.5">
                  <span className="flex items-center gap-1 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-rose-800" />
                    {data.date}
                  </span>
                  <span className="flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-rose-800" />
                    {data.time} ({data.durationMinutes} min)
                  </span>
                </div>
              </div>

              {data.room && (
                <div className="bg-white border border-slate-200 p-3.5 rounded-2xl flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Sala / Cadeira:</span>
                  <span className="font-extrabold text-slate-900">{data.room}</span>
                </div>
              )}

              {data.notes && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">
                    Observações de Atendimento:
                  </span>
                  <p className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-800 font-medium">
                    {data.notes}
                  </p>
                </div>
              )}

              {/* OPERATIONAL ACTIONS (STATE MACHINE BUTTONS) */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <h5 className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                  Ações Operacionais de Receção
                </h5>

                {data.status === 'Por confirmar' && (
                  <button
                    onClick={() => {
                      updateAppointmentStatus(data.id, 'Confirmado');
                      onClose();
                    }}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar Agendamento</span>
                  </button>
                )}

                {(data.status === 'Confirmado' || data.status === 'Por confirmar') && (
                  <button
                    onClick={() => {
                      updateAppointmentStatus(data.id, 'Cliente chegou');
                      onClose();
                    }}
                    className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Registar Chegada do Cliente</span>
                  </button>
                )}

                {(data.status === 'Cliente chegou' || data.status === 'Confirmado') && (
                  <button
                    onClick={() => {
                      updateAppointmentStatus(data.id, 'Em atendimento');
                      onClose();
                    }}
                    className="w-full bg-rose-800 hover:bg-rose-900 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <Play className="w-4 h-4" />
                    <span>Iniciar Atendimento Agora</span>
                  </button>
                )}

                {data.status === 'Em atendimento' && (
                  <button
                    onClick={() => {
                      updateAppointmentStatus(data.id, 'Concluído');
                      onClose();
                      if (onOpenCheckout) onOpenCheckout(data);
                    }}
                    className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Finalizar Atendimento & Ir para Checkout</span>
                  </button>
                )}

                {data.status === 'Concluído' && data.paymentStatus !== 'Pago' && onOpenCheckout && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCheckout(data);
                    }}
                    className="w-full bg-rose-900 hover:bg-rose-950 text-white font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Abrir Checkout & Receber ({data.value}€)</span>
                  </button>
                )}

                {data.status !== 'Cancelado' && data.status !== 'Concluído' && (
                  <button
                    onClick={() => {
                      if (confirm('Tem a certeza que deseja cancelar este agendamento?')) {
                        updateAppointmentStatus(data.id, 'Cancelado');
                        onClose();
                      }
                    }}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer text-xs"
                  >
                    <XCircle className="w-4 h-4 text-slate-500" />
                    <span>Cancelar Agendamento</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* PRODUCT CONTENT */}
          {type === 'product' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  SKU: {data.sku}
                </span>
                <h4 className="font-extrabold text-slate-900 text-sm">{data.name}</h4>
                <div className="flex items-center justify-between pt-2">
                  <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-slate-200 text-slate-800">
                    {data.category}
                  </span>
                  <span className="text-base font-black text-slate-900">{data.price}€</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border border-slate-200 p-3.5 rounded-2xl">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Estoque Atual</span>
                  <p className="text-base font-black text-slate-900 mt-0.5">{data.stock} un</p>
                </div>
                <div className="bg-white border border-slate-200 p-3.5 rounded-2xl">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Estoque Mínimo</span>
                  <p className="text-base font-black text-slate-500 mt-0.5">{data.minStock} un</p>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <p className="text-slate-500 text-[11px]">Fornecedor Principal:</p>
                <p className="font-bold text-slate-900 mt-0.5">{data.supplier}</p>
              </div>
            </div>
          )}

          {/* PROFESSIONAL CONTENT */}
          {type === 'professional' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <img
                  src={data.avatar}
                  alt={data.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-rose-200 shrink-0"
                />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{data.name}</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">{data.role}</p>
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900">
                    Comissão Base: {data.commissionRate}%
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  Especialidades Operacionais:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {data.specialties?.map((s: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold rounded-lg text-[11px]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-3.5 rounded-2xl space-y-1">
                <p className="text-slate-500 text-[11px]">Telefone de Contacto:</p>
                <p className="font-bold text-slate-900">{data.phone}</p>
              </div>
            </div>
          )}

          {/* TRANSACTION CONTENT */}
          {type === 'transaction' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {data.status}
                  </span>
                  <span className="text-lg font-black text-slate-900">{data.value}€</span>
                </div>
                <p className="font-extrabold text-slate-900">{data.procedure}</p>
                <p className="text-slate-600">
                  Cliente: <strong className="text-slate-900 font-bold">{data.clientName}</strong>
                </p>
                <p className="text-slate-400 text-[11px]">{data.time}</p>
              </div>

              <div className="bg-white border border-slate-200 p-3.5 rounded-2xl flex items-center justify-between">
                <span className="text-slate-500 font-medium">Método de Pagamento:</span>
                <span className="font-extrabold text-slate-900">
                  {data.paymentMethod || 'Multibanco'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition-all cursor-pointer touch-target"
          >
            Fechar Painel
          </button>
        </div>
      </div>
    </div>
  );
};
