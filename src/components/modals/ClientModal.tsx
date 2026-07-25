import React, { useState } from 'react';
import { ResponsiveModal } from '../ui/ResponsiveModal';
import { Button } from '../ui/Button';
import { Client } from '../../types';
import { useTranslation } from '../../i18n/I18nContext';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: (client: Omit<Client, 'id'>) => void;
}

export const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  onAddClient,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+351 9');
  const [email, setEmail] = useState('');
  const [nif, setNif] = useState('');
  const [notes, setNotes] = useState('');
  const [vipLevel, setVipLevel] = useState<Client['vipLevel']>('Standard');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddClient({
      name,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      nif,
      totalSpent: 0,
      lastVisit: 'Hoje (Novo Registo)',
      status: 'Novo',
      vipLevel,
      avatar: `https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200`,
      notes,
      activePackagesCount: 0,
      loyaltyPoints: 100, // Welcome points
    });

    setName('');
    setNotes('');
    onClose();
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('modal.addClient.title', 'Adicionar Novo Cliente (CRM)')}
      subtitle={t('modal.addClient.sub', 'Registe a ficha do cliente, contactos, NIF e preferências')}
      footer={
        <>
          <Button variant="outline" onClick={onClose} fullWidthMobile>
            {t('common.cancel', 'Cancelar')}
          </Button>
          <Button variant="primary" onClick={handleSubmit} fullWidthMobile>
            {t('common.save', 'Guardar Cliente')}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div>
          <label className="block app-label mb-1.5">{t('field.name', 'Nome Completo do Cliente')} *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ex: Dra. Margarida Vasconcelos"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800 focus:ring-1 focus:ring-rose-800"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block app-label mb-1.5">{t('field.phone', 'Telemóvel (+351)')} *</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+351 912 345 678"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800"
            />
          </div>

          <div>
            <label className="block app-label mb-1.5">{t('field.email', 'Email (para Fatura/Confirmações)')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cliente@email.pt"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block app-label mb-1.5">{t('field.nif', 'NIF (Faturação Autoridade Tributária)')}</label>
            <input
              type="text"
              value={nif}
              onChange={(e) => setNif(e.target.value)}
              placeholder="254890123"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800"
            />
          </div>

          <div>
            <label className="block app-label mb-1.5">{t('field.vip', 'Nível VIP / Fidelidade')}</label>
            <select
              value={vipLevel}
              onChange={(e) => setVipLevel(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800 cursor-pointer"
            >
              <option value="Standard">Standard</option>
              <option value="Silver">Silver Member</option>
              <option value="Gold VIP">Gold VIP Premier</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block app-label mb-1.5">{t('field.notes', 'Observações, Alergias ou Preferências')}</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Preferências de bebidas, sensibilidade capilar, produtos favoritos..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800"
          />
        </div>
      </form>
    </ResponsiveModal>
  );
};
