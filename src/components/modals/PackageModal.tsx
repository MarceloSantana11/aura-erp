import React, { useState, useEffect } from 'react';
import { ResponsiveModal } from '../ui/ResponsiveModal';
import { Button } from '../ui/Button';
import { Package } from '../../types';
import { useTranslation } from '../../i18n/I18nContext';

interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPackage?: (pkg: Package) => void;
  onSave?: (pkg: Package) => void;
  initialData?: Package | null;
}

export const PackageModal: React.FC<PackageModalProps> = ({
  isOpen,
  onClose,
  onAddPackage,
  onSave,
  initialData,
}) => {
  const { t } = useTranslation();
  const isEdit = !!initialData;

  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [serviceName, setServiceName] = useState('Sessão de Laser Diodo / Drenagem');
  const [totalSessions, setTotalSessions] = useState(5);
  const [usedSessions, setUsedSessions] = useState(0);
  const [totalPrice, setTotalPrice] = useState(180);
  const [expirationDate, setExpirationDate] = useState('31/12/2026');
  const [status, setStatus] = useState<Package['status']>('Ativo');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setClientName(initialData.clientName || '');
      setServiceName(initialData.serviceName || '');
      setTotalSessions(initialData.totalSessions || 5);
      setUsedSessions(initialData.usedSessions || 0);
      setTotalPrice(initialData.totalPrice || 0);
      setExpirationDate(initialData.expirationDate || '31/12/2026');
      setStatus(initialData.status || 'Ativo');
    } else {
      setName('');
      setClientName('');
      setServiceName('Sessão de Laser Diodo / Drenagem');
      setTotalSessions(5);
      setUsedSessions(0);
      setTotalPrice(180);
      setExpirationDate('31/12/2026');
      setStatus('Ativo');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: Package = {
      id: initialData?.id || `pkg-${Date.now()}`,
      name,
      clientName: clientName || 'Cliente Geral',
      serviceName,
      totalSessions: Number(totalSessions),
      usedSessions: Number(usedSessions),
      totalPrice: Number(totalPrice),
      expirationDate,
      status,
    };

    if (onSave) {
      onSave(payload);
    } else if (onAddPackage) {
      onAddPackage(payload);
    }

    onClose();
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Editar Pacote de Sessões' : t('modal.addPackage.title', 'Criar Novo Pacote / Voucher de Sessões')}
      subtitle={isEdit ? 'Atualize sessões, validade e estado' : t('modal.addPackage.sub', 'Combine múltiplas sessões com desconto especial')}
      footer={
        <>
          <Button variant="outline" onClick={onClose} fullWidthMobile>
            {t('common.cancel', 'Cancelar')}
          </Button>
          <Button variant="primary" onClick={handleSubmit} fullWidthMobile>
            {isEdit ? 'Guardar Alterações' : t('common.save', 'Guardar Pacote')}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div>
          <label className="block app-label mb-1.5">{t('field.packageName', 'Nome do Pacote')} *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ex: Programa Aceleração Capilar (5 Sessões)"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800"
          />
        </div>

        <div>
          <label className="block app-label mb-1.5">{t('field.clientName', 'Cliente Titular (Opcional)')}</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="ex: Sofia Alvelos (deixe em branco se for pacote genérico)"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block app-label mb-1.5">{t('field.serviceName', 'Serviço Incluído')}</label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800"
            />
          </div>

          <div>
            <label className="block app-label mb-1.5">{t('field.totalSessions', 'Número Total de Sessões')}</label>
            <input
              type="number"
              min={1}
              value={totalSessions}
              onChange={(e) => setTotalSessions(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block app-label mb-1.5">{t('field.totalPrice', 'Preço Total do Pacote (€)')}</label>
            <input
              type="number"
              step={1}
              min={0}
              value={totalPrice}
              onChange={(e) => setTotalPrice(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-rose-900 focus:outline-none focus:border-rose-800"
            />
          </div>

          <div>
            <label className="block app-label mb-1.5">{t('field.expirationDate', 'Data de Validade')}</label>
            <input
              type="text"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              placeholder="DD/MM/AAAA"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800"
            />
          </div>
        </div>
      </form>
    </ResponsiveModal>
  );
};
