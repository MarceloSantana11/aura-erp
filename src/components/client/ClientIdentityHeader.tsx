import React from 'react';
import {
  Phone,
  Mail,
  Calendar,
  Plus,
  MessageSquare,
  DollarSign,
  Crown,
  FileText,
  UserCheck,
  Maximize2,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { Client } from '../../types';
import { Button } from '../ui/Button';
import { useTranslation } from '../../i18n/I18nContext';

interface ClientIdentityHeaderProps {
  client: Client;
  onNewAppointment: () => void;
  onOpenMessage: () => void;
  onAddNote: () => void;
  onOpenCheckout: () => void;
  onToggleFullProfile?: () => void;
  isFullProfileView?: boolean;
}

export const ClientIdentityHeader: React.FC<ClientIdentityHeaderProps> = ({
  client,
  onNewAppointment,
  onOpenMessage,
  onAddNote,
  onOpenCheckout,
  onToggleFullProfile,
  isFullProfileView = false,
}) => {
  const { t } = useTranslation();

  const getVipBadgeColor = (level?: string) => {
    switch (level) {
      case 'Signature VIP':
        return 'bg-amber-100 text-amber-950 border-amber-300';
      case 'Gold VIP':
        return 'bg-rose-100 text-rose-950 border-rose-300';
      case 'Silver':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadgeColor = (status: Client['status']) => {
    switch (status) {
      case 'Ativo':
        return 'bg-emerald-100 text-emerald-950 border-emerald-300';
      case 'Novo':
        return 'bg-blue-100 text-blue-950 border-blue-300';
      case 'Risco de Abandono':
        return 'bg-amber-100 text-amber-950 border-amber-300';
      case 'Inativo':
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
      {/* Top Banner with Avatar, Name & Metadata */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <img
              src={
                client.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
              }
              alt={client.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-rose-200 shadow-xs"
            />
            {client.vipLevel && client.vipLevel !== 'Standard' && (
              <span className="absolute -bottom-1 -right-1 p-1 bg-amber-500 text-white rounded-full border-2 border-white shadow-xs">
                <Crown className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {client.name}
              </h2>

              <span
                className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full border ${getStatusBadgeColor(
                  client.status
                )}`}
              >
                {client.status}
              </span>

              {client.vipLevel && (
                <span
                  className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full border flex items-center gap-1 ${getVipBadgeColor(
                    client.vipLevel
                  )}`}
                >
                  <Crown className="w-3 h-3 text-amber-600" />
                  {client.vipLevel}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
              <a
                href={`tel:${client.phone}`}
                className="flex items-center gap-1 text-slate-700 hover:text-rose-800 transition-colors font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-rose-800" />
                {client.phone}
              </a>

              <span className="text-slate-300">•</span>

              <a
                href={`mailto:${client.email}`}
                className="flex items-center gap-1 text-slate-600 hover:text-rose-800 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-rose-800" />
                {client.email}
              </a>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
              <span>Cliente desde: {client.createdAt || 'Outubro de 2024'}</span>
              {client.nif && <span>• NIF: {client.nif}</span>}
            </div>
          </div>
        </div>

        {/* Action button for Full Profile view toggle */}
        {onToggleFullProfile && (
          <button
            onClick={onToggleFullProfile}
            className="self-end sm:self-auto px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {isFullProfileView ? (
              <>
                <ExternalLink className="w-3.5 h-3.5 text-rose-800" />
                Visão Contextual
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-rose-800" />
                Ver Perfil Completo 360º
              </>
            )}
          </button>
        )}
      </div>

      {/* Alerts or Sensitivities Warning Banner */}
      {client.alerts && client.alerts.length > 0 && (
        <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl flex items-center gap-2.5 text-xs text-amber-950 font-semibold">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="flex-1">
            <strong>Aviso de Atendimento:</strong> {client.alerts.join(' • ')}
          </p>
        </div>
      )}

      {/* Quick Action Toolbar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-100">
        <button
          onClick={onNewAppointment}
          className="p-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer touch-target"
        >
          <Calendar className="w-4 h-4" />
          Novo Agendamento
        </button>

        <button
          onClick={onOpenMessage}
          className="p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer touch-target"
        >
          <MessageSquare className="w-4 h-4" />
          Enviar Mensagem
        </button>

        <button
          onClick={onAddNote}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer touch-target"
        >
          <FileText className="w-4 h-4 text-rose-800" />
          Adicionar Nota
        </button>

        <button
          onClick={onOpenCheckout}
          className="p-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer touch-target"
        >
          <DollarSign className="w-4 h-4 text-rose-300" />
          Terminal Caixa
        </button>
      </div>
    </div>
  );
};
