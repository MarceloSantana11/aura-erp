import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Appointment,
  AppointmentStatus,
  Client,
  Transaction,
  ProfessionalCommission,
  Product,
  StockMovement,
  MarketingCampaign,
  Coupon,
  WaitlistItem,
  ServiceItem,
  Professional,
  Room,
  Package,
  CashRegisterState,
  CashMovement,
  LoyaltyTier,
  ClientTierAssignment,
  BusinessSchedule,
  ScheduleException,
  ActivityLogItem,
} from '../types';
import {
  initialAppointments,
  initialClients,
  initialTransactions,
  initialCommissions,
  initialProducts,
  initialMovements,
  initialMarketingCampaigns,
  initialCoupons,
  initialWaitlist,
  initialServices,
  initialProfessionals,
  initialRooms,
  initialPackages,
  initialCashRegister,
  initialLoyaltyTiers,
  initialBusinessSchedule,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

export interface CheckoutPaymentInput {
  method: 'Multibanco' | 'MB WAY' | 'Dinheiro' | 'Cartão de Crédito' | 'Transferência' | 'Vale-presente' | 'Crédito';
  amount: number;
}

export interface CheckoutSaleInput {
  appointmentId?: string;
  clientId: string;
  clientName: string;
  services: ServiceItem[];
  productsSold?: { product: Product; quantity: number }[];
  subtotal: number;
  discount: number;
  tip: number;
  total: number;
  payments: CheckoutPaymentInput[];
}

interface OperationalContextType {
  // State
  appointments: Appointment[];
  clients: Client[];
  transactions: Transaction[];
  commissions: ProfessionalCommission[];
  products: Product[];
  movements: StockMovement[];
  campaigns: MarketingCampaign[];
  coupons: Coupon[];
  waitlist: WaitlistItem[];
  services: ServiceItem[];
  professionals: Professional[];
  rooms: Room[];
  packages: Package[];
  cashRegister: CashRegisterState;
  loyaltyTiers: LoyaltyTier[];
  tierAssignments: ClientTierAssignment[];
  businessSchedule: BusinessSchedule;
  activityLogs: ActivityLogItem[];
  toasts: ToastMessage[];

  // Actions
  showToast: (title: string, message?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  logActivity: (log: Omit<ActivityLogItem, 'id' | 'createdAt' | 'userId' | 'userName'>) => void;

  // Clients
  addClient: (client: Omit<Client, 'id'>) => { success: boolean; client?: Client; isDuplicate?: boolean };
  updateClient: (id: string, partial: Partial<Client>) => void;
  calculateClientTier: (client: Client) => LoyaltyTier;
  assignClientTierManual: (
    clientId: string,
    tierId: string,
    reason?: string,
    overrideType?: 'permanent' | 'until_date' | 'until_recalc',
    overrideUntilDate?: string
  ) => void;
  removeClientTierOverride: (clientId: string) => void;
  recalculateAllClientTiers: () => void;

  // Tiers Management
  addLoyaltyTier: (tier: Omit<LoyaltyTier, 'id'>) => void;
  updateLoyaltyTier: (id: string, partial: Partial<LoyaltyTier>) => void;
  reorderLoyaltyTiers: (tiers: LoyaltyTier[]) => void;
  archiveLoyaltyTierWithFallback: (tierId: string, fallbackTierId?: string) => void;

  // Appointments & Edits
  addAppointment: (app: Omit<Appointment, 'id'>) => { success: boolean; appointment?: Appointment; error?: string };
  updateAppointmentStatus: (id: string, newStatus: AppointmentStatus) => { success: boolean; message?: string };
  updateAppointmentServices: (id: string, services: ServiceItem[], additionalNotes?: string) => void;
  updateAppointmentDetails: (id: string, partial: Partial<Appointment>) => void;

  // Entity Edits
  updateProfessional: (id: string, partial: Partial<Professional>) => void;
  updateService: (id: string, partial: Partial<ServiceItem>) => void;
  updatePackage: (id: string, partial: Partial<Package>) => void;
  updateCommissionRule: (id: string, partial: Partial<ProfessionalCommission>) => void;
  archiveEntity: (entityType: ActivityLogItem['entityType'], entityId: string, reason?: string) => void;

  // Business Schedule
  updateBusinessSchedule: (schedule: BusinessSchedule) => void;
  addScheduleException: (exception: Omit<ScheduleException, 'id'>) => void;
  updateScheduleException: (id: string, partial: Partial<ScheduleException>) => void;
  deleteScheduleException: (id: string) => void;

  // Checkout & Transactions
  processCheckout: (input: CheckoutSaleInput) => boolean;
  addTransaction: (tx: Transaction) => void;

  // Cash Register
  registerCashMovement: (type: 'Sangria' | 'Reforço' | 'Entrada' | 'Saída', amount: number, description: string) => void;
  toggleCashRegister: (isOpen: boolean, initialAmount?: number) => void;

  // Services, Pros, Packages, Rooms
  addService: (srv: ServiceItem) => void;
  addProfessional: (pro: Professional) => void;
  addPackage: (pkg: Package) => void;
  addResource: (room: Room) => void;
  addWaitlistItem: (item: WaitlistItem) => void;
  removeWaitlistItem: (id: string) => void;
  addCommissionRule: (rule: any) => void;

  // Stock
  addProduct: (prod: Omit<Product, 'id'>) => void;
  adjustStock: (productId: string, delta: number) => void;

  // Marketing
  toggleCampaignStatus: (id: string) => void;
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;

  // System
  resetDemoData: () => void;
}

const STORAGE_KEY = 'futuro_aura_erp_v1';

const OperationalContext = createContext<OperationalContextType | undefined>(undefined);

// State Machine Transition Rules
export const VALID_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  'Por confirmar': ['Confirmado', 'Cancelado'],
  'Confirmado': ['Cliente chegou', 'Em atendimento', 'Não compareceu', 'Cancelado', 'Por confirmar'],
  'Cliente chegou': ['Em atendimento', 'Cancelado'],
  'Em atendimento': ['Concluído', 'Cancelado'],
  'Concluído': [], // Terminal or Checkout
  'Não compareceu': ['Por confirmar', 'Confirmado'],
  'Cancelado': ['Por confirmar', 'Confirmado'],
};

export function isValidTransition(current: AppointmentStatus, target: AppointmentStatus): boolean {
  if (current === target) return true;
  return VALID_TRANSITIONS[current]?.includes(target) ?? false;
}

export const OperationalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or fallback
  const loadInitialState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          appointments: parsed.appointments || initialAppointments,
          clients: parsed.clients || initialClients,
          transactions: parsed.transactions || initialTransactions,
          commissions: parsed.commissions || initialCommissions,
          products: parsed.products || initialProducts,
          movements: parsed.movements || initialMovements,
          campaigns: parsed.campaigns || initialMarketingCampaigns,
          coupons: parsed.coupons || initialCoupons,
          waitlist: parsed.waitlist || initialWaitlist,
          services: parsed.services || initialServices,
          professionals: parsed.professionals || initialProfessionals,
          rooms: parsed.rooms || initialRooms,
          packages: parsed.packages || initialPackages,
          cashRegister: parsed.cashRegister || initialCashRegister,
          loyaltyTiers: parsed.loyaltyTiers || initialLoyaltyTiers,
          tierAssignments: parsed.tierAssignments || [],
          businessSchedule: parsed.businessSchedule || initialBusinessSchedule,
          activityLogs: parsed.activityLogs || [],
        };
      }
    } catch (e) {
      console.warn('Could not load operational state from localStorage:', e);
    }
    return {
      appointments: initialAppointments,
      clients: initialClients,
      transactions: initialTransactions,
      commissions: initialCommissions,
      products: initialProducts,
      movements: initialMovements,
      campaigns: initialMarketingCampaigns,
      coupons: initialCoupons,
      waitlist: initialWaitlist,
      services: initialServices,
      professionals: initialProfessionals,
      rooms: initialRooms,
      packages: initialPackages,
      cashRegister: initialCashRegister,
      loyaltyTiers: initialLoyaltyTiers,
      tierAssignments: [],
      businessSchedule: initialBusinessSchedule,
      activityLogs: [],
    };
  };

  const initialState = loadInitialState();

  const [appointments, setAppointments] = useState<Appointment[]>(initialState.appointments);
  const [clients, setClients] = useState<Client[]>(initialState.clients);
  const [transactions, setTransactions] = useState<Transaction[]>(initialState.transactions);
  const [commissions, setCommissions] = useState<ProfessionalCommission[]>(initialState.commissions);
  const [products, setProducts] = useState<Product[]>(initialState.products);
  const [movements, setMovements] = useState<StockMovement[]>(initialState.movements);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(initialState.campaigns);
  const [coupons, setCoupons] = useState<Coupon[]>(initialState.coupons);
  const [waitlist, setWaitlist] = useState<WaitlistItem[]>(initialState.waitlist);
  const [services, setServices] = useState<ServiceItem[]>(initialState.services);
  const [professionals, setProfessionals] = useState<Professional[]>(initialState.professionals);
  const [rooms, setRooms] = useState<Room[]>(initialState.rooms);
  const [packages, setPackages] = useState<Package[]>(initialState.packages);
  const [cashRegister, setCashRegister] = useState<CashRegisterState>(initialState.cashRegister);
  const [loyaltyTiers, setLoyaltyTiers] = useState<LoyaltyTier[]>(initialState.loyaltyTiers);
  const [tierAssignments, setTierAssignments] = useState<ClientTierAssignment[]>(initialState.tierAssignments);
  const [businessSchedule, setBusinessSchedule] = useState<BusinessSchedule>(initialState.businessSchedule);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(initialState.activityLogs);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist changes to localStorage
  useEffect(() => {
    try {
      const stateToSave = {
        appointments,
        clients,
        transactions,
        commissions,
        products,
        movements,
        campaigns,
        coupons,
        waitlist,
        services,
        professionals,
        rooms,
        packages,
        cashRegister,
        loyaltyTiers,
        tierAssignments,
        businessSchedule,
        activityLogs,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed saving operational state:', e);
    }
  }, [
    appointments,
    clients,
    transactions,
    commissions,
    products,
    movements,
    campaigns,
    coupons,
    waitlist,
    services,
    professionals,
    rooms,
    packages,
    cashRegister,
    loyaltyTiers,
    tierAssignments,
    businessSchedule,
    activityLogs,
  ]);

  const showToast = (title: string, message?: string, type: ToastMessage['type'] = 'success') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      title,
      message,
      type,
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logActivity = (logInput: Omit<ActivityLogItem, 'id' | 'createdAt' | 'userId' | 'userName'>) => {
    const newLog: ActivityLogItem = {
      ...logInput,
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toLocaleString('pt-PT'),
      userId: 'usr-admin',
      userName: 'Gerente / Gestor Aura',
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // CLIENT MANAGEMENT
  const addClient = (clientInput: Omit<Client, 'id'>) => {
    // Check duplicate phone or email
    const existing = clients.find(
      (c) =>
        (c.phone && c.phone.replace(/\s+/g, '') === clientInput.phone.replace(/\s+/g, '')) ||
        (c.email && clientInput.email && c.email.toLowerCase() === clientInput.email.toLowerCase())
    );

    if (existing) {
      showToast(
        'Cliente já Registado',
        `Já existe um cliente (${existing.name}) com este contacto.`,
        'warning'
      );
      return { success: false, client: existing, isDuplicate: true };
    }

    const created: Client = {
      ...clientInput,
      id: `cli-${Date.now()}`,
    };

    setClients((prev) => [created, ...prev]);
    showToast('Cliente Criado', `${created.name} registado com sucesso no CRM.`, 'success');
    return { success: true, client: created, isDuplicate: false };
  };

  const updateClient = (id: string, partial: Partial<Client>) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...partial } : c)));
  };

  // APPOINTMENT MANAGEMENT
  const addAppointment = (appInput: Omit<Appointment, 'id'>) => {
    const created: Appointment = {
      ...appInput,
      id: `app-${Date.now()}`,
    };

    // Update appointment list
    setAppointments((prev) => [created, ...prev]);

    // Check if client exists or create/update client record
    const foundClient = clients.find(
      (c) => c.name.toLowerCase() === appInput.clientName.toLowerCase()
    );

    if (foundClient) {
      updateClient(foundClient.id, {
        nextVisit: `${appInput.date} às ${appInput.time}`,
      });
    }

    // Register pending transaction in financial pipeline
    const pendingTx: Transaction = {
      id: `tx-${Date.now()}`,
      clientName: appInput.clientName,
      procedure: appInput.procedure,
      status: 'Pendente',
      time: `Hoje, ${appInput.time}`,
      value: appInput.value,
      paymentMethod: 'Multibanco',
      category: 'Atendimento',
    };
    setTransactions((prev) => [pendingTx, ...prev]);

    showToast(
      'Agendamento Criado',
      `Agendado ${appInput.procedure} para ${appInput.clientName} às ${appInput.time}.`,
      'success'
    );

    return { success: true, appointment: created };
  };

  const updateAppointmentStatus = (id: string, newStatus: AppointmentStatus) => {
    const app = appointments.find((a) => a.id === id);
    if (!app) return { success: false, message: 'Agendamento não encontrado' };

    if (!isValidTransition(app.status, newStatus)) {
      showToast(
        'Transição Inválida',
        `Não é permitido passar de "${app.status}" para "${newStatus}".`,
        'warning'
      );
      return { success: false, message: 'Transição de estado inválida' };
    }

    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const updated = { ...a, status: newStatus };
          if (newStatus === 'Cliente chegou') {
            // Free room or assign default room if available
          }
          return updated;
        }
        return a;
      })
    );

    // If "Cliente chegou", show reception feedback
    if (newStatus === 'Cliente chegou') {
      showToast('Cliente na Receção', `${app.clientName} chegou para ${app.procedure}.`, 'info');
    } else if (newStatus === 'Em atendimento') {
      showToast('Atendimento Iniciado', `${app.clientName} está em atendimento com ${app.professional}.`, 'info');
    } else if (newStatus === 'Concluído') {
      showToast('Atendimento Concluído', `Pronto para checkout / pagamento (${app.value}€).`, 'success');
    } else if (newStatus === 'Cancelado') {
      showToast('Agendamento Cancelado', `Agendamento de ${app.clientName} foi cancelado.`, 'warning');
    }

    return { success: true };
  };

  const updateAppointmentServices = (id: string, newServices: ServiceItem[], additionalNotes?: string) => {
    const totalVal = newServices.reduce((acc, s) => acc + s.price, 0);
    const primaryName = newServices.map((s) => s.name).join(' + ') || 'Serviços Diversos';
    const totalDuration = newServices.reduce((acc, s) => acc + s.durationMinutes, 0);

    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return {
            ...a,
            services: newServices,
            procedure: primaryName,
            value: totalVal,
            durationMinutes: totalDuration,
            notes: additionalNotes ? `${a.notes || ''} | ${additionalNotes}` : a.notes,
          };
        }
        return a;
      })
    );
    showToast('Serviços Atualizados', `Total recalculado para ${totalVal}€.`, 'info');
  };

  // CHECKOUT & PAYMENT PROCESSOR
  const processCheckout = (input: CheckoutSaleInput): boolean => {
    const { appointmentId, clientName, services: srvs, total, payments, tip } = input;

    // Create completed Transaction
    const primaryMethod = payments[0]?.method || 'Multibanco';

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      clientName: `${clientName} (${srvs.map((s) => s.name).join(', ')})`,
      procedure: srvs.map((s) => s.name).join(' + ') || 'Atendimento Completo',
      status: 'Concluído',
      time: `Hoje, ${new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`,
      value: total,
      paymentMethod: primaryMethod,
      category: 'Atendimento',
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Update appointment if linked
    if (appointmentId) {
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointmentId ? { ...a, status: 'Concluído', paymentStatus: 'Pago' } : a
        )
      );
    }

    // Update Cash Register
    payments.forEach((p) => {
      if (p.method === 'Dinheiro') {
        setCashRegister((prev) => ({
          ...prev,
          currentCash: prev.currentCash + p.amount,
        }));
      } else if (p.method === 'Multibanco') {
        setCashRegister((prev) => ({
          ...prev,
          currentMultibanco: prev.currentMultibanco + p.amount,
        }));
      } else if (p.method === 'MB WAY') {
        setCashRegister((prev) => ({
          ...prev,
          currentMbWay: prev.currentMbWay + p.amount,
        }));
      } else if (p.method === 'Cartão de Crédito') {
        setCashRegister((prev) => ({
          ...prev,
          currentCard: prev.currentCard + p.amount,
        }));
      }

      setCashRegister((prev) => ({
        ...prev,
        movements: [
          {
            id: `cm-${Date.now()}-${Math.random()}`,
            type: 'Entrada',
            description: `Pagamento Venda (${p.method}) - ${clientName}`,
            amount: p.amount,
            time: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
            responsible: 'Receção / Terminal',
          },
          ...prev.movements,
        ],
      }));
    });

    // Calculate Commissions for professionals
    if (appointmentId) {
      const app = appointments.find((a) => a.id === appointmentId);
      if (app) {
        const pro = professionals.find(
          (p) => p.name.toLowerCase() === app.professional.toLowerCase()
        ) || professionals[0];

        const rate = pro ? pro.commissionRate : 35;
        const commValue = Number(((total * rate) / 100).toFixed(2));

        const newCommission: ProfessionalCommission = {
          id: `com-${Date.now()}`,
          name: app.professional,
          role: pro ? pro.role : 'Profissional',
          procedure: app.procedure,
          totalValue: total,
          commissionPercent: rate,
          commissionValue: commValue,
          status: 'Processando',
          avatar: app.professionalAvatar || pro?.avatar,
        };

        setCommissions((prev) => [newCommission, ...prev]);
      }
    }

    // Update Client history
    const matchedClient = clients.find(
      (c) => c.name.toLowerCase() === clientName.toLowerCase()
    );
    if (matchedClient) {
      updateClient(matchedClient.id, {
        totalSpent: matchedClient.totalSpent + total,
        lastVisit: 'Hoje',
        loyaltyPoints: (matchedClient.loyaltyPoints || 0) + Math.floor(total),
      });
    }

    // Reduce stock for products sold
    if (input.productsSold) {
      input.productsSold.forEach(({ product, quantity }) => {
        adjustStock(product.id, -quantity);
      });
    }

    showToast('Pagamento Concluído', `Recebido ${total}€ via ${primaryMethod}.`, 'success');
    return true;
  };

  const addTransaction = (tx: Transaction) => {
    setTransactions((prev) => [tx, ...prev]);
  };

  // CASH REGISTER
  const registerCashMovement = (
    type: 'Sangria' | 'Reforço' | 'Entrada' | 'Saída',
    amount: number,
    description: string
  ) => {
    if (amount <= 0) return;

    setCashRegister((prev) => {
      let cashDelta = 0;
      if (type === 'Reforço' || type === 'Entrada') cashDelta = amount;
      if (type === 'Sangria' || type === 'Saída') cashDelta = -amount;

      return {
        ...prev,
        currentCash: Math.max(0, prev.currentCash + cashDelta),
        movements: [
          {
            id: `cm-${Date.now()}`,
            type: type === 'Sangria' ? 'Sangria' : type === 'Reforço' ? 'Reforço' : 'Entrada',
            description: description || `${type} de caixa`,
            amount,
            time: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
            responsible: 'Operador de Caixa',
          },
          ...prev.movements,
        ],
      };
    });

    showToast('Movimento Registado', `${type} de ${amount}€ registada no Caixa.`, 'info');
  };

  const toggleCashRegister = (isOpen: boolean, initialAmount = 150) => {
    setCashRegister((prev) => ({
      ...prev,
      isOpen,
      openedAt: isOpen ? new Date().toLocaleString('pt-PT') : undefined,
      initialAmount: isOpen ? initialAmount : prev.initialAmount,
      currentCash: isOpen ? initialAmount : prev.currentCash,
    }));
    showToast('Caixa Operacional', isOpen ? 'Caixa Aberto.' : 'Caixa Fechado.', 'info');
  };

  // SERVICES, PROS, PACKAGES, ROOMS
  const addService = (srv: ServiceItem) => {
    setServices((prev) => [srv, ...prev]);
    showToast('Serviço Criado', `${srv.name} (${srv.price}€) adicionado à tabela.`, 'success');
  };

  const addProfessional = (pro: Professional) => {
    setProfessionals((prev) => [pro, ...prev]);
    showToast('Profissional Registado', `${pro.name} adicionado à equipa.`, 'success');
  };

  const addPackage = (pkg: Package) => {
    setPackages((prev) => [pkg, ...prev]);
    showToast('Pacote Criado', `${pkg.name} ativo.`, 'success');
  };

  const addResource = (room: Room) => {
    setRooms((prev) => [room, ...prev]);
    showToast('Recurso Adicionado', `${room.name} (${room.type}).`, 'success');
  };

  const addWaitlistItem = (item: WaitlistItem) => {
    setWaitlist((prev) => [item, ...prev]);
    showToast('Lista de Espera', `${item.clientName} adicionado à lista.`, 'info');
  };

  const removeWaitlistItem = (id: string) => {
    setWaitlist((prev) => prev.filter((i) => i.id !== id));
  };

  const addCommissionRule = (rule: any) => {
    showToast('Regra de Comissão', `Regra para ${rule.role || 'Geral'} criada.`, 'info');
  };

  // STOCK
  const addProduct = (prodInput: Omit<Product, 'id'>) => {
    const created: Product = { ...prodInput, id: `prod-${Date.now()}` };
    setProducts((prev) => [created, ...prev]);

    setMovements((prev) => [
      {
        id: `mov-${Date.now()}`,
        type: 'Entrada',
        productName: `Entrada - ${created.name}`,
        quantity: created.stock,
        date: 'Hoje',
        notes: `Fornecedor: ${created.supplier}`,
      },
      ...prev,
    ]);

    showToast('Produto Adicionado', `${created.name} adicionado ao estoque.`, 'success');
  };

  const adjustStock = (productId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newStock = Math.max(0, p.stock + delta);
          let newStatus: Product['status'] = 'Normal';
          if (newStock === 0) newStatus = 'Estoque Baixo';
          else if (newStock <= p.minStock) newStatus = 'Crítico';
          else if (newStock > p.minStock * 3) newStatus = 'Abundante';

          return { ...p, stock: newStock, status: newStatus };
        }
        return p;
      })
    );
  };

  // MARKETING
  const toggleCampaignStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === 'Ativo' ? 'Pausado' : 'Ativo' } : c))
    );
  };

  const addCoupon = (cInput: Omit<Coupon, 'id'>) => {
    const created = { ...cInput, id: `coup-${Date.now()}` };
    setCoupons((prev) => [created, ...prev]);
    showToast('Cupão Criado', `Cupão ${created.code} gerado.`, 'success');
  };

  // TIER CALCULATION & MANAGEMENT
  const calculateClientTier = (client: Client): LoyaltyTier => {
    const clientApps = appointments.filter(
      (a) =>
        a.clientName.toLowerCase().includes(client.name.toLowerCase()) ||
        client.name.toLowerCase().includes(a.clientName.toLowerCase())
    );
    const completedApps = clientApps.filter((a) => a.status === 'Concluído');
    const visitCount = completedApps.length;
    const spendSum = client.totalSpent || 0;

    const activeTiers = [...loyaltyTiers]
      .filter((t) => t.status !== 'Inativo' && t.status !== 'Arquivado')
      .sort((a, b) => b.order - a.order);

    // If zero visits and zero spend, return tier 0 (Cliente novo)
    if (visitCount === 0 && spendSum === 0) {
      const newClientTier = activeTiers.find((t) => t.name === 'Cliente novo' || t.order === 1);
      if (newClientTier) return newClientTier;
    }

    // Otherwise find highest matching tier
    for (const tier of activeTiers) {
      if (tier.name === 'Cliente novo') continue;
      const minS = tier.minSpend || 0;
      const minV = tier.minVisits || 0;
      const mode = tier.combinationMode || 'spend_or_visits';

      let matches = false;
      if (mode === 'spend_and_visits') {
        matches = spendSum >= minS && visitCount >= minV;
      } else {
        matches = spendSum >= minS || visitCount >= minV;
      }

      if (matches) {
        return tier;
      }
    }

    return activeTiers[activeTiers.length - 1] || initialLoyaltyTiers[0];
  };

  const assignClientTierManual = (
    clientId: string,
    tierId: string,
    reason?: string,
    overrideType: 'permanent' | 'until_date' | 'until_recalc' = 'permanent',
    overrideUntilDate?: string
  ) => {
    const client = clients.find((c) => c.id === clientId);
    const tier = loyaltyTiers.find((t) => t.id === tierId);
    if (!client || !tier) return;

    const prevTierName = client.vipLevel || 'Nenhum';
    const autoTier = calculateClientTier(client);

    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? {
              ...c,
              vipLevel: tier.name,
              manualOverrideActive: true,
              overrideType,
              overrideUntilDate: overrideType === 'until_date' ? overrideUntilDate : undefined,
              recommendedTierName: autoTier.name,
            }
          : c
      )
    );

    const assignment: ClientTierAssignment = {
      id: `assign-${Date.now()}`,
      clientId,
      tierId,
      tierName: tier.name,
      source: 'manual',
      reason: reason || 'Atribuição manual pelo gestor',
      assignedAt: new Date().toLocaleDateString('pt-PT'),
      assignedBy: 'Gerente / Gestor',
      previousTierName: prevTierName,
      overrideType,
      overrideUntilDate,
    };

    setTierAssignments((prev) => [assignment, ...prev]);

    logActivity({
      entityType: 'client',
      entityId: clientId,
      action: 'Ajuste Manual',
      previousData: { vipLevel: prevTierName },
      newData: { vipLevel: tier.name, overrideType, overrideUntilDate },
      reason,
    });

    showToast('Nível do Cliente Atualizado', `${client.name} agora tem o nível manual "${tier.name}".`, 'success');
  };

  const removeClientTierOverride = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;

    const autoTier = calculateClientTier(client);
    const prevTierName = client.vipLevel || 'Nenhum';

    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? {
              ...c,
              vipLevel: autoTier.name,
              manualOverrideActive: false,
              overrideType: undefined,
              overrideUntilDate: undefined,
              recommendedTierName: autoTier.name,
            }
          : c
      )
    );

    const assignment: ClientTierAssignment = {
      id: `assign-${Date.now()}`,
      clientId,
      tierId: autoTier.id,
      tierName: autoTier.name,
      source: 'automatic',
      reason: 'Remoção de sobreposição manual e restauração de nível automático',
      assignedAt: new Date().toLocaleDateString('pt-PT'),
      assignedBy: 'Sistema Aura',
      previousTierName: prevTierName,
    };

    setTierAssignments((prev) => [assignment, ...prev]);

    logActivity({
      entityType: 'client',
      entityId: clientId,
      action: 'Restaurado Nível Automático',
      previousData: { vipLevel: prevTierName },
      newData: { vipLevel: autoTier.name },
      reason: 'Restauração solicitada pelo utilizador',
    });

    showToast('Nível Automático Restaurado', `${client.name} voltou ao nível calculado "${autoTier.name}".`, 'info');
  };

  const recalculateAllClientTiers = () => {
    setClients((prev) =>
      prev.map((c) => {
        const calculated = calculateClientTier(c);
        // If manual override until_recalc, end override now
        const isOverrideExpired = c.manualOverrideActive && c.overrideType === 'until_recalc';
        const finalTierName = c.manualOverrideActive && !isOverrideExpired ? c.vipLevel : calculated.name;

        if (finalTierName !== c.vipLevel) {
          logActivity({
            entityType: 'client',
            entityId: c.id,
            action: 'Promoção Nível',
            previousData: { vipLevel: c.vipLevel },
            newData: { vipLevel: finalTierName },
            reason: 'Recálculo automático de regras comercial/visitas',
          });
        }
        return {
          ...c,
          vipLevel: finalTierName,
          recommendedTierName: calculated.name,
          manualOverrideActive: isOverrideExpired ? false : c.manualOverrideActive,
          overrideType: isOverrideExpired ? undefined : c.overrideType,
        };
      })
    );
    showToast('Níveis Recalculados', 'Classificação de todos os clientes atualizada com sucesso.', 'info');
  };

  const addLoyaltyTier = (tierInput: Omit<LoyaltyTier, 'id'>) => {
    const newTier: LoyaltyTier = {
      ...tierInput,
      id: `tier-${Date.now()}`,
      status: tierInput.status || 'Ativo',
    };
    setLoyaltyTiers((prev) => [...prev, newTier].sort((a, b) => a.order - b.order));
    logActivity({
      entityType: 'tier',
      entityId: newTier.id,
      action: 'Criado',
      newData: newTier,
    });
    showToast('Nível Criado', `Novo nível "${newTier.name}" adicionado.`, 'success');
  };

  const updateLoyaltyTier = (id: string, partial: Partial<LoyaltyTier>) => {
    setLoyaltyTiers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...partial } : t)).sort((a, b) => a.order - b.order)
    );
    logActivity({
      entityType: 'tier',
      entityId: id,
      action: 'Editado',
      newData: partial,
    });
    showToast('Nível Atualizado', 'Configurações do nível guardadas.', 'success');
  };

  const archiveLoyaltyTierWithFallback = (tierId: string, fallbackTierId?: string) => {
    const tierToArchive = loyaltyTiers.find((t) => t.id === tierId);
    if (!tierToArchive) return;

    const fallbackTier = loyaltyTiers.find((t) => t.id === fallbackTierId) || loyaltyTiers.find((t) => t.name === 'Bronze') || loyaltyTiers[0];
    const affectedClients = clients.filter((c) => c.vipLevel === tierToArchive.name);

    if (affectedClients.length > 0 && fallbackTier) {
      setClients((prev) =>
        prev.map((c) => (c.vipLevel === tierToArchive.name ? { ...c, vipLevel: fallbackTier.name } : c))
      );
      showToast(
        'Nível Arquivado e Clientes Migrados',
        `${affectedClients.length} cliente(s) migrado(s) de "${tierToArchive.name}" para "${fallbackTier.name}".`,
        'info'
      );
    } else {
      showToast('Nível Arquivado', `Nível "${tierToArchive.name}" foi inativado.`, 'info');
    }

    setLoyaltyTiers((prev) =>
      prev.map((t) => (t.id === tierId ? { ...t, status: 'Inativo' } : t))
    );

    logActivity({
      entityType: 'tier',
      entityId: tierId,
      action: 'Arquivado',
      newData: { status: 'Inativo', fallbackTierName: fallbackTier?.name },
      reason: `Arquivado com migração de ${affectedClients.length} clientes para ${fallbackTier?.name}`,
    });
  };

  const reorderLoyaltyTiers = (orderedTiers: LoyaltyTier[]) => {
    const updated = orderedTiers.map((t, idx) => ({ ...t, order: idx + 1 }));
    setLoyaltyTiers(updated);
    showToast('Ordem Atualizada', 'Hierarquia de níveis guardada.', 'info');
  };

  // BUSINESS SCHEDULE
  const updateBusinessSchedule = (schedule: BusinessSchedule) => {
    setBusinessSchedule(schedule);
    logActivity({
      entityType: 'businessHours',
      entityId: schedule.id,
      action: 'Horário Alterado',
      newData: schedule,
    });
    showToast('Horário Atualizado', 'Horário de funcionamento do estabelecimento guardado com sucesso.', 'success');
  };

  const addScheduleException = (exceptionInput: Omit<ScheduleException, 'id'>) => {
    const newExc: ScheduleException = {
      ...exceptionInput,
      id: `exc-${Date.now()}`,
      status: exceptionInput.status || 'Ativo',
    };
    setBusinessSchedule((prev) => ({
      ...prev,
      exceptions: [newExc, ...(prev.exceptions || [])],
    }));
    logActivity({
      entityType: 'businessHours',
      entityId: newExc.id,
      action: 'Criado',
      newData: newExc,
      reason: newExc.reason,
    });
    showToast('Exceção Adicionada', `Horário especial/feriado para ${newExc.date} guardado.`, 'success');
  };

  const updateScheduleException = (id: string, partial: Partial<ScheduleException>) => {
    setBusinessSchedule((prev) => ({
      ...prev,
      exceptions: (prev.exceptions || []).map((e) => (e.id === id ? { ...e, ...partial } : e)),
    }));
    logActivity({
      entityType: 'businessHours',
      entityId: id,
      action: 'Editado',
      newData: partial,
    });
    showToast('Exceção Atualizada', 'Exceção de horário guardada.', 'info');
  };

  const deleteScheduleException = (id: string) => {
    setBusinessSchedule((prev) => ({
      ...prev,
      exceptions: (prev.exceptions || []).filter((e) => e.id !== id),
    }));
    showToast('Exceção Removida', 'Exceção eliminada com sucesso.', 'info');
  };

  // ENTITY EDITING & ARCHIVING
  const updateProfessional = (id: string, partial: Partial<Professional>) => {
    setProfessionals((prev) => prev.map((p) => (p.id === id ? { ...p, ...partial } : p)));
    logActivity({
      entityType: 'professional',
      entityId: id,
      action: 'Editado',
      newData: partial,
    });
    showToast('Profissional Atualizado', 'Ficha e permissões guardadas.', 'success');
  };

  const updateService = (id: string, partial: Partial<ServiceItem>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...partial } : s)));
    logActivity({
      entityType: 'service',
      entityId: id,
      action: 'Editado',
      newData: partial,
    });
    showToast('Serviço Atualizado', 'Tabela de serviços e preços guardada.', 'success');
  };

  const updatePackage = (id: string, partial: Partial<Package>) => {
    setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, ...partial } : p)));
    logActivity({
      entityType: 'package',
      entityId: id,
      action: 'Editado',
      newData: partial,
    });
    showToast('Pacote Atualizado', 'Configuração do pacote guardada.', 'success');
  };

  const updateCommissionRule = (id: string, partial: Partial<ProfessionalCommission>) => {
    setCommissions((prev) => prev.map((c) => (c.id === id ? { ...c, ...partial } : c)));
    logActivity({
      entityType: 'commission',
      entityId: id,
      action: 'Editado',
      newData: partial,
    });
    showToast('Comissão Guardada', 'Regra de comissão guardada.', 'success');
  };

  const updateAppointmentDetails = (id: string, partial: Partial<Appointment>) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...partial } : a)));
    logActivity({
      entityType: 'appointment',
      entityId: id,
      action: 'Editado',
      newData: partial,
    });
    showToast('Agendamento Atualizado', 'Alterações ao agendamento guardadas.', 'success');
  };

  const archiveEntity = (entityType: ActivityLogItem['entityType'], entityId: string, reason?: string) => {
    if (entityType === 'professional') {
      updateProfessional(entityId, { status: 'Ausente' });
    } else if (entityType === 'service') {
      setServices((prev) => prev.filter((s) => s.id !== entityId));
    } else if (entityType === 'package') {
      setPackages((prev) => prev.map((p) => (p.id === entityId ? { ...p, status: 'Expirado' } : p)));
    }
    logActivity({
      entityType,
      entityId,
      action: 'Arquivado',
      reason,
    });
    showToast('Registo Arquivado', `Entidade arquivada com sucesso.`, 'info');
  };

  // DEMO RESET
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAppointments(initialAppointments);
    setClients(initialClients);
    setTransactions(initialTransactions);
    setCommissions(initialCommissions);
    setProducts(initialProducts);
    setMovements(initialMovements);
    setCampaigns(initialMarketingCampaigns);
    setCoupons(initialCoupons);
    setWaitlist(initialWaitlist);
    setServices(initialServices);
    setProfessionals(initialProfessionals);
    setRooms(initialRooms);
    setPackages(initialPackages);
    setCashRegister(initialCashRegister);
    setLoyaltyTiers(initialLoyaltyTiers);
    setTierAssignments([]);
    setBusinessSchedule(initialBusinessSchedule);
    setActivityLogs([]);
    showToast('Dados Restaurados', 'Dados de demonstração reposicionados.', 'info');
  };

  return (
    <OperationalContext.Provider
      value={{
        appointments,
        clients,
        transactions,
        commissions,
        products,
        movements,
        campaigns,
        coupons,
        waitlist,
        services,
        professionals,
        rooms,
        packages,
        cashRegister,
        loyaltyTiers,
        tierAssignments,
        businessSchedule,
        activityLogs,
        toasts,
        showToast,
        removeToast,
        logActivity,
        addClient,
        updateClient,
        calculateClientTier,
        assignClientTierManual,
        removeClientTierOverride,
        recalculateAllClientTiers,
        addLoyaltyTier,
        updateLoyaltyTier,
        reorderLoyaltyTiers,
        archiveLoyaltyTierWithFallback,
        addAppointment,
        updateAppointmentStatus,
        updateAppointmentServices,
        updateAppointmentDetails,
        updateProfessional,
        updateService,
        updatePackage,
        updateCommissionRule,
        archiveEntity,
        updateBusinessSchedule,
        addScheduleException,
        updateScheduleException,
        deleteScheduleException,
        processCheckout,
        addTransaction,
        registerCashMovement,
        toggleCashRegister,
        addService,
        addProfessional,
        addPackage,
        addResource,
        addWaitlistItem,
        removeWaitlistItem,
        addCommissionRule,
        addProduct,
        adjustStock,
        toggleCampaignStatus,
        addCoupon,
        resetDemoData,
      }}
    >
      {children}
    </OperationalContext.Provider>
  );
};

export const useOperational = () => {
  const context = useContext(OperationalContext);
  if (!context) {
    throw new Error('useOperational must be used within an OperationalProvider');
  }
  return context;
};
