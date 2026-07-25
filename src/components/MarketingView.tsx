import React from 'react';
import { Megaphone, Gift, Award, TrendingUp, Plus, Tag, CheckCircle2 } from 'lucide-react';
import { MarketingCampaign, Coupon } from '../types';

interface MarketingViewProps {
  campaigns: MarketingCampaign[];
  coupons: Coupon[];
  onToggleCampaignStatus: (id: string) => void;
  onCreateCoupon: () => void;
}

export const MarketingView: React.FC<MarketingViewProps> = ({
  campaigns,
  coupons,
  onToggleCampaignStatus,
  onCreateCoupon,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Marketing & Relacionamento</h2>
          <p className="text-xs text-slate-500">Campanhas SMS/WhatsApp em Lisboa, cupões e retenção de clientes</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onCreateCoupon}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Novo Cupão</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Retenção de Clientes</span>
            <span className="text-emerald-600 font-bold text-[10px]">+14%</span>
          </div>
          <p className="text-2xl font-black text-slate-900">74.2%</p>
          <p className="text-[11px] text-slate-400">Taxa de retorno a 60 dias</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Cupões Resgatados</span>
            <span className="text-emerald-600 font-bold text-[10px]">+18%</span>
          </div>
          <p className="text-2xl font-black text-slate-900">102</p>
          <p className="text-[11px] text-slate-400">Este mês em Lisboa</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Vales-Presente</span>
            <span className="text-emerald-600 font-bold text-[10px]">+8%</span>
          </div>
          <p className="text-2xl font-black text-slate-900">1.450€</p>
          <p className="text-[11px] text-slate-400">Em circulação ativa</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Retorno de Campanhas</span>
            <span className="text-emerald-600 font-bold text-[10px]">+24%</span>
          </div>
          <p className="text-2xl font-black text-slate-900">5.4x</p>
          <p className="text-[11px] text-slate-400">ROI estimado em vendas</p>
        </div>
      </div>

      {/* Main Grid: Campanhas Ativas + Programa de Fidelidade */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-extrabold text-slate-900 text-sm">Campanhas SMS / WhatsApp Ativas</h3>
            <span className="text-xs font-bold text-rose-800">2 Ativas</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {campaigns.map((camp) => (
              <div key={camp.id} className="p-4 rounded-xl border border-slate-200 space-y-3 bg-slate-50/50">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      camp.status === 'Ativo' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {camp.status}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 leading-snug">{camp.title}</h4>
                  </div>
                  <button
                    onClick={() => onToggleCampaignStatus(camp.id)}
                    className="text-xs text-slate-400 hover:text-slate-800 font-semibold cursor-pointer"
                  >
                    {camp.status === 'Ativo' ? 'Pausar' : 'Ativar'}
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-2">{camp.description}</p>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-center text-[10px]">
                  <div>
                    <p className="text-slate-400 font-bold uppercase">Impacto</p>
                    <p className="font-bold text-slate-800">{camp.views} envios</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold uppercase">Conversão</p>
                    <p className="font-bold text-emerald-700">{camp.conversions}%</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold uppercase">Duração</p>
                    <p className="font-bold text-slate-800">{camp.daysRemaining}d resta</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Programa de Fidelização */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm">Programa Élégance VIP</h3>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Nível Standard</p>
                <p className="text-[10px] text-slate-400">Acumula 1 ponto por cada 1€</p>
              </div>
              <span className="font-bold text-slate-700">140 clientes</span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between">
              <div>
                <p className="font-bold text-amber-950">Nível Gold VIP</p>
                <p className="text-[10px] text-amber-800">+300 pontos acumulados</p>
              </div>
              <span className="font-bold text-amber-950">24 clientes VIP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Histórico de Cupões */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm">Histórico de Cupões Resgatados</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2 px-3">Código</th>
                <th className="py-2 px-3">Cliente</th>
                <th className="py-2 px-3">Data</th>
                <th className="py-2 px-3">Desconto €</th>
                <th className="py-2 px-3 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-rose-800" />
                    <span>{c.code}</span>
                  </td>
                  <td className="py-2.5 px-3 font-medium">{c.client}</td>
                  <td className="py-2.5 px-3 text-slate-500">{c.date}</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-700">{c.savedValue}€</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-800">
                    Concluído
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
