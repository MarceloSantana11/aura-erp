import React, { useState } from 'react';
import { ResponsiveModal } from '../ui/ResponsiveModal';
import { Button } from '../ui/Button';
import { Room } from '../../types';
import { useTranslation } from '../../i18n/I18nContext';

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddResource: (resource: Room) => void;
}

export const ResourceModal: React.FC<ResourceModalProps> = ({
  isOpen,
  onClose,
  onAddResource,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [type, setType] = useState<Room['type']>('Cabine VIP');
  const [status, setStatus] = useState<Room['status']>('Disponível');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddResource({
      id: `room-${Date.now()}`,
      name,
      type,
      status,
    });

    setName('');
    onClose();
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('modal.addResource.title', 'Adicionar Sala, Cabine ou Recurso')}
      subtitle={t('modal.addResource.sub', 'Registe espaços de atendimento, cadeiras ou equipamentos estéticos')}
      footer={
        <>
          <Button variant="outline" onClick={onClose} fullWidthMobile>
            {t('common.cancel', 'Cancelar')}
          </Button>
          <Button variant="primary" onClick={handleSubmit} fullWidthMobile>
            {t('common.save', 'Guardar Recurso')}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div>
          <label className="block app-label mb-1.5">{t('field.resourceName', 'Nome da Sala / Recurso')} *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ex: Cabine 03 - Laser & Radiofrequência"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800"
          />
        </div>

        <div>
          <label className="block app-label mb-1.5">{t('field.resourceType', 'Tipo de Espaço / Equipamento')}</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800 cursor-pointer"
          >
            <option value="Cabine VIP">Cabine VIP / Estética</option>
            <option value="Maca Estética">Maca de Massagem / Drenagem</option>
            <option value="Cadeira Cabelo">Bancada / Cadeira de Cabelo</option>
            <option value="Mesa Unhas">Mesa de Manicure / Unhas</option>
          </select>
        </div>

        <div>
          <label className="block app-label mb-1.5">{t('field.status', 'Estado Operacional Inicial')}</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800 cursor-pointer"
          >
            <option value="Disponível">Disponível</option>
            <option value="Manutenção">Em Manutenção / Higienização</option>
          </select>
        </div>
      </form>
    </ResponsiveModal>
  );
};
