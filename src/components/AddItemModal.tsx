import React, { useState } from 'react';
import { ActivityCategory, Traveler, TripItem } from '../types/trip';
import { X, Plus, Sparkles, Utensils, MapPin, Dice5, Camera, Briefcase } from 'lucide-react';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  travelers: Traveler[];
  activeTravelerId: string;
  defaultCategory?: ActivityCategory;
  onAddItem: (item: Omit<TripItem, 'id'>) => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  travelers,
  activeTravelerId,
  defaultCategory = 'comidas',
  onAddItem,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ActivityCategory>(defaultCategory);
  const [suggestedBy, setSuggestedBy] = useState(activeTravelerId);
  const [location, setLocation] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  if (!isOpen) return null;

  const categories: { id: ActivityCategory; label: string; icon: string }[] = [
    { id: 'comidas', label: 'Comidas & Restaurantes', icon: '🍽️' },
    { id: 'lugares', label: 'Lugares para Visitar', icon: '🗺️' },
    { id: 'jogos', label: 'Jogos & Diversão', icon: '🎲' },
    { id: 'fotos', label: 'Missão de Foto', icon: '📸' },
    { id: 'malas', label: 'Bagagem & Preparativos', icon: '🧳' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    onAddItem({
      title: title.trim(),
      description: description.trim(),
      category,
      suggestedBy,
      completed: false,
      location: location.trim() || undefined,
      estimatedCost: estimatedCost.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
      votes: [suggestedBy], // author automatically votes
    });

    setTitle('');
    setDescription('');
    setLocation('');
    setEstimatedCost('');
    setImageUrl('');
    setTagsInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-800 my-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              Adicionar Nova Atividade
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              O que o trio não pode deixar de fazer em Anápolis?
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category selection */}
          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1.5">
              Categoria
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map(cat => {
                const isSelected = category === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-1.5 p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-100/70 dark:bg-amber-950/60 border-amber-400 dark:border-amber-600 text-stone-900 dark:text-stone-100 font-bold shadow-2xs'
                        : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
              Nome da Atividade / Comida / Lugar *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Comer pamonha doce, Ver o lago do Parque Ipiranga..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
              Detalhes / Dica
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Ex: Melhor ir por volta das 17h para pegar o pôr do sol..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Suggester & Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                Quem Sugeriu?
              </label>
              <select
                value={suggestedBy}
                onChange={e => setSuggestedBy(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {travelers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.nickname}) {t.avatar}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                Custo Estimado (opcional)
              </label>
              <input
                type="text"
                value={estimatedCost}
                onChange={e => setEstimatedCost(e.target.value)}
                placeholder="Ex: Gratuito, R$ 25 por pessoa..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Location & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                Localização em Anápolis (opcional)
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Ex: Bairro Jundiaí / Centro"
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                Tags (separadas por vírgula)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="Ex: Típico, Tarde, Imperdível"
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Optional Image URL */}
          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
              URL de Imagem (opcional)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://... ou deixe em branco"
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-2 justify-end pt-3 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-xl shadow-xs"
            >
              Adicionar à Lista
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
