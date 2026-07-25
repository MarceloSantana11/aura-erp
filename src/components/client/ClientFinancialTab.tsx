import React from 'react';
import { CreditCard, DollarSign, Gift, FileText, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { Client, Transaction, Package } from '../../types';
import { useTranslation } from '../../i18n/I18nContext';

interface ClientFinancialTabProps {
  client: Client;
  transactions: Transaction[];
  packages: Package[];
  onOpenCheckout: () => void;
}

export const ClientFinancialTab: React.FC<ClientFinancialTabProps> = ({
  client,
  transactions,
  packages,
  onOpenCheckout,
}) => {
  const { formatCurrency } = useTranslation();

  const clientTxs = transactions.filter(
    (t) =>
      t.clientName.toLowerCase().includes(client.name.toLowerCase()) ||
      client.name.toLowerCase().includes(t.clientName.toLowerCase())
  );

  const clientPackages = packages.filter(
    (p) => p.clientName.toLowerCase() === client.name.toLowerCase()
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Total Acumulado Gasto
          </span>
          <p className="text-xl font-black text-slate-900">
            {formatCurrency(client.totalSpent)}
          </p>
          <span className="text-[10px] text-slate-500">Histórico de vendas no balcão</span>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Crédito em Conta
          </span>
          <p className="text-xl font-black text-emerald-950">
            {formatCurrency(client.availableCredit || 25)}
          </p>
          <span className="text-[10px] text-emerald-800 font-semibold">Disponível para abatimento</span>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Pacotes de Sessões Ativos
          </span>
          <p className="text-xl font-black text-rose-950">
            {clientPackages.length || client.activePackagesCount || 1}
          </p>
          <span className="text-[10px] text-rose-900 font-semibold">Em utilização na unidade</span>
        </div>
      </div>

      {/* Active Packages */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
        <h3 className="font-extrabold text-xs text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
          <Gift className="w-4 h-4 text-rose-800" />
          Pacotes de Tratamento Adquiridos
        </h3>

        {clientPackages.length === 0 ? (
          <p className="text-xs text-slate-500 py-2">
            Nenhum pacote ativo para este cliente no momento.
          </p>
        ) : (
          <div className="space-y-2.5">
            {clientPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs"
              >
                <div className="flex items-center justify-between font-extrabold text-slate-900">
                  <span>{pkg.name}</span>
                  <span>{pkg.totalPrice}€</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-800 h-full rounded-full"
                    style={{
                      width: `${(pkg.usedSessions / pkg.totalSessions) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                  <span>
                    {pkg.usedSessions} de {pkg.totalSessions} sessões concluídas
                  </span>
                  <span>Válido até {pkg.expirationDate}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transactions & Invoices */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="font-extrabold text-xs text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-rose-800" />
            Recibos & Histórico de Vendas
          </h3>

          <button
            onClick={onOpenCheckout}
            className="text-xs font-bold text-rose-800 hover:text-rose-950 flex items-center gap-1 cursor-pointer"
          >
            Abrir Caixa
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {clientTxs.length === 0 ? (
          <p className="text-xs text-slate-500 py-2">
            Nenhum registo financeiro encontrado.
          </p>
        ) : (
          <div className="space-y-2 text-xs">
            {clientTxs.map((tx) => (
              <div
                key={tx.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between"
              >
                <div>
                  <p className="font-extrabold text-slate-900">{tx.procedure}</p>
                  <p className="text-[10px] text-slate-400">
                    {tx.time} • Método: {tx.paymentMethod || 'Multibanco'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-black text-slate-900">{tx.value}€</span>
                  <span className="block text-[10px] text-emerald-800 font-bold">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
