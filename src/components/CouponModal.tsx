import React, { useState } from 'react';
import { X, Tag } from 'lucide-react';
import { Coupon } from '../types';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCoupon: (coupon: Omit<Coupon, 'id'>) => void;
}

export const CouponModal: React.FC<CouponModalProps> = ({ isOpen, onClose, onAddCoupon }) => {
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState('15%');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    onAddCoupon({
      code: code.toUpperCase(),
      description,
      discount,
      usageCount: 0,
      client: 'Disponível para Clientes em Lisboa',
      date: 'Hoje',
      savedValue: 0,
      status: 'Concluído',
    });

    setCode('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Criar Novo Cupão de Desconto</h3>
            <p className="text-xs text-slate-500">Gerar cupões promocionais para campanhas de fidelização</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Código do Cupão</label>
            <div className="relative">
              <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Ex: VERAOLISBOA"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 font-extrabold tracking-wider uppercase outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Descrição da Oferta</label>
            <input
              type="text"
              placeholder="Ex: 15% de desconto em Coloração e Balayage"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Desconto (% ou €)</label>
            <input
              type="text"
              placeholder="Ex: 20% ou 25€ OFF"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-bold transition-all cursor-pointer shadow-xs"
            >
              Ativar Cupão
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
