import React, { useState } from 'react';
import { ResponsiveModal } from '../ui/ResponsiveModal';
import { Button } from '../ui/Button';
import { WaitlistItem } from '../../types';
import { useTranslation } from '../../i18n/I18nContext';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWaitlist: (item: WaitlistItem) => void;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({
  isOpen,
  onClose,
  onAddWaitlist,
}) => {
  const { t } = useTranslation();
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('+351 9');
  const [serviceName, setServiceName] = useState('Balayage & Brushing');
  const [preferredProfessional, setPreferredProfessional] = useState('Inês Silveira');
  const [preferredTimeWindow, setPreferredTimeWindow] = useState('Sábados / Período da Manhã');
  const [priority, setPriority] = useState<WaitlistItem['priority']>('Normal');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    onAddWaitlist({
      id: `wait-${Date.now()}`,
      clientName,
      clientPhone,
      serviceName,
      preferredProfessional,
      preferredTimeWindow,
      createdAt: 'Hoje, Agora',
      priority,
      notes,
    });

    setClientName('');
    setNotes('');
    onClose();
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('modal.addWaitlist.title', 'Adicionar Cliente à Lista de Espera')}
      subtitle={t('modal.addWaitlist.sub', 'Notificar o cliente assim que surgir uma desistência ou vaga na agenda')}
      footer={
        <>
          <Button variant="outline" onClick={onClose} fullWidthMobile>
            {t('common.cancel', 'Cancelar')}
          </Button>
          <Button variant="primary" onClick={handleSubmit} fullWidthMobile>
            {t('common.save', 'Guardar na Lista')}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div>
          <label className="block app-label mb-1.5">{t('field.clientName', 'Nome do Cliente')} *</label>
          <input
            type="text"
            required
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="ex: Catarina Faria"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block app-label mb-1.5">{t('field.phone', 'Telemóvel de Contacto')} *</label>
            <input
              type="text"
              required
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800"
            />
          </div>

          <div>
            <label className="block app-label mb-1.5">{t('field.priority', 'Prioridade de Notificação')}</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800 cursor-pointer"
            >
              <option value="Normal">Normal</option>
              <option value="Alta">Alta / Urgente (Cliente VIP)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block app-label mb-1.5">{t('field.service', 'Serviço Pretendido')}</label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800"
            />
          </div>

          <div>
            <label className="block app-label mb-1.5">{t('field.preferredProfessional', 'Profissional Preferido')}</label>
            <input
              type="text"
              value={preferredProfessional}
              onChange={(e) => setPreferredProfessional(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800"
            />
          </div>
        </div>

        <div>
          <label className="block app-label mb-1.5">{t('field.timeWindow', 'Disponibilidade de Horário')}</label>
          <input
            type="text"
            value={preferredTimeWindow}
            onChange={(e) => setPreferredTimeWindow(e.target.value)}
            placeholder="ex: Terças e Quintas a partir das 17:00"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800"
          />
        </div>

        <div>
          <label className="block app-label mb-1.5">{t('field.notes', 'Notas Adicionais')}</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Aviso prévio necessário, preferências específicas..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800"
          />
        </div>
      </form>
    </ResponsiveModal>
  );
};
