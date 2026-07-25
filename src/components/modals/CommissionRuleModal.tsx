import React, { useState, useEffect } from 'react';
import { ResponsiveModal } from '../ui/ResponsiveModal';
import { Button } from '../ui/Button';
import { useTranslation } from '../../i18n/I18nContext';

interface CommissionRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRule?: (rule: any) => void;
  onSave?: (rule: any) => void;
  initialData?: any;
}

export const CommissionRuleModal: React.FC<CommissionRuleModalProps> = ({
  isOpen,
  onClose,
  onAddRule,
  onSave,
  initialData,
}) => {
  const { t } = useTranslation();
  const isEdit = !!initialData;

  const [role, setRole] = useState('Hair Stylist Premier');
  const [category, setCategory] = useState('Cabelo');
  const [percent, setPercent] = useState(35);
  const [productSalesPercent, setProductSalesPercent] = useState(10);

  useEffect(() => {
    if (initialData) {
      setRole(initialData.professionalName || initialData.role || 'Hair Stylist Premier');
      setCategory(initialData.category || 'Cabelo');
      setPercent(initialData.serviceCommissionRate || initialData.percent || 35);
      setProductSalesPercent(initialData.productCommissionRate || initialData.productSalesPercent || 10);
    } else {
      setRole('Hair Stylist Premier');
      setCategory('Cabelo');
      setPercent(35);
      setProductSalesPercent(10);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      id: initialData?.id || `rule-${Date.now()}`,
      professionalName: role,
      role,
      category,
      serviceCommissionRate: Number(percent),
      productCommissionRate: Number(productSalesPercent),
      percent: Number(percent),
      productSalesPercent: Number(productSalesPercent),
    };

    if (onSave) {
      onSave(payload);
    } else if (onAddRule) {
      onAddRule(payload);
    }

    onClose();
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Editar Regra de Comissão' : t('modal.addCommissionRule.title', 'Criar Regra de Comissão da Equipa')}
      subtitle={isEdit ? 'Atualize as percentagens de comissão em serviços e produtos' : t('modal.addCommissionRule.sub', 'Defina percentagens automáticas por função, categoria de serviço ou venda de cosméticos')}
      footer={
        <>
          <Button variant="outline" onClick={onClose} fullWidthMobile>
            {t('common.cancel', 'Cancelar')}
          </Button>
          <Button variant="primary" onClick={handleSubmit} fullWidthMobile>
            {isEdit ? 'Guardar Alterações' : t('common.save', 'Guardar Regra de Comissão')}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div>
          <label className="block app-label mb-1.5">{t('field.roleGroup', 'Função / Categoria de Profissional')}</label>
          <input
            type="text"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="ex: Coloristas & Stylists Seniores"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block app-label mb-1.5">{t('field.category', 'Categoria de Serviço')}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-800 cursor-pointer"
            >
              <option value="Cabelo">Cabelo & Tratamentos</option>
              <option value="Estética">Estética & Dermocosmética</option>
              <option value="Unhas">Unhas & Manicure</option>
              <option value="Todas">Todas as Categorias</option>
            </select>
          </div>

          <div>
            <label className="block app-label mb-1.5">{t('field.percentServices', 'Comissão em Serviços (%)')}</label>
            <input
              type="number"
              min={0}
              max={100}
              value={percent}
              onChange={(e) => setPercent(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-rose-900 focus:outline-none focus:border-rose-800"
            />
          </div>
        </div>

        <div>
          <label className="block app-label mb-1.5">{t('field.percentProducts', 'Comissão em Venda de Produtos / Cosméticos (%)')}</label>
          <input
            type="number"
            min={0}
            max={100}
            value={productSalesPercent}
            onChange={(e) => setProductSalesPercent(Number(e.target.value))}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-slate-900 focus:outline-none focus:border-rose-800"
          />
        </div>
      </form>
    </ResponsiveModal>
  );
};
