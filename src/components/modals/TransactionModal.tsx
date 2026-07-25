import React, { useState } from 'react';
import { ResponsiveModal } from '../ui/ResponsiveModal';
import { Button } from '../ui/Button';
import { Transaction } from '../../types';
import { useTranslation } from '../../i18n/I18nContext';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (tx: Transaction) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
}) => {
  const { t } = useTranslation();
  const [description, setDescription] = useState('');
  const [clientName, setClientName] = useState('Fornecedor / Operacional');
  const [value, setValue] = useState(75);
  const [category, setCategory] = useState<Transaction['category']>('Despesa Operacional');
  const [paymentMethod, setPaymentMethod] = useState<Transaction['paymentMethod']>('Multibanco');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onAddTransaction({
      id: `tx-${Date.now()}`,
      clientName,
      procedure: description,
      status: 'Concluído',
      time: 'Hoje, Agora',
      value: Number(value),
      paymentMethod,
      category,
    });

    setDescription('');
    onClose();
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('modal.addTransaction.title', 'Registar Transação / Movimento Financeiro')}
      subtitle={t('modal.addTransaction.sub', 'Lançar receita ou despesa operacional direta no fluxo de caixa')}
      footer={
        <>
          <Button variant="outline" onClick={onClose} fullWidthMobile>
            {t('common.cancel', 'Cancelar')}
          </Button>
          <Button variant="primary" onClick={handleSubmit} fullWidthMobile>
            {t('common.save', 'Guardar Transação')}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div>
          <label className="block app-label mb-1.5">{t('field.category', 'Tipo de Movimento / Categoria')}</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800 cursor-pointer"
          >
            <option value="Despesa Operacional">Despesa Operacional (Fornecedores, Consumíveis)</option>
            <option value="Atendimento">Receita de Atendimento</option>
            <option value="Venda de Produto">Venda de Produto / Cosmético</option>
            <option value="Pacote">Venda de Pacote / Programa</option>
          </select>
        </div>

        <div>
          <label className="block app-label mb-1.5">{t('field.description', 'Descrição da Transação')} *</label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="ex: Recompra de Toalhas Descartáveis & Champô L'Oréal"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block app-label mb-1.5">{t('field.entity', 'Entidade / Cliente / Fornecedor')}</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="ex: L'Oréal Portugal / Cliente"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800"
            />
          </div>

          <div>
            <label className="block app-label mb-1.5">{t('field.value', 'Valor (€)')} *</label>
            <input
              type="number"
              step={0.5}
              min={0}
              required
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-slate-900 focus:outline-none focus:border-rose-800"
            />
          </div>
        </div>

        <div>
          <label className="block app-label mb-1.5">{t('field.paymentMethod', 'Meio de Pagamento')}</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as any)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800 cursor-pointer"
          >
            <option value="Multibanco">Terminal Multibanco / TPA</option>
            <option value="MB WAY">MB WAY</option>
            <option value="Dinheiro">Dinheiro (Espécie)</option>            <option value="Cartão de Crédito">Cartão de Crédito</option>
            <option value="Transferência">Transferência Bancária</option>
          </select>
        </div>
      </form>
    </ResponsiveModal>
  );
};
