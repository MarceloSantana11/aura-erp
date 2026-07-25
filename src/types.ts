export type TabType =
  // GRUPO OPERAÇÃO
  | 'dashboard'
  | 'agenda'
  | 'appointments'
  | 'clients'
  | 'caixa'
  | 'waitlist'
  // GRUPO GESTÃO
  | 'professionals'
  | 'services'
  | 'packages'
  | 'stock'
  | 'financial'
  | 'marketing'
  | 'reports'
  // GRUPO ADMINISTRAÇÃO
  | 'settings'
  | 'rooms'
  | 'schedules'
  | 'commissions'
  | 'users';

export type AppointmentStatus =
  | 'Por confirmar'
  | 'Confirmado'
  | 'Cliente chegou'
  | 'Em atendimento'
  | 'Concluído'
  | 'Não compareceu'
  | 'Cancelado';

export type PaymentStatus = 'Pendente' | 'Sinal Pago' | 'Pago' | 'Parcial';

export interface ServiceItem {
  id: string;
  name: string;
  category: 'Cabelo' | 'Unhas' | 'Sobrancelhas' | 'Pestanas' | 'Estética' | 'Depilação' | 'Massagens';
  durationMinutes: number;
  price: number; // Euro €
  vatRate: number; // e.g. 23%
  description?: string;
  requiredRoomType?: string;
  eligibleProfessionals?: string[];
}

export interface Appointment {
  id: string;
  date: string; // DD/MM/AAAA
  time: string; // HH:mm
  durationMinutes: number;
  clientName: string;
  patientName?: string;
  clientPhone: string;
  clientAvatar?: string;
  avatar?: string;
  procedure: string; // Primary service name or combined
  services: ServiceItem[];
  professional: string;
  professionalAvatar?: string;
  room?: string;
  value: number; // Euro €
  depositPaid?: number; // Euro €
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
}

export interface ClientPreference {
  id: string;
  category: 'Geral' | 'Bebida' | 'Cabelo' | 'Estética' | 'Unhas' | 'Atendimento' | 'Sensibilidades';
  label: string;
  value: string;
}

export interface ClientNoteItem {
  id: string;
  clientId: string;
  author: string;
  content: string;
  type: 'Geral' | 'Alerta' | 'Preferência' | 'Sensível' | 'Técnica';
  createdAt: string;
  isPinned?: boolean;
}

export interface LoyaltyTier {
  id: string;
  name: string; // e.g. Cliente novo, Bronze, Prata, Ouro, Platina, Diamante
  description?: string;
  order: number;
  minPoints: number;
  minSpend: number;
  minVisits?: number;
  combinationMode?: 'spend_or_visits' | 'spend_and_visits' | 'manual';
  benefits: string[];
  color: string;
  automaticProgression?: boolean;
  allowRegression?: boolean;
  status?: 'Ativo' | 'Inativo' | 'Arquivado';
  createdAt?: string;
}

export interface ClientTierAssignment {
  id: string;
  clientId: string;
  tierId: string;
  tierName: string;
  source: 'automatic' | 'manual';
  reason?: string;
  assignedAt: string;
  assignedBy?: string;
  previousTierName?: string;
  overrideType?: 'permanent' | 'until_date' | 'until_recalc';
  overrideUntilDate?: string;
}

export interface TimePeriod {
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
}

export interface DaySchedule {
  dayOfWeek: 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom';
  dayLabel: string;
  isOpen: boolean;
  periods: TimePeriod[];
}

export interface ScheduleException {
  id: string;
  locationId?: string;
  date: string; // DD/MM/AAAA or AAAA-MM-DD
  type: 'Feriado' | 'Horário Especial' | 'Encerramento' | 'Evento' | 'Formação' | 'Manutenção';
  isOpen: boolean;
  periods?: TimePeriod[];
  reason: string;
  status: 'Ativo' | 'Inativo';
}

export interface BusinessSchedule {
  id: string;
  businessId?: string;
  locationId?: string;
  timezone: string;
  weeklyHours: DaySchedule[];
  exceptions: ScheduleException[];
}

export interface ActivityLogItem {
  id: string;
  entityType: 'client' | 'appointment' | 'professional' | 'service' | 'package' | 'commission' | 'businessHours' | 'tier' | 'room';
  entityId: string;
  action: 'Criado' | 'Editado' | 'Ativado' | 'Desativado' | 'Arquivado' | 'Reagendado' | 'Promoção Nível' | 'Horário Alterado' | 'Ajuste Manual' | 'Restaurado Nível Automático';
  previousData?: any;
  newData?: any;
  userId: string;
  userName: string;
  reason?: string;
  createdAt: string;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  discountValue: number; // Euro € or %
  discountType: 'fixed' | 'percent' | 'free_service';
  serviceCategory?: string;
  expiresInDays?: number;
  status: 'Ativo' | 'Inativo';
}

export interface LoyaltyTransactionItem {
  id: string;
  clientId: string;
  type: 'Ganho' | 'Resgate' | 'Ajuste Manual' | 'Bónus Aniversário';
  points: number;
  description: string;
  date: string;
  performedBy?: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  nif?: string;
  address?: string;
  totalSpent: number; // Euro €
  lastVisit: string;
  nextVisit?: string;
  createdAt?: string; // e.g. "Outubro 2024"
  status: 'Ativo' | 'Novo' | 'Inativo' | 'Risco de Abandono';
  vipLevel?: string;
  segment?: 'Frequente' | 'Aniversariante' | 'Inativo 45d+' | 'Pacote Ativo';
  visitCount?: number;
  manualOverrideActive?: boolean;
  overrideType?: 'permanent' | 'until_date' | 'until_recalc';
  overrideUntilDate?: string;
  recommendedTierName?: string;
  avatar?: string;
  preferredProfessional?: string;
  preferredDrink?: string;
  preferredContact?: 'WhatsApp' | 'Telefone' | 'Email';
  notes?: string;
  detailedNotes?: ClientNoteItem[];
  preferences?: ClientPreference[];
  activePackagesCount?: number;
  loyaltyPoints?: number;
  lifetimePoints?: number;
  availableCredit?: number; // Euro €
  communicationConsent?: {
    whatsapp: boolean;
    sms: boolean;
    email: boolean;
    marketing: boolean;
  };
  alerts?: string[];
}

export type DrawerEntityType =
  | 'client'
  | 'appointment'
  | 'product'
  | 'professional'
  | 'transaction'
  | 'service';

export interface DrawerStackItem {
  type: DrawerEntityType;
  data: any;
  title?: string;
  initialTab?: string;
}

export interface Transaction {
  id: string;
  clientName: string;
  procedure: string;
  status: 'Concluído' | 'Pendente' | 'Estornado';
  time: string;
  value: number; // Euro €
  paymentMethod?:
    | 'Multibanco'
    | 'MB WAY'
    | 'Dinheiro'
    | 'Cartão de Crédito'
    | 'Transferência'
    | 'Vale-presente'
    | 'Crédito';
  category?: 'Atendimento' | 'Venda de Produto' | 'Pacote' | 'Despesa Operacional';
}

export interface ProfessionalCommission {
  id: string;
  name: string;
  role: string;
  procedure: string;
  totalValue: number; // Euro €
  commissionPercent: number;
  commissionValue: number; // Euro €
  status: 'Pago' | 'Processando' | 'Pendente';
  avatar?: string;
}

export interface Professional {
  id: string;
  name: string;
  role: string;
  specialties: string[];
  phone: string;
  email: string;
  commissionRate: number; // e.g. 35%
  avatar: string;
  status: 'Ativo' | 'Em Pausa' | 'Ausente';
  todayAppointmentsCount: number;
  todayRevenueEstimate: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: 'Cabelo & Capilar' | 'Unhas & Gel' | 'Estética Facial' | 'Descartáveis' | 'Dermocosméticos' | 'Consumo Interno';
  stock: number;
  minStock: number;
  status: 'Normal' | 'Estoque Baixo' | 'Abundante' | 'Crítico';
  costPrice: number; // Euro €
  price: number; // Euro €
  supplier: string;
}

export interface StockMovement {
  id: string;
  type: 'Entrada' | 'Saída' | 'Ajuste';
  productName: string;
  quantity: number;
  date: string;
  notes: string;
}

export interface MarketingCampaign {
  id: string;
  title: string;
  description: string;
  discount: string;
  status: 'Ativo' | 'Pausado' | 'Encerrado';
  views: number;
  conversions: number;
  budget: number;
  spent: number;
  daysRemaining: number;
  image?: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discount: string;
  usageCount: number;
  client: string;
  date: string;
  savedValue: number;
  status: 'Concluído' | 'Ativo' | 'Expirado';
}

export interface Package {
  id: string;
  name: string;
  clientName: string;
  serviceName: string;
  totalSessions: number;
  usedSessions: number;
  totalPrice: number;
  expirationDate: string;
  status: 'Ativo' | 'Concluído' | 'Expirado';
}

export interface GiftCard {
  id: string;
  code: string;
  purchaserName: string;
  recipientName: string;
  initialValue: number;
  currentBalance: number;
  expirationDate: string;
  status: 'Ativo' | 'Resgatado' | 'Expirado';
}

export interface WaitlistItem {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceName: string;
  preferredProfessional?: string;
  preferredTimeWindow: string;
  createdAt: string;
  priority: 'Alta' | 'Normal';
  notes?: string;
}

export interface Room {
  id: string;
  name: string;
  type: 'Cadeira Cabelo' | 'Maca Estética' | 'Mesa Unhas' | 'Cabine VIP';
  status: 'Disponível' | 'Ocupada' | 'Manutenção';
  currentOccupant?: string;
}

export interface CashMovement {
  id: string;
  type: 'Abertura' | 'Entrada' | 'Sangria' | 'Reforço' | 'Fecho';
  description: string;
  amount: number;
  time: string;
  responsible: string;
}

export interface CashRegisterState {
  isOpen: boolean;
  openedAt?: string;
  openedBy?: string;
  initialAmount: number;
  currentCash: number;
  currentMultibanco: number;
  currentMbWay: number;
  currentCard: number;
  movements: CashMovement[];
}

export interface OperatingHour {
  day: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

export interface BusinessSettings {
  businessId?: string;
  organizationId?: string;
  locationId?: string;
  tradeName: string;
  legalName: string;
  nif: string; // Portugal NIF / Tax ID
  cnpj?: string;
  phone: string;
  address: string;
  city: string;
  countryCode?: string; // e.g. 'PT'
  businessType?: 'INDEPENDENT' | 'SMALL_SALON' | 'CLINIC' | 'FULL_SALON' | 'FRANCHISE';
  locale?: string; // e.g. 'pt-PT'
  supportedLocales?: string[];
  currencyCode?: string; // e.g. 'EUR'
  timezone?: string; // e.g. 'Europe/Lisbon'
  dateFormat?: string;
  timeFormat?: string;
  weekStartsOn?: number; // 0 for Sunday, 1 for Monday
  enabledModules?: Record<string, boolean>;
  featureFlags?: Record<string, boolean>;
  autoInvoicing: boolean;
  vatRateDefault: number;
  operatingHours: OperatingHour[];
}

export interface AuraInsight {
  id: string;
  type: 'Ocupação' | 'Faltas' | 'Estoque' | 'Financeiro' | 'Marketing';
  title: string;
  description: string;
  impact: string;
  actionLabel: string;
  actionTab?: TabType;
}
