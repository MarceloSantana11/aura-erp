import React, { useState } from 'react';
import {
  ArrowLeft,
  LayoutDashboard,
  Calendar,
  DollarSign,
  Crown,
  FileText,
  User,
  Plus,
} from 'lucide-react';
import { Client, Appointment, ClientPreference, ClientNoteItem } from '../../types';
import { useOperational } from '../../context/OperationalContext';
import { useDrawer } from '../../context/DrawerContext';
import { ClientIdentityHeader } from './ClientIdentityHeader';
import { ClientOverviewTab } from './ClientOverviewTab';
import { ClientAppointmentsTab } from './ClientAppointmentsTab';
import { ClientFinancialTab } from './ClientFinancialTab';
import { ClientLoyaltyTab } from './ClientLoyaltyTab';
import { ClientNotesTab } from './ClientNotesTab';
import { Button } from '../ui/Button';

interface ClientFullProfileViewProps {
  client: Client;
  onBack: () => void;
  onOpenAppointmentModal: (clientId?: string, clientName?: string) => void;
}

export const ClientFullProfileView: React.FC<ClientFullProfileViewProps> = ({
  client: initialClient,
  onBack,
  onOpenAppointmentModal,
}) => {
  const { appointments, transactions, packages, updateClient, showToast } = useOperational();
  const { pushDrawer } = useDrawer();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'appointments' | 'financial' | 'loyalty' | 'notes'
  >('overview');

  const currentClient = initialClient;

  // Next appointment
  const clientApps = appointments.filter(
    (a) =>
      a.clientName.toLowerCase().includes(currentClient.name.toLowerCase()) ||
      currentClient.name.toLowerCase().includes(a.clientName.toLowerCase())
  );

  const nextAppointment = clientApps.find((a) =>
    ['Confirmado', 'Por confirmar', 'Cliente chegou', 'Em atendimento'].includes(a.status)
  );

  const handleAddPreference = (pref: Omit<ClientPreference, 'id'>) => {
    const newPref: ClientPreference = {
      ...pref,
      id: `p-${Date.now()}`,
    };
    const updatedPreferences = [...(currentClient.preferences || []), newPref];
    updateClient(currentClient.id, { preferences: updatedPreferences });
    showToast('Preferência Guardada', 'Preferência adicionada ao perfil.', 'success');
  };

  const handleAddNote = (noteInput: Omit<ClientNoteItem, 'id' | 'createdAt'>) => {
    const newNote: ClientNoteItem = {
      ...noteInput,
      id: `n-${Date.now()}`,
      createdAt: 'Hoje',
    };
    const updatedNotes = [newNote, ...(currentClient.detailedNotes || [])];
    updateClient(currentClient.id, { detailedNotes: updatedNotes });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-150">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-rose-800" />
            Voltar à Lista de Clientes
          </button>

          <div>
            <span className="text-[10px] uppercase font-bold text-rose-800 tracking-wider">
              Perfil Completo 360º
            </span>
            <h1 className="text-xl font-black text-slate-900">{currentClient.name}</h1>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={() => onOpenAppointmentModal(currentClient.id, currentClient.name)}
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Novo Agendamento
        </Button>
      </div>

      {/* Identity & Header Card */}
      <ClientIdentityHeader
        client={currentClient}
        onNewAppointment={() =>
          onOpenAppointmentModal(currentClient.id, currentClient.name)
        }
        onOpenMessage={() =>
          showToast(
            'WhatsApp Lembrete',
            `A abrir canal direto com ${currentClient.phone}...`,
            'info'
          )
        }
        onAddNote={() => setActiveTab('notes')}
        onOpenCheckout={() =>
          showToast('Caixa', `Abertura de atendimento para ${currentClient.name}`, 'info')
        }
        isFullProfileView={true}
      />

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl overflow-x-auto text-xs font-extrabold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-rose-800" />
          Visão Geral
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'appointments'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4 text-rose-800" />
          Agendamentos ({clientApps.length})
        </button>

        <button
          onClick={() => setActiveTab('financial')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'financial'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <DollarSign className="w-4 h-4 text-rose-800" />
          Financeiro & Pacotes
        </button>

        <button
          onClick={() => setActiveTab('loyalty')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'loyalty'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Crown className="w-4 h-4 text-amber-500" />
          Fidelização & Vouchers
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'notes'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-rose-800" />
          Observações & Alertas
        </button>
      </div>

      {/* Active Tab Panel */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        {activeTab === 'overview' && (
          <ClientOverviewTab
            client={currentClient}
            nextAppointment={nextAppointment}
            onNewAppointment={() =>
              onOpenAppointmentModal(currentClient.id, currentClient.name)
            }
            onInspectAppointment={(app) => pushDrawer('appointment', app)}
            onOpenLoyaltyTab={() => setActiveTab('loyalty')}
            onAddPreference={handleAddPreference}
          />
        )}

        {activeTab === 'appointments' && (
          <ClientAppointmentsTab
            client={currentClient}
            appointments={appointments}
            onNewAppointment={() =>
              onOpenAppointmentModal(currentClient.id, currentClient.name)
            }
            onInspectAppointment={(app) => pushDrawer('appointment', app)}
          />
        )}

        {activeTab === 'financial' && (
          <ClientFinancialTab
            client={currentClient}
            transactions={transactions}
            packages={packages}
            onOpenCheckout={() =>
              showToast('Caixa', 'Abertura do terminal.', 'info')
            }
          />
        )}

        {activeTab === 'loyalty' && <ClientLoyaltyTab client={currentClient} />}

        {activeTab === 'notes' && (
          <ClientNotesTab client={currentClient} onAddNote={handleAddNote} />
        )}
      </div>
    </div>
  );
};
