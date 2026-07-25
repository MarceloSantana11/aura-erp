import React, { useState } from 'react';
import {
  Appointment,
  Client,
  ProfessionalCommission,
  ServiceItem,
  Professional,
  Package,
  WaitlistItem,
  Room,
} from '../types';
import { PageHeader } from './ui/PageHeader';
import { EmptyState } from './ui/EmptyState';
import { Button } from './ui/Button';
import {
  UserCheck,
  Users,
  Sparkles,
  Clock,
  Phone,
  Mail,
  Plus,
  Gift,
  Building2,
  Crown,
  ChevronRight,
} from 'lucide-react';
import { ProfessionalModal } from './modals/ProfessionalModal';
import { ClientModal } from './modals/ClientModal';
import { ServiceModal } from './modals/ServiceModal';
import { PackageModal } from './modals/PackageModal';
import { WaitlistModal } from './modals/WaitlistModal';
import { ResourceModal } from './modals/ResourceModal';
import { CommissionRuleModal } from './modals/CommissionRuleModal';
import { useTranslation } from '../i18n/I18nContext';
import { useOperational } from '../context/OperationalContext';

interface SecondaryViewsProps {
  tab: string;
  appointments: Appointment[];
  clients: Client[];
  commissions: ProfessionalCommission[];
  onNewAppointment: () => void;
  onInspectClient?: (client: Client) => void;
  onAddClient?: (client: Omit<Client, 'id'>) => void;
}

export const SecondaryViews: React.FC<SecondaryViewsProps> = ({
  tab,
  onNewAppointment,
  onInspectClient,
}) => {
  const { t } = useTranslation();
  const {
    clients,
    professionals,
    services,
    packages,
    waitlist,
    rooms,
    commissions,
    addClient,
    addProfessional,
    addService,
    addPackage,
    addWaitlistItem,
    addResource,
    addCommissionRule,
  } = useOperational();

  // Modals state
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);

  // Search/Filter state
  const [searchTerm, setSearchTerm] = useState('');

  // Professionals View
  if (tab === 'professionals') {
    const filteredPros = professionals.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <PageHeader
          title={t('tab.professionals', 'Profissionais & Corpo Técnico')}
          description={t(
            'professionals.sub',
            'Gestão de membros da equipa, funções, comissões base e especialidades operacionais'
          )}
          primaryAction={{
            label: t('action.addProfessional', 'Adicionar Profissional'),
            icon: Plus,
            onClick: () => setIsProModalOpen(true),
          }}
        >
          <input
            type="text"
            placeholder={t('common.search', 'Pesquisar por nome ou função...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-xs bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-rose-800"
          />
        </PageHeader>

        {filteredPros.length === 0 ? (
          <EmptyState
            icon={UserCheck}
            title={t('empty.professionals.title', 'Nenhum profissional encontrado')}
            description={t(
              'empty.professionals.desc',
              'Adicione os membros da equipa para distribuir agendamentos, configurar horários e calcular comissões.'
            )}
            primaryAction={{
              label: t('action.addProfessional', 'Adicionar Profissional'),
              icon: Plus,
              onClick: () => setIsProModalOpen(true),
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredPros.map((pro) => (
              <div
                key={pro.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4 text-center hover:border-rose-300 transition-all"
              >
                <img
                  src={
                    pro.avatar ||
                    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150'
                  }
                  alt={pro.name}
                  className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-rose-200 shadow-xs"
                />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{pro.name}</h3>
                  <p className="text-xs text-rose-800 font-semibold mt-0.5">{pro.role}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{pro.phone}</p>
                </div>

                <div className="flex flex-wrap gap-1 justify-center min-h-[32px]">
                  {pro.specialties?.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Comissão Base</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-900 font-bold">
                    {pro.commissionRate}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <ProfessionalModal
          isOpen={isProModalOpen}
          onClose={() => setIsProModalOpen(false)}
          onAddProfessional={(newPro) => {
            addProfessional({ ...newPro, id: `pro-${Date.now()}` });
          }}
        />
      </div>
    );
  }

  // Clients CRM View
  if (tab === 'clients') {
    const filteredClients = clients.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <PageHeader
          title={t('tab.clients', 'Clientes & CRM Unificado')}
          description={t(
            'clients.sub',
            'Fichas de clientes, histórico de visitas, faturamento acumulado e preferências em Lisboa'
          )}
          primaryAction={{
            label: t('action.addClient', 'Adicionar Cliente'),
            icon: Plus,
            onClick: () => setIsClientModalOpen(true),
          }}
        >
          <input
            type="text"
            placeholder={t('common.search', 'Pesquisar cliente por nome, telefone ou email...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-rose-800"
          />
        </PageHeader>

        {filteredClients.length === 0 ? (
          <EmptyState
            icon={Users}
            title={t('empty.clients.title', 'Nenhum cliente encontrado')}
            description={t(
              'empty.clients.desc',
              'Registe novos clientes para manter o histórico de fichas de atendimento e fidelização.'
            )}
            primaryAction={{
              label: t('action.addClient', 'Adicionar Cliente'),
              icon: Plus,
              onClick: () => setIsClientModalOpen(true),
            }}
          />
        ) : (
          <div className="space-y-3">
            {filteredClients.map((cli) => (
              <div
                key={cli.id}
                onClick={() => onInspectClient && onInspectClient(cli)}
                className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-rose-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer touch-target"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={
                      cli.avatar ||
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
                    }
                    alt={cli.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm text-slate-900">{cli.name}</h4>
                      <span className="px-2.5 py-0.5 bg-rose-100 text-rose-900 font-bold text-[10px] rounded-full">
                        {cli.vipLevel || 'Standard'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-rose-800" /> {cli.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-rose-800" /> {cli.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <p className="text-sm font-extrabold text-slate-900">
                      Total: {cli.totalSpent}€
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Última visita: {cli.lastVisit}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
                </div>
              </div>
            ))}
          </div>
        )}

        <ClientModal
          isOpen={isClientModalOpen}
          onClose={() => setIsClientModalOpen(false)}
          onAddClient={(newCli) => {
            addClient(newCli);
          }}
        />
      </div>
    );
  }

  // Services View
  if (tab === 'services') {
    return (
      <div className="space-y-6">
        <PageHeader
          title={t('tab.services', 'Catálogo de Serviços & Tabela Oficial')}
          description={t(
            'services.sub',
            'Tabela de preços em Euro (€), tempos de execução e taxas de IVA aplicáveis'
          )}
          primaryAction={{
            label: t('action.addService', 'Adicionar Serviço'),
            icon: Plus,
            onClick: () => setIsServiceModalOpen(true),
          }}
        />

        {services.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title={t('empty.services.title', 'Nenhum serviço registado')}
            description={t(
              'empty.services.desc',
              'Adicione tratamentos e serviços ao catálogo para agendar e faturar.'
            )}
            primaryAction={{
              label: t('action.addService', 'Adicionar Serviço'),
              icon: Plus,
              onClick: () => setIsServiceModalOpen(true),
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 hover:border-rose-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 text-[10px] font-bold">
                      {srv.category}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      {srv.durationMinutes} min
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{srv.name}</h3>
                  {srv.description && (
                    <p className="text-xs text-slate-500 line-clamp-2">{srv.description}</p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    IVA {srv.vatRate}% Incl.
                  </span>
                  <span className="font-extrabold text-slate-900 text-base">{srv.price}€</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <ServiceModal
          isOpen={isServiceModalOpen}
          onClose={() => setIsServiceModalOpen(false)}
          onAddService={(srv) => {
            addService(srv);
          }}
        />
      </div>
    );
  }

  // Packages View
  if (tab === 'packages') {
    return (
      <div className="space-y-6">
        <PageHeader
          title={t('tab.packages', 'Pacotes de Tratamento & Vales-Presente')}
          description={t(
            'packages.sub',
            'Gestão de pacotes de sessões acumuladas, vales-presente e vouchers em Euro (€)'
          )}
          primaryAction={{
            label: t('action.addPackage', 'Criar Pacote'),
            icon: Plus,
            onClick: () => setIsPackageModalOpen(true),
          }}
        />

        {packages.length === 0 ? (
          <EmptyState
            icon={Gift}
            title={t('empty.packages.title', 'Nenhum pacote criado')}
            description={t(
              'empty.packages.desc',
              'Crie pacotes de sessões com desconto para fidelizar os seus clientes.'
            )}
            primaryAction={{
              label: t('action.addPackage', 'Criar Pacote'),
              icon: Plus,
              onClick: () => setIsPackageModalOpen(true),
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                    {pkg.status}
                  </span>
                  <span className="text-base font-extrabold text-slate-900">{pkg.totalPrice}€</span>
                </div>
                <h3 className="font-bold text-sm text-slate-900">{pkg.name}</h3>
                <p className="text-xs text-slate-600">
                  Cliente:{' '}
                  <strong className="text-slate-800">{pkg.clientName}</strong>
                </p>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-800 h-full rounded-full"
                    style={{
                      width: `${(pkg.usedSessions / pkg.totalSessions) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 text-right">
                  {pkg.usedSessions} de {pkg.totalSessions} sessões concluídas • Válido até{' '}
                  {pkg.expirationDate}
                </p>
              </div>
            ))}
          </div>
        )}

        <PackageModal
          isOpen={isPackageModalOpen}
          onClose={() => setIsPackageModalOpen(false)}
          onAddPackage={(pkg) => {
            addPackage(pkg);
          }}
        />
      </div>
    );
  }

  // Waitlist View
  if (tab === 'waitlist') {
    return (
      <div className="space-y-6">
        <PageHeader
          title={t('tab.waitlist', 'Lista de Espera Operacional')}
          description={t(
            'waitlist.sub',
            'Clientes a aguardar desistências ou vagas prioritárias na agenda de Lisboa'
          )}
          primaryAction={{
            label: t('action.addWaitlist', 'Adicionar à Lista de Espera'),
            icon: Plus,
            onClick: () => setIsWaitlistModalOpen(true),
          }}
        />

        {waitlist.length === 0 ? (
          <EmptyState
            icon={Clock}
            title={t('empty.waitlist.title', 'Nenhum cliente na lista de espera')}
            description={t(
              'empty.waitlist.desc',
              'Registe clientes aguardando vaga para os encaixar em cancelamentos.'
            )}
            primaryAction={{
              label: t('action.addWaitlist', 'Adicionar à Lista de Espera'),
              icon: Plus,
              onClick: () => setIsWaitlistModalOpen(true),
            }}
          />
        ) : (
          <div className="space-y-3">
            {waitlist.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900">{item.clientName}</h4>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                        item.priority === 'Alta'
                          ? 'bg-red-100 text-red-900'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      Prioridade {item.priority}
                    </span>
                  </div>
                  <p className="text-xs text-rose-800 font-semibold">{item.serviceName}</p>
                  <p className="text-xs text-slate-500">
                    Preferência: {item.preferredTimeWindow} • {item.preferredProfessional}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                  <Button variant="primary" size="sm" onClick={onNewAppointment}>
                    Agendar Agora
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <WaitlistModal
          isOpen={isWaitlistModalOpen}
          onClose={() => setIsWaitlistModalOpen(false)}
          onAddWaitlist={(item) => {
            addWaitlistItem(item);
          }}
        />
      </div>
    );
  }

  // Rooms & Resources View
  if (tab === 'rooms') {
    return (
      <div className="space-y-6">
        <PageHeader
          title={t('tab.rooms', 'Salas, Cabines & Recursos')}
          description={t(
            'rooms.sub',
            'Alocação de cabines VIP, macas de estética e bancadas de trabalho'
          )}
          primaryAction={{
            label: t('action.addResource', 'Adicionar Recurso'),
            icon: Plus,
            onClick: () => setIsResourceModalOpen(true),
          }}
        />

        {rooms.length === 0 ? (
          <EmptyState
            icon={Building2}
            title={t('empty.rooms.title', 'Nenhum recurso configurado')}
            description={t(
              'empty.rooms.desc',
              'Cadastre cabines e salas para controlar a ocupação e evitar conflitos.'
            )}
            primaryAction={{
              label: t('action.addResource', 'Adicionar Recurso'),
              icon: Plus,
              onClick: () => setIsResourceModalOpen(true),
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 text-[10px] font-bold">
                    {room.type}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      room.status === 'Disponível'
                        ? 'bg-emerald-100 text-emerald-900'
                        : room.status === 'Ocupada'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {room.status}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900">{room.name}</h3>
                {room.currentOccupant && (
                  <p className="text-xs text-slate-600">
                    Ocupante Atual: <strong className="text-slate-800">{room.currentOccupant}</strong>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <ResourceModal
          isOpen={isResourceModalOpen}
          onClose={() => setIsResourceModalOpen(false)}
          onAddResource={(res) => {
            addResource(res);
          }}
        />
      </div>
    );
  }

  // Commissions Rules View
  if (tab === 'commissions') {
    return (
      <div className="space-y-6">
        <PageHeader
          title={t('tab.commissions', 'Comissões & Regras de Repasse')}
          description={t(
            'commissions.sub',
            'Cálculo e repasse automático de comissões por procedimento e venda de produtos'
          )}
          primaryAction={{
            label: t('action.addCommissionRule', 'Criar Regra de Comissão'),
            icon: Plus,
            onClick: () => setIsCommissionModalOpen(true),
          }}
        />

        {commissions.length === 0 ? (
          <EmptyState
            icon={Crown}
            title={t('empty.commissions.title', 'Nenhuma regra de comissão criada')}
            description={t(
              'empty.commissions.desc',
              'Configure percentagens por profissional para automatizar o fecho de comissões.'
            )}
            primaryAction={{
              label: t('action.addCommissionRule', 'Criar Regra de Comissão'),
              icon: Plus,
              onClick: () => setIsCommissionModalOpen(true),
            }}
          />
        ) : (
          <div className="space-y-3">
            {commissions.map((comm) => (
              <div
                key={comm.id}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900">{comm.name}</h4>
                    <span className="text-xs font-semibold text-rose-800">({comm.role})</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Procedimento: {comm.procedure} • Total Gerado: {comm.totalValue}€
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-extrabold text-rose-900">
                    Comissão ({comm.commissionPercent}%): {comm.commissionValue}€
                  </p>
                  <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-900 font-bold text-[10px] rounded-full mt-0.5">
                    {comm.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <CommissionRuleModal
          isOpen={isCommissionModalOpen}
          onClose={() => setIsCommissionModalOpen(false)}
          onAddRule={(rule) => {
            addCommissionRule(rule);
          }}
        />
      </div>
    );
  }

  // Default fallback
  return (
    <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl space-y-2">
      <Building2 className="w-8 h-8 text-rose-800 mx-auto" />
      <h3 className="font-extrabold text-slate-900 text-sm uppercase">Módulo Operacional Ativo</h3>
      <p className="text-xs text-slate-500">
        Utilize a barra de navegação para alternar entre o Dashboard, Agenda, Clientes, Caixa e
        Definições.
      </p>
    </div>
  );
};
