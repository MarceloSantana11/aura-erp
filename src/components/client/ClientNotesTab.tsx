import React, { useState } from 'react';
import { FileText, Plus, Pin, ShieldAlert, Sparkles, User, Tag } from 'lucide-react';
import { Client, ClientNoteItem } from '../../types';
import { Button } from '../ui/Button';
import { useOperational } from '../../context/OperationalContext';

interface ClientNotesTabProps {
  client: Client;
  onAddNote?: (note: Omit<ClientNoteItem, 'id' | 'createdAt'>) => void;
}

export const ClientNotesTab: React.FC<ClientNotesTabProps> = ({ client, onAddNote }) => {
  const { showToast } = useOperational();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [content, setContent] = useState('');
  const [noteType, setNoteType] = useState<ClientNoteItem['type']>('Técnica');
  const [isPinned, setIsPinned] = useState(false);

  const notesList = client.detailedNotes || [];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (onAddNote) {
      onAddNote({
        clientId: client.id,
        author: 'Recepção / Operador',
        content: content.trim(),
        type: noteType,
        isPinned,
      });
    }

    showToast('Nota Adicionada', 'A observação foi anexada ao perfil da cliente com sucesso.', 'success');
    setContent('');
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Header & New Note Toggle */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <h3 className="font-extrabold text-xs text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-rose-800" />
            Observações Técnicas, Alertas & Registos
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">
            Fórmulas, sensibilidades e preferências preservadas para toda a equipa.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Nova Nota
        </Button>
      </div>

      {/* Add Form */}
      {isFormOpen && (
        <form
          onSubmit={handleFormSubmit}
          className="p-4 bg-white border border-rose-200 rounded-2xl shadow-sm space-y-3 text-xs animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900">Nova Nota no Perfil 360º</h4>
            <label className="flex items-center gap-1.5 font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="rounded text-rose-800 focus:ring-rose-800"
              />
              <Pin className="w-3.5 h-3.5 text-amber-500" />
              Fixar como Alerta Principal
            </label>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Categoria
            </label>
            <select
              value={noteType}
              onChange={(e) => setNoteType(e.target.value as ClientNoteItem['type'])}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-900"
            >
              <option value="Técnica">Técnica (Fórmula / Procedimento)</option>
              <option value="Alerta">Alerta (Alergia / Restrição)</option>
              <option value="Preferência">Preferência Pessoal</option>
              <option value="Geral">Geral / Atendimento</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Conteúdo da Observação
            </label>
            <textarea
              required
              rows={3}
              placeholder="Descreva detalhadamente a fórmula, observação ou instrução..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-800/20"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-rose-900 text-white font-bold"
            >
              Guardar Nota
            </button>
          </div>
        </form>
      )}

      {/* Primary General Note if exists */}
      {client.notes && (
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-1 text-xs">
          <div className="flex items-center gap-1.5 text-amber-950 font-bold">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Nota Geral do Cadastro:</span>
          </div>
          <p className="text-slate-800 font-medium pl-5">"{client.notes}"</p>
        </div>
      )}

      {/* Notes List */}
      {notesList.length === 0 ? (
        <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center text-slate-500 space-y-2">
          <FileText className="w-8 h-8 text-rose-800 mx-auto" />
          <p className="font-bold text-slate-800 text-xs">Nenhuma nota técnica registada</p>
          <p className="text-[11px]">Adicione notas para registar diagnósticos capilares ou fórmulas.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notesList.map((note) => (
            <div
              key={note.id}
              className={`p-4 rounded-2xl border transition-all text-xs space-y-2 ${
                note.isPinned
                  ? 'bg-amber-50/40 border-amber-200/90 shadow-2xs'
                  : 'bg-white border-slate-200/90 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {note.isPinned && <Pin className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                  <span
                    className={`px-2 py-0.5 rounded-full font-extrabold text-[10px] ${
                      note.type === 'Técnica'
                        ? 'bg-rose-100 text-rose-950'
                        : note.type === 'Alerta'
                        ? 'bg-amber-100 text-amber-950'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {note.type}
                  </span>
                  <span className="font-bold text-slate-900">{note.author}</span>
                </div>

                <span className="text-[10px] text-slate-400 font-medium">{note.createdAt}</span>
              </div>

              <p className="text-slate-800 font-medium leading-relaxed">{note.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
