import React, { useState } from 'react';
import {
  X,
  ArrowLeft,
  Calendar,
  DollarSign,
  Crown,
  FileText,
  User,
  LayoutDashboard,
  Gift,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Client, Appointment, ClientPreference, ClientNoteItem } from '../../types';
import { useDrawer } from '../../context/DrawerContext';
import { useOperational } from '../../context/OperationalContext';
import { ClientIdentityHeader } from '../client/ClientIdentityHeader';
import { ClientOverviewTab } from '../client/ClientOverviewTab';
import { ClientAppointmentsTab } from '../client/ClientAppointmentsTab';
import { ClientFinancialTab } from '../client/ClientFinancialTab';
import { ClientLoyaltyTab } from '../client/ClientLoyaltyTab';
import { ClientNotesTab } from '../client/ClientNotesTab';

interface ClientDrawerProps {
  client: Client;
  onOpenAppointmentModal: (clientId?: string, clientName?: string) => void;
  onToggleFullProfileView?: () => void;
}

export const ClientDrawer: React.FC<ClientDrawerProps> = ({
  client: initialClient,
  onOpenAppointmentModal,
  onToggleFullProfileView,
}) => {
  const { drawerStack, popDrawer, closeDrawer, pushDrawer } = useDrawer();
  const { appointments, transactions, packages, updateClient, showToast } = useOperational();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'appointments' | 'financial' | 'loyalty' | 'notes'
  >('overview');

  // Maintain local sync with client object if updated
  const currentClient = initialClient;

  const isStacked = drawerStack.length > 1;

  // Next appointment for overview
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
    <div className="flex flex-col h-full bg-slate-50/50 text-slate-900 font-sans">
      {/* Drawer Header & Stack Navigation */}
      <div className="p-4 bg-white border-b border-slate-200/90 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-2">
          {isStacked ? (
            <button
              onClick={popDrawer}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-rose-900 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-950 font-extrabold text-[10px] tracking-wider uppercase">
              Context Drawer 360º
            </span>
          )}

          <h3 className="font-black text-sm text-slate-900 truncate max-w-[180px] sm:max-w-xs">
            {currentClient.name}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {onToggleFullProfileView && (
            <button
              onClick={onToggleFullProfileView}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              title="Expandir Perfil Completo 360º"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={closeDrawer}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Drawer Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {/* Identity & Quick Actions Header */}
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
            showToast(
              'Terminal Caixa',
              `Iniciando atendimento de balcão para ${currentClient.name}.`,
              'info'
            )
          }
          onToggleFullProfile={onToggleFullProfileView}
        />

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl overflow-x-auto text-xs font-extrabold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-rose-800" />
            Visão Geral
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'appointments'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-rose-800" />
            Agendamentos ({clientApps.length})
          </button>

          <button
            onClick={() => setActiveTab('financial')}
            className={`px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'financial'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-rose-800" />
            Financeiro
          </button>

          <button
            onClick={() => setActiveTab('loyalty')}
            className={`px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'loyalty'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            Fidelização
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'notes'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-rose-800" />
            Notas & Alertas
          </button>
        </div>

        {/* Active Tab Panel */}
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
              showToast('Checkout Caixa', 'Direcionando para o terminal.', 'info')
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
