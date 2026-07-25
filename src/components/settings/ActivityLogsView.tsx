import React, { useState } from 'react';
import { History, Filter, Search, User, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';

export const ActivityLogsView: React.FC = () => {
  const { activityLogs } = useOperational();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntityType, setSelectedEntityType] = useState<string>('all');

  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.reason && log.reason.toLowerCase().includes(searchTerm.toLowerCase())) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      selectedEntityType === 'all' || log.entityType === selectedEntityType;

    return matchesSearch && matchesType;
  });

  const getEntityBadge = (type: string) => {
    switch (type) {
      case 'client':
        return <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">Cliente</span>;
      case 'appointment':
        return <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold">Agendamento</span>;
      case 'tier':
        return <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">Nível / Fidelização</span>;
      case 'businessHours':
        return <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold">Horários</span>;
      case 'product':
        return <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">Estoque</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-bold">{type}</span>;
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar histórico..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-rose-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={selectedEntityType}
            onChange={(e) => setSelectedEntityType(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-rose-800 cursor-pointer"
          >
            <option value="all">Todas as Áreas</option>
            <option value="client">Clientes & Níveis</option>
            <option value="appointment">Agendamentos</option>
            <option value="tier">Regras de Nível</option>
            <option value="businessHours">Horário de Funcionamento</option>
            <option value="product">Estoque & Produtos</option>
          </select>
        </div>
      </div>

      {/* Audit Trail List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-rose-800" />
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Auditoria de Operações & Registo de Atividades ({filteredLogs.length})
            </h4>
          </div>
          <span className="text-[11px] text-slate-400 font-bold">Segurança e Rastreabilidade</span>
        </div>

        {filteredLogs.length === 0 ? (
          <p className="text-xs text-slate-400 italic p-8 text-center">
            Nenhum registo encontrado para os filtros selecionados.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50/80 transition-colors space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getEntityBadge(log.entityType)}
                    <span className="text-xs font-extrabold text-slate-900">{log.action}</span>
                    <span className="text-[11px] text-slate-400 font-mono">#{log.entityId}</span>
                  </div>

                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {log.createdAt}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 font-medium">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Executado por: <strong>{log.userName}</strong></span>
                  </div>

                  {log.reason && (
                    <span className="text-[11px] italic font-medium text-slate-500">
                      Motivo: "{log.reason}"
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
