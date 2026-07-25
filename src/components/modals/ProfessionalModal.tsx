import React, { useState, useEffect } from 'react';
import { ResponsiveModal } from '../ui/ResponsiveModal';
import { Button } from '../ui/Button';
import { Professional } from '../../types';
import { useTranslation } from '../../i18n/I18nContext';

interface ProfessionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProfessional?: (professional: Omit<Professional, 'id'>) => void;
  onSave?: (professional: Omit<Professional, 'id'> | Professional) => void;
  initialData?: Professional | null;
}

export const ProfessionalModal: React.FC<ProfessionalModalProps> = ({
  isOpen,
  onClose,
  onAddProfessional,
  onSave,
  initialData,
}) => {
  const { t } = useTranslation();
  const isEdit = !!initialData;

  const [name, setName] = useState('');
  const [role, setRole] = useState('Hair Stylist');
  const [specialties, setSpecialties] = useState('Corte, Coloração, Brushing');
  const [phone, setPhone] = useState('+351 912 345 678');
  const [email, setEmail] = useState('');
  const [commissionRate, setCommissionRate] = useState(35);
  const [status, setStatus] = useState<Professional['status']>('Ativo');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setRole(initialData.role || '');
      setSpecialties((initialData.specialties || []).join(', '));
      setPhone(initialData.phone || '');
      setEmail(initialData.email || '');
      setCommissionRate(initialData.commissionRate || 0);
      setStatus(initialData.status || 'Ativo');
    } else {
      setName('');
      setRole('Hair Stylist');
      setSpecialties('Corte, Coloração, Brushing');
      setPhone('+351 912 345 678');
      setEmail('');
      setCommissionRate(35);
      setStatus('Ativo');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      ...(initialData ? { id: initialData.id } : {}),
      name,
      role,
      specialties: specialties.split(',').map((s) => s.trim()).filter(Boolean),
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@maisonelegance.pt`,
      commissionRate: Number(commissionRate),
      avatar: initialData?.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200`,
      status,
      todayAppointmentsCount: initialData?.todayAppointmentsCount || 0,
      todayRevenueEstimate: initialData?.todayRevenueEstimate || 0,
    };

    if (onSave) {
      onSave(payload as any);
    } else if (onAddProfessional) {
      onAddProfessional(payload as any);
    }

    onClose();
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Editar Profissional' : t('modal.addProfessional.title', 'Adicionar Novo Profissional')}
      subtitle={isEdit ? 'Atualize os dados e comissão do profissional' : t('modal.addProfessional.sub', 'Cadastre membros da equipa, funções e taxas de comissão')}
      footer={
        <>
          <Button variant="outline" onClick={onClose} fullWidthMobile>
            {t('common.cancel', 'Cancelar')}
          </Button>
          <Button variant="primary" onClick={handleSubmit} fullWidthMobile>
            {isEdit ? 'Guardar Alterações' : t('common.save', 'Guardar Profissional')}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div>
          <label className="block app-label mb-1.5">{t('field.name', 'Nome Completo')} *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ex: Inês Silveira"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800 focus:ring-1 focus:ring-rose-800"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block app-label mb-1.5">{t('field.role', 'Função / Cargo')}</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="ex: Hair Stylist & Colorista"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800"
            />
          </div>

          <div>
            <label className="block app-label mb-1.5">{t('field.commission', 'Comissão Base (%)')}</label>
            <input
              type="number"
              min={0}
              max={100}
              value={commissionRate}
              onChange={(e) => setCommissionRate(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block app-label mb-1.5">{t('field.phone', 'Telemóvel (+351)')}</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800"
            />
          </div>

          <div>
            <label className="block app-label mb-1.5">{t('field.email', 'Email Profissional')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ex: ines@maisonelegance.pt"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800"
            />
          </div>
        </div>

        <div>
          <label className="block app-label mb-1.5">{t('field.specialties', 'Especialidades (separadas por vírgulas)')}</label>
          <input
            type="text"
            value={specialties}
            onChange={(e) => setSpecialties(e.target.value)}
            placeholder="Corte, Balayage, Tratamento Capilar"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800"
          />
        </div>

        <div>
          <label className="block app-label mb-1.5">{t('field.status', 'Estado Operacional')}</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800 cursor-pointer"
          >
            <option value="Ativo">Ativo (Em Escala)</option>
            <option value="Em Pausa">Em Pausa / Férias</option>            <option value="Ausente">Ausente</option>
          </select>
        </div>
      </form>
    </ResponsiveModal>
  );
};
