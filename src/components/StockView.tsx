import React, { useState } from 'react';
import { Package, AlertTriangle, Plus, ArrowUpRight, ArrowDownLeft, Truck } from 'lucide-react';
import { Product, StockMovement } from '../types';

interface StockViewProps {
  products: Product[];
  movements: StockMovement[];
  onAddProduct: () => void;
  onAdjustStock: (productId: string, delta: number) => void;
}

export const StockView: React.FC<StockViewProps> = ({
  products,
  movements,
  onAddProduct,
  onAdjustStock,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const categories = ['Todas', 'Cabelo & Capilar', 'Unhas & Gel', 'Estética Facial', 'Descartáveis', 'Dermocosméticos'];

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'Todas') return true;
    return p.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Gestão de Armazém & Estoque</h2>
          <p className="text-xs text-slate-500">Controle de insumos capilares, produtos de unhas e consumo interno em Lisboa.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onAddProduct}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Produto</span>
          </button>
        </div>
      </div>

      {/* Priority Restock Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estoque Crítico</p>
            <p className="text-2xl font-black text-rose-800 mt-1">02</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Produtos abaixo do limite mínimo</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Encomendas Fornecedores</p>
            <p className="text-2xl font-black text-slate-900 mt-1">01</p>
            <p className="text-[11px] text-slate-500 mt-0.5">L'Oréal Portugal em trânsito</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-900 to-slate-950 text-white p-5 rounded-2xl shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-rose-500/30 text-rose-200 text-[10px] font-extrabold uppercase">
              Urgente
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-300" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-white mt-1">Olaplex No.3 (2 un. restantes)</h4>
            <p className="text-[11px] text-rose-200/80 mt-0.5">Sugerido pedido de reposição a fornecedor.</p>
          </div>
          <button
            onClick={onAddProduct}
            className="mt-2 w-full py-1.5 bg-white text-rose-900 font-bold text-xs rounded-lg hover:bg-rose-50 transition-all cursor-pointer text-center"
          >
            Encomendar Reposição
          </button>
        </div>
      </div>

      {/* Main Grid: Products Table + Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-extrabold text-slate-900 text-sm">Catálogo de Produtos em Armazém</h3>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-rose-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-2 px-3">Produto</th>
                  <th className="py-2 px-3">Categoria</th>
                  <th className="py-2 px-3">Estoque</th>
                  <th className="py-2 px-3">Preço €</th>
                  <th className="py-2 px-3 text-right">Ajustar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{p.name}</td>
                    <td className="py-3 px-3 text-slate-500">{p.category}</td>
                    <td className="py-3 px-3 font-extrabold text-slate-900">{p.stock} un.</td>
                    <td className="py-3 px-3 font-bold text-rose-800">{p.price}€</td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onAdjustStock(p.id, -1)}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-rose-100 hover:text-rose-800 text-slate-600 font-bold flex items-center justify-center transition-all cursor-pointer"
                        >
                          -
                        </button>
                        <button
                          onClick={() => onAdjustStock(p.id, 1)}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-600 font-bold flex items-center justify-center transition-all cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Movements */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm">Movimentações do Armazém</h3>
            <div className="space-y-2.5">
              {movements.map((m) => (
                <div key={m.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-xs">
                  <div className={`p-1.5 rounded ${m.type === 'Entrada' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {m.type === 'Entrada' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{m.productName}</p>
                    <p className="text-[11px] text-slate-500">{m.notes}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{m.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
