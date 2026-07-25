import React, { useState } from 'react';
import { TrendingUp, Filter, Download, ArrowUpRight, ArrowDownRight, CheckCircle, Clock, Award, Euro } from 'lucide-react';
import { ProfessionalCommission } from '../types';

interface FinancialViewProps {
  commissions: ProfessionalCommission[];
  onUpdateCommissionStatus: (id: string, newStatus: 'Pago' | 'Processando' | 'Pendente') => void;
}

export const FinancialView: React.FC<FinancialViewProps> = ({
  commissions,
  onUpdateCommissionStatus,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('Todos');

  const filteredCommissions = commissions.filter(com => {
    if (filterStatus === 'Todos') return true;
    return com.status === filterStatus;
  });

  const totalCommissions = commissions.reduce((acc, c) => acc + c.commissionValue, 0);

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Gestão Financeira & Comissões</h2>
          <p className="text-xs text-slate-500">Relatório consolidado de receitas em Lisboa e repasses à equipa</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs">
            <Download className="w-3.5 h-3.5 text-white" />
            <span>Exportar Relatório PDF</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Entradas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Receita Bruta Mês</span>
            <span className="flex items-center gap-0.5 text-emerald-600 font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12.5%
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900">18.450,00€</p>
          <p className="text-[11px] text-slate-400">Julho de 2026</p>
        </div>

        {/* Saídas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Despesas Operacionais</span>
            <span className="flex items-center gap-0.5 text-rose-600 font-bold">
              <ArrowDownRight className="w-3.5 h-3.5" /> +3.2%
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900">5.820,00€</p>
          <p className="text-[11px] text-slate-400">Armazém + Renda + Energia</p>
        </div>

        {/* Comissões */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Comissões Devidas</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">
              Pendente
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900">{totalCommissions.toFixed(2)}€</p>
          <p className="text-[11px] text-slate-400">Processamento em curso</p>
        </div>

        {/* Lucro Líquido */}
        <div className="bg-rose-900 text-white p-5 rounded-2xl shadow-md space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold text-rose-200 uppercase tracking-wider">
            <span>Resultado Líquido</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">
              Margem ~58%
            </span>
          </div>
          <p className="text-2xl font-black tracking-tight">10.710,00€</p>
          <p className="text-[11px] text-rose-200">Após dedução de IVA (23%) e repasses</p>
        </div>
      </div>

      {/* Main Grid: Ranking + Detalhamento de Repasses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ranking de Profissionais */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Faturação por Profissional</h3>
              <p className="text-xs text-slate-400">Desempenho este mês</p>
            </div>
            <Award className="w-5 h-5 text-amber-500" />
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150" alt="Dra. Helena" className="w-8 h-8 rounded-full object-cover border border-amber-400" />
                <div>
                  <p className="font-bold text-slate-900">Dra. Helena Silva</p>
                  <p className="text-[10px] text-slate-500">Master Colorist</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-amber-900">2.840€</p>
                <p className="text-[10px] font-bold text-amber-700">1º Lugar</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150" alt="Beatriz" className="w-8 h-8 rounded-full object-cover border border-slate-300" />
                <div>
                  <p className="font-bold text-slate-900">Beatriz Santos</p>
                  <p className="text-[10px] text-slate-500">Nail Artist Senior</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-slate-900">1.420€</p>
                <p className="text-[10px] font-semibold text-slate-500">2º Lugar</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detalhamento de Repasses */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Detalhamento de Comissões</h3>
              <p className="text-xs text-slate-400">Valores apurados por atendimento</p>
            </div>
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
              {['Todos', 'Pago', 'Processando', 'Pendente'].map(st => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    filterStatus === st
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-2 px-3">Profissional</th>
                  <th className="py-2 px-3">Procedimento</th>
                  <th className="py-2 px-3">Valor Serv.</th>
                  <th className="py-2 px-3">Comissão</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredCommissions.map((com) => (
                  <tr key={com.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-800 flex items-center gap-2">
                      <img src={com.avatar} alt={com.name} className="w-6 h-6 rounded-full object-cover" />
                      <span>{com.name}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{com.procedure}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{com.totalValue}€</td>
                    <td className="py-3 px-3 font-black text-rose-800">{com.commissionValue}€ ({com.commissionPercent}%)</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        com.status === 'Pago'
                          ? 'bg-emerald-50 text-emerald-700'
                          : com.status === 'Processando'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {com.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {com.status !== 'Pago' && (
                        <button
                          onClick={() => onUpdateCommissionStatus(com.id, 'Pago')}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold rounded-lg text-[10px] transition-all cursor-pointer"
                        >
                          Marcar Pago
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
