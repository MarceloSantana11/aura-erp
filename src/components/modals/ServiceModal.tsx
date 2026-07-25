import React, { useState, useEffect } from 'react';
import { ResponsiveModal } from '../ui/ResponsiveModal';
import { Button } from '../ui/Button';
import { ServiceItem } from '../../types';
import { useTranslation } from '../../i18n/I18nContext';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddService?: (service: ServiceItem) => void;
  onSave?: (service: ServiceItem) => void;
  initialData?: ServiceItem | null;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  onAddService,
  onSave,
  initialData,
}) => {
  const { t } = useTranslation();
  const isEdit = !!initialData;

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ServiceItem['category']>('Cabelo');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [price, setPrice] = useState(45);
  const [vatRate, setVatRate] = useState(23);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCategory(initialData.category || 'Cabelo');
      setDurationMinutes(initialData.durationMinutes || 60);
      setPrice(initialData.price || 0);
      setVatRate(initialData.vatRate || 23);
      setDescription(initialData.description || '');
    } else {
      setName('');
      setCategory('Cabelo');
      setDurationMinutes(60);
      setPrice(45);
      setVatRate(23);
      setDescription('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: ServiceItem = {
      id: initialData?.id || `serv-${Date.now()}`,
      name,
      category,
      durationMinutes: Number(durationMinutes),
      price: Number(price),
      vatRate: Number(vatRate),
      description,
    };

    if (onSave) {
      onSave(payload);
    } else if (onAddService) {
      onAddService(payload);
    }

    onClose();
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Editar Serviço do Catálogo' : t('modal.addService.title', 'Adicionar Novo Serviço ao Catálogo')}
      subtitle={isEdit ? 'Atualize preço em Euro (€), duração e parâmetros' : t('modal.addService.sub', 'Defina preço em Euro (€), duração e taxa de IVA')}
      footer={
        <>
          <Button variant="outline" onClick={onClose} fullWidthMobile>
            {t('common.cancel', 'Cancelar')}
          </Button>
          <Button variant="primary" onClick={handleSubmit} fullWidthMobile>
            {isEdit ? 'Guardar Alterações' : t('common.save', 'Guardar Serviço')}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div>
          <label className="block app-label mb-1.5">{t('field.serviceName', 'Nome do Serviço')} *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ex: Coloração Gloss & Hidratação Botox Capilar"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block app-label mb-1.5">{t('field.category', 'Categoria')}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800 cursor-pointer"
            >
              <option value="Cabelo">Cabelo & Capilar</option>
              <option value="Unhas">Unhas & Manicure</option>
              <option value="Estética">Estética Facial/Corporal</option>
              <option value="Sobrancelhas">Sobrancelhas & Pestanas</option>
              <option value="Depilação">Depilação Laser/Cera</option>
              <option value="Massagens">Massagens & Ritual Spa</option>
            </select>
          </div>

          <div>
            <label className="block app-label mb-1.5">{t('field.duration', 'Duração Estimada (minutos)')}</label>
            <input
              type="number"
              step={15}
              min={15}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block app-label mb-1.5">{t('field.price', 'Preço ao Público (€)')} *</label>
            <input
              type="number"
              step={0.5}
              min={0}
              required
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800 font-bold text-rose-900"
            />
          </div>

          <div>
            <label className="block app-label mb-1.5">{t('field.vatRate', 'Taxa de IVA (%)')}</label>
            <select
              value={vatRate}
              onChange={(e) => setVatRate(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800 cursor-pointer"
            >
              <option value={23}>23% (Taxa Normal PT)</option>
              <option value={13}>13% (Taxa Intermédia)</option>
              <option value={6}>6% (Taxa Reduzida)</option>
              <option value={0}>0% (Isento Artigo 9º)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block app-label mb-1.5">{t('field.description', 'Descrição Comercial do Serviço')}</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva o procedimento para os clientes no agendamento online..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800"
          />
        </div>
      </form>
    </ResponsiveModal>
  );
};
