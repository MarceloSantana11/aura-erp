import React, { useState } from 'react';
import { ShoppingBag, Euro, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Appointment, Transaction, Product, ServiceItem } from '../types';
import { PageHeader } from './ui/PageHeader';
import { Button } from './ui/Button';
import { useTranslation } from '../i18n/I18nContext';
import { useOperational } from '../context/OperationalContext';

interface CaixaViewProps {
  appointments: Appointment[];
  transactions: Transaction[];
  products: Product[];
  onNewTransaction?: (tx: Transaction) => void;
  onUpdateAppointmentPayment?: (appId: string) => void;
}

export const CaixaView: React.FC<CaixaViewProps> = ({
  appointments: propsAppointments,
}) => {
  const { t } = useTranslation();
  const {
    appointments: contextAppointments,
    cashRegister,
    processCheckout,
    registerCashMovement,
    toggleCashRegister,
    products,
    services,
  } = useOperational();

  const appointments = contextAppointments || propsAppointments;

  const [selectedAppId, setSelectedAppId] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    'Multibanco' | 'MB WAY' | 'Dinheiro' | 'Cartão de Crédito' | 'Transferência'
  >('Multibanco');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [movementAmount, setMovementAmount] = useState<number>(0);
  const [movementReason, setMovementReason] = useState<string>('');

  const pendingAppointments = appointments.filter((a) => a.paymentStatus !== 'Pago');
  const activeAppointment = appointments.find((a) => a.id === selectedAppId);

  const calculateFinalTotal = () => {
    if (!activeAppointment) return 0;
    const base = activeAppointment.value - (activeAppointment.depositPaid || 0);
    return Math.max(0, base - discountAmount + tipAmount);
  };

  const handleProcessCheckout = () => {
    if (!activeAppointment) return;

    const totalToPay = calculateFinalTotal();

    const appServices: ServiceItem[] = activeAppointment.services?.length
      ? activeAppointment.services
      : [
          {
            id: `srv-checkout-${Date.now()}`,
            name: activeAppointment.procedure,
            category: 'Estética',
            durationMinutes: activeAppointment.durationMinutes || 60,
            price: activeAppointment.value,
            vatRate: 23,
          },
        ];

    const success = processCheckout({
      appointmentId: activeAppointment.id,
      clientId: `cli-${activeAppointment.clientName}`,
      clientName: activeAppointment.clientName,
      services: appServices,
      subtotal: activeAppointment.value,
      discount: discountAmount,
      tip: tipAmount,
      total: totalToPay,
      payments: [{ method: selectedPaymentMethod, amount: totalToPay }],
    });

    if (success) {
      setSelectedAppId('');
      setDiscountAmount(0);
      setTipAmount(0);
    }
  };

  const handleRegisterMovement = (type: 'Sangria' | 'Reforço') => {
    if (movementAmount <= 0) return;
    registerCashMovement(type, movementAmount, movementReason);
    setMovementAmount(0);
    setMovementReason('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('tab.caixa', 'Caixa Operacional & Terminal Checkout')}
        description={t(
          'caixa.sub',
          'Terminal de cobrança unificada, meios de pagamento (MB, MB WAY) e controlo de gaveta de dinheiro'
        )}
        secondaryActions={[
          {
            label: cashRegister.isOpen ? 'Fechar Caixa Operacional' : 'Abrir Caixa Operacional',
            onClick: () => toggleCashRegister(!cashRegister.isOpen),
            variant: 'outline',
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Terminal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-5">
            <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>1. Selecionar Atendimento Pendente de Cobrança</span>
              <span className="text-xs font-bold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                {pendingAppointments.length} Pendentes
              </span>
            </h3>

            {pendingAppointments.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-2xl border border-slate-100">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-slate-800">Todos os atendimentos do dia estão liquidados!</p>
                <p className="text-slate-500 mt-0.5">Não existem pendências de checkout no balcão.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pendingAppointments.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => setSelectedAppId(app.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-2 touch-target ${
                      selectedAppId === app.id
                        ? 'bg-rose-50/90 border-rose-800 ring-2 ring-rose-800/20 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:border-rose-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-900">{app.clientName}</span>
                      <span className="font-black text-xs text-rose-900">{app.value}€</span>
                    </div>
                    <p className="text-[11px] text-slate-700 font-medium">{app.procedure}</p>
                    <p className="text-[10px] text-slate-500">
                      {app.time} • {app.professional}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {activeAppointment && (
              <div className="pt-4 border-t border-slate-100 space-y-5 animate-in fade-in duration-200">
                <h3 className="font-extrabold text-slate-900 text-sm">
                  2. Definir Meio de Pagamento (Portugal)
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-bold">
                  {(
                    ['Multibanco', 'MB WAY', 'Dinheiro', 'Cartão de Crédito', 'Transferência'] as const
                  ).map((method) => (
                    <button
                      key={method}
                      onClick={() => setSelectedPaymentMethod(method)}
                      className={`p-3 rounded-xl border transition-all text-center cursor-pointer touch-target ${
                        selectedPaymentMethod === method
                          ? 'bg-rose-900 text-white border-rose-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">
                      Desconto Especial (€)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(Number(e.target.value))}
                      className="w-full mt-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-rose-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">
                      Gorjeta Atribuída (€)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={tipAmount}
                      onChange={(e) => setTipAmount(Number(e.target.value))}
                      className="w-full mt-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-rose-800"
                    />
                  </div>
                </div>

                <div className="p-5 bg-rose-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-200 tracking-wider">
                      Total Final a Liquidar
                    </span>
                    <p className="text-2xl font-black">{calculateFinalTotal()}€</p>
                  </div>

                  <Button variant="outline" size="lg" onClick={handleProcessCheckout} fullWidthMobile>
                    Processar Checkout & Emitir Recibo
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-2xs">
            <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Histórico Consolidado de Movimentos de Caixa Hoje
            </h3>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {cashRegister.movements.map((mov) => (
                <div
                  key={mov.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        mov.type === 'Entrada' || mov.type === 'Abertura' || mov.type === 'Reforço'
                          ? 'bg-emerald-100 text-emerald-950'
                          : 'bg-rose-100 text-rose-950'
                      }`}
                    >
                      {mov.type}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">{mov.description}</p>
                      <p className="text-[10px] text-slate-400">
                        {mov.time} • Por {mov.responsible}
                      </p>
                    </div>
                  </div>

                  <span className="font-black text-slate-900">{mov.amount}€</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Balances & Movements */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm">Resumo de Meios de Pagamento</h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  cashRegister.isOpen ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {cashRegister.isOpen ? 'Caixa Aberto' : 'Caixa Fechado'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-600 font-bold">Dinheiro em Gaveta</span>
                <span className="font-black text-slate-900">{cashRegister.currentCash}€</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-600 font-bold">Multibanco (TPA)</span>
                <span className="font-black text-slate-900">{cashRegister.currentMultibanco}€</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-600 font-bold">MB WAY</span>
                <span className="font-black text-slate-900">{cashRegister.currentMbWay}€</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-600 font-bold">Cartões de Crédito</span>
                <span className="font-black text-slate-900">{cashRegister.currentCard}€</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-2xs text-xs">
            <h3 className="font-extrabold text-slate-900 text-sm">Sangria ou Reforço de Gaveta</h3>

            <div className="space-y-2.5">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Valor (€)</label>
                <input
                  type="number"
                  min="0"
                  value={movementAmount}
                  onChange={(e) => setMovementAmount(Number(e.target.value))}
                  className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-rose-800"
                  placeholder="0,00"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Motivo / Observação
                </label>
                <input
                  type="text"
                  value={movementReason}
                  onChange={(e) => setMovementReason(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-rose-800"
                  placeholder="Ex: Troco inicial ou depósito cofre"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleRegisterMovement('Sangria')}
                  className="p-2.5 bg-rose-100 hover:bg-rose-200 text-rose-950 font-extrabold rounded-xl transition-all cursor-pointer text-center touch-target"
                >
                  Sangria (Saída)
                </button>
                <button
                  onClick={() => handleRegisterMovement('Reforço')}
                  className="p-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-extrabold rounded-xl transition-all cursor-pointer text-center touch-target"
                >
                  Reforço (Entrada)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
