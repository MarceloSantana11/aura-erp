import React, { useState } from 'react';
import { X, Package, Tag, Building } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onAddProduct }) => {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState<Product['category']>('Cabelo & Capilar');
  const [stock, setStock] = useState('20');
  const [minStock, setMinStock] = useState('5');
  const [costPrice, setCostPrice] = useState('16');
  const [price, setPrice] = useState('32');
  const [supplier, setSupplier] = useState("L'Oréal Portugal");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim()) return;

    const stockNum = parseInt(stock) || 0;
    const minStockNum = parseInt(minStock) || 0;

    let status: Product['status'] = 'Normal';
    if (stockNum === 0) status = 'Estoque Baixo';
    else if (stockNum <= minStockNum) status = 'Crítico';
    else if (stockNum > minStockNum * 3) status = 'Abundante';

    onAddProduct({
      sku: sku.trim(),
      name,
      category,
      stock: stockNum,
      minStock: minStockNum,
      status,
      costPrice: parseFloat(costPrice) || 0,
      price: parseFloat(price) || 0,
      supplier,
    });

    setName('');
    setSku('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Novo Produto de Armazém</h3>
            <p className="text-xs text-slate-500">Registar cosméticos, vernizes ou champôs em Lisboa</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Nome do Produto</label>
            <input
              type="text"
              required
              placeholder="Ex: Mascara Kérastase Nutritive 500ml"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">SKU / Referência</label>
            <input
              type="text"
              required
              placeholder="Ex: KER-NUT-500"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none cursor-pointer"
            >
              <option value="Cabelo & Capilar">Cabelo & Capilar</option>
              <option value="Unhas & Gel">Unhas & Gel</option>
              <option value="Estética Facial">Estética Facial</option>
              <option value="Descartáveis">Descartáveis</option>
              <option value="Dermocosméticos">Dermocosméticos</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Quantidade em Armazém</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Mínimo para Alerta</label>
              <input
                type="number"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Custo (€)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Preço de venda (€)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Fornecedor</label>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
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
              Registar Produto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
