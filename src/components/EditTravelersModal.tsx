import React, { useState } from 'react';
import { Traveler } from '../types/trip';
import { X, Users, Sparkles, Check } from 'lucide-react';

interface EditTravelersModalProps {
  isOpen: boolean;
  onClose: () => void;
  travelers: Traveler[];
  onSaveTravelers: (updated: Traveler[]) => void;
}

const EMOJI_OPTIONS = ['🤠', '📸', '🌸', '😎', '🍕', '🎮', '🚗', '🍹', '🏕️', '🧁', '⚽', '🎒'];

export const EditTravelersModal: React.FC<EditTravelersModalProps> = ({
  isOpen,
  onClose,
  travelers,
  onSaveTravelers,
}) => {
  const [editedTravelers, setEditedTravelers] = useState<Traveler[]>(travelers);

  if (!isOpen) return null;

  const handleChange = (id: string, field: keyof Traveler, value: string) => {
    setEditedTravelers(prev =>
      prev.map(t => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveTravelers(editedTravelers);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-stone-200 my-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" />
              <span>Personalizar os 3 Viajantes</span>
            </h3>
            <p className="text-xs text-stone-500">
              Coloque os nomes reais dos 3 amigos que vão para Anápolis!
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            {editedTravelers.map((traveler, index) => (
              <div
                key={traveler.id}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                    Viajante {index + 1}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      required
                      value={traveler.name}
                      onChange={e => handleChange(traveler.id, 'name', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Apelido no App
                    </label>
                    <input
                      type="text"
                      required
                      value={traveler.nickname}
                      onChange={e => handleChange(traveler.id, 'nickname', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Papel / Função no Trio
                    </label>
                    <input
                      type="text"
                      value={traveler.role}
                      onChange={e => handleChange(traveler.id, 'role', e.target.value)}
                      placeholder="Ex: Motorista, DJ..."
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                    />
                  </div>
                </div>

                {/* Emoji choices */}
                <div>
                  <span className="text-[11px] font-semibold text-stone-500 block mb-1">
                    Escolha um Avatar:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {EMOJI_OPTIONS.map(em => (
                      <button
                        type="button"
                        key={em}
                        onClick={() => handleChange(traveler.id, 'avatar', em)}
                        className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all ${
                          traveler.avatar === em
                            ? 'bg-amber-500 text-white scale-110 shadow-xs'
                            : 'bg-white border border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 justify-end pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
