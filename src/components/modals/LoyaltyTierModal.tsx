import React, { useState, useEffect } from 'react';
import { X, Trophy, Check, AlertTriangle } from 'lucide-react';
import { LoyaltyTier } from '../../types';
import { Button } from '../ui/Button';

interface LoyaltyTierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tier: Omit<LoyaltyTier, 'id'> | LoyaltyTier) => void;
  initialData?: LoyaltyTier | null;
  existingOrders: number[];
}

export const LoyaltyTierModal: React.FC<LoyaltyTierModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  existingOrders,
}) => {
  const isEdit = !!initialData;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState<number>(1);
  const [minSpend, setMinSpend] = useState<number>(0);
  const [minVisits, setMinVisits] = useState<number>(0);
  const [minPoints, setMinPoints] = useState<number>(0);
  const [combinationMode, setCombinationMode] = useState<'spend_or_visits' | 'spend_and_visits' | 'manual'>('spend_or_visits');
  const [color, setColor] = useState('bg-slate-100 text-slate-800 border-slate-300');
  const [automaticProgression, setAutomaticProgression] = useState(true);
  const [allowRegression, setAllowRegression] = useState(false);
  const [benefitsText, setBenefitsText] = useState('');
  const [status, setStatus] = useState<'Ativo' | 'Inativo'>('Ativo');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setOrder(initialData.order || 1);
      setMinSpend(initialData.minSpend || 0);
      setMinVisits(initialData.minVisits || 0);
      setMinPoints(initialData.minPoints || 0);
      setCombinationMode(initialData.combinationMode || 'spend_or_visits');
      setColor(initialData.color || 'bg-slate-100 text-slate-800 border-slate-300');
      setAutomaticProgression(initialData.automaticProgression !== false);
      setAllowRegression(initialData.allowRegression === true);
      setBenefitsText((initialData.benefits || []).join('\n'));
      setStatus(initialData.status === 'Inativo' ? 'Inativo' : 'Ativo');
    } else {
      setName('');
      setDescription('');
      setOrder(existingOrders.length ? Math.max(...existingOrders) + 1 : 1);
      setMinSpend(0);
      setMinVisits(0);
      setMinPoints(0);
      setCombinationMode('spend_or_visits');
      setColor('bg-rose-50 text-rose-900 border-rose-300');
      setAutomaticProgression(true);
      setAllowRegression(false);
      setBenefitsText('');
      setStatus('Ativo');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const colorPresets = [
    { label: 'Cinza Neutro', class: 'bg-slate-100 text-slate-800 border-slate-300' },
    { label: 'Bronze Ébano', class: 'bg-amber-100 text-amber-900 border-amber-300' },
    { label: 'Prata Fria', class: 'bg-slate-200 text-slate-800 border-slate-400' },
    { label: 'Ouro Nobre', class: 'bg-yellow-100 text-yellow-900 border-yellow-400' },
    { label: 'Platina Cyan', class: 'bg-cyan-100 text-cyan-900 border-cyan-400' },
    { label: 'Diamante Violeta', class: 'bg-purple-100 text-purple-900 border-purple-400' },
    { label: 'Rose Gold Signature', class: 'bg-rose-100 text-rose-950 border-rose-300' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('O nome do nível é obrigatório.');
      return;
    }
    if (minSpend < 0 || minVisits < 0) {
      setError('Os valores mínimos (faturação e visitas) não podem ser negativos.');
      return;
    }
    if (order > 1 && minSpend === 0 && minVisits === 0 && combinationMode !== 'manual') {
      setError('Níveis superiores a "Cliente novo" exigem pelo menos um critério de faturação ou visitas.');
      return;
    }

    const benefits = benefitsText
      .split('\n')
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    const payload = {
      ...(initialData ? { id: initialData.id } : {}),
      name: name.trim(),
      description: description.trim(),
      order,
      minSpend,
      minVisits,
      minPoints,
      combinationMode,
      color,
      automaticProgression,
      allowRegression,
      benefits,
      status,
    };

    onSave(payload as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-100 text-rose-800">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                {isEdit ? 'Editar Nível de Cliente' : 'Criar Novo Nível de Cliente'}
              </h3>
              <p className="text-xs text-slate-500">Defina os critérios e benefícios de fidelização</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Nível *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Diamante VIP, Club Signature..."
              className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-rose-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Descrição Comercial</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Reservado a clientes de alto valor com visitas frequentes"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-rose-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ordem / Posição</label>
              <input
                type="number"
                min={1}
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-rose-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-rose-800"
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
          </div>

          {/* Criteria Section */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Regras e Critérios de Qualificação
            </h4>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Lógica de Combinação de Critérios
              </label>
              <select
                value={combinationMode}
                onChange={(e) => setCombinationMode(e.target.value as any)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-rose-800"
              >
                <option value="spend_or_visits">
                  Atingir Valor Gasto (€) OU Número de Visitas
                </option>
                <option value="spend_and_visits">
                  Atingir Valor Gasto (€) E Número de Visitas simultaneamente
                </option>
                <option value="manual">Apenas Atribuição Manual pelo Gestor</option>
              </select>
            </div>

            {combinationMode !== 'manual' && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Valor Mínimo Gasto (€)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    value={minSpend}
                    onChange={(e) => setMinSpend(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-rose-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Número Mínimo de Visitas
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={minVisits}
                    onChange={(e) => setMinVisits(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-rose-800"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2 pt-2 border-t border-slate-200/80">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={automaticProgression}
                  onChange={(e) => setAutomaticProgression(e.target.checked)}
                  className="rounded border-slate-300 text-rose-800 focus:ring-rose-800"
                />
                Permitir progressão automática após atingir o critério
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={allowRegression}
                  onChange={(e) => setAllowRegression(e.target.checked)}
                  className="rounded border-slate-300 text-rose-800 focus:ring-rose-800"
                />
                Permitir regressão automática por falta de visitas recentes
              </label>
            </div>
          </div>

          {/* Color Badges */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Estilo Visual e Badge
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {colorPresets.map((preset) => (
                <button
                  key={preset.class}
                  type="button"
                  onClick={() => setColor(preset.class)}
                  className={`p-2.5 text-xs rounded-xl border font-bold text-left transition-all flex items-center justify-between cursor-pointer ${
                    preset.class
                  } ${color === preset.class ? 'ring-2 ring-rose-800 shadow-xs' : 'opacity-85 hover:opacity-100'}`}
                >
                  <span className="truncate">{preset.label}</span>
                  {color === preset.class && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                </button>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Benefícios e Vantagens Exclusivas (1 por linha)
            </label>
            <textarea
              rows={3}
              value={benefitsText}
              onChange={(e) => setBenefitsText(e.target.value)}
              placeholder="1.5 pontos por cada 1€ gasto&#10;Agendamento prioritário no fim de semana&#10;Desconto de 10% em produtos"
              className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:border-rose-800"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="ghost" onClick={onClose} type="button">
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {isEdit ? 'Guardar Alterações' : 'Criar Nível'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
