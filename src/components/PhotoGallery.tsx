import React, { useState } from 'react';
import { PhotoMemory, Traveler, TripItem } from '../types/trip';
import { Camera, Heart, Plus, MapPin, Trash2, Image as ImageIcon, Sparkles, CheckCircle2 } from 'lucide-react';
import { ItemCard } from './ItemCard';

interface PhotoGalleryProps {
  photos: PhotoMemory[];
  photoItems: TripItem[];
  travelers: Traveler[];
  activeTravelerId: string;
  onAddPhoto: (photo: Omit<PhotoMemory, 'id'>) => void;
  onDeletePhoto: (id: string) => void;
  onToggleLike: (photoId: string) => void;
  onToggleComplete: (itemId: string) => void;
  onToggleVote: (itemId: string) => void;
  onAddNote: (itemId: string, noteText: string) => void;
  onDeleteNote: (itemId: string, noteId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onOpenNewItem: () => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  photoItems,
  travelers,
  activeTravelerId,
  onAddPhoto,
  onDeletePhoto,
  onToggleLike,
  onToggleComplete,
  onToggleVote,
  onAddNote,
  onDeleteNote,
  onDeleteItem,
  onOpenNewItem,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('Anápolis, GO');
  const [takenBy, setTakenBy] = useState(activeTravelerId);
  const [imageUrl, setImageUrl] = useState('');
  const [previewError, setPreviewError] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        setPreviewError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    onAddPhoto({
      title: title.trim(),
      caption: caption.trim() || 'Momento registrado em Anápolis!',
      takenBy,
      date: 'Hoje, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUrl: imageUrl.trim(),
      likes: [activeTravelerId],
      location: location.trim(),
    });

    setTitle('');
    setCaption('');
    setImageUrl('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <Camera className="w-4 h-4 text-amber-600" />
            <span>Mural de Fotos & Memórias</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            Nossos Registros de Anápolis
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Colecione os melhores momentos, comidas e risadas do trio durante a viagem.
          </p>
        </div>

        <button
          onClick={() => {
            setTakenBy(activeTravelerId);
            setShowAddModal(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-transform active:scale-98 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Foto</span>
        </button>
      </div>

      {/* Polaroid Gallery Grid */}
      <div>
        <h3 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
          <span>Fotos Reveladas do Trio</span>
          <span className="text-xs text-stone-500 font-normal">
            ({photos.length} lembranças)
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map(photo => {
            const author = travelers.find(t => t.id === photo.takenBy);
            const isLiked = photo.likes.includes(activeTravelerId);

            return (
              <div
                key={photo.id}
                className="bg-white p-3.5 pb-4 rounded-2xl shadow-xs border border-stone-200 hover:shadow-md transition-all flex flex-col group"
              >
                {/* Photo frame */}
                <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-stone-100 mb-3 border border-stone-100">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <button
                      onClick={() => onDeletePhoto(photo.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-rose-600 text-white p-1.5 rounded-lg text-xs"
                      title="Remover foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Caption & Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm leading-snug">
                      {photo.title}
                    </h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {photo.caption}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <div className="text-stone-500 flex items-center gap-1 text-[11px]">
                      <span>{author?.avatar}</span>
                      <span className="font-medium text-stone-700">{author?.name}</span>
                      <span>·</span>
                      <span>{photo.date}</span>
                    </div>

                    <button
                      onClick={() => onToggleLike(photo.id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-colors ${
                        isLiked
                          ? 'bg-rose-50 text-rose-600'
                          : 'text-stone-500 hover:bg-stone-100'
                      }`}
                      title="Curtir esta foto"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`}
                      />
                      <span>{photo.likes.length}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Photo Missions / Checklist */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Missões Fotográficas Planejadas</span>
            </h3>
            <p className="text-xs text-stone-500">
              Fotos que combinamos de não esquecer de tirar em Anápolis!
            </p>
          </div>
          <button
            onClick={onOpenNewItem}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800"
          >
            + Nova Missão de Foto
          </button>
        </div>

        <div className="space-y-3">
          {photoItems.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              travelers={travelers}
              activeTravelerId={activeTravelerId}
              onToggleComplete={onToggleComplete}
              onToggleVote={onToggleVote}
              onAddNote={onAddNote}
              onDeleteNote={onDeleteNote}
              onDeleteItem={onDeleteItem}
            />
          ))}
        </div>
      </div>

      {/* Modal: Add Photo */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 mb-1">
              Adicionar Nova Foto ao Mural
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Envie uma foto do seu dispositivo ou cole um link de imagem.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Título da Foto
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ex: Pôr do sol no morro, Café da manhã..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Legenda / História Engraçada
                </label>
                <textarea
                  rows={2}
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  placeholder="Ex: Esse foi o momento exato em que a Bia deixou o pastel cair..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Quem Tirou a Foto?
                  </label>
                  <select
                    value={takenBy}
                    onChange={e => setTakenBy(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    {travelers.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.nickname})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Localização em Anápolis
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="Ex: Parque Ipiranga"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Upload or URL */}
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Foto (Carregar Arquivo ou URL)
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full text-xs text-stone-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 cursor-pointer"
                  />
                  <div className="text-[11px] text-stone-400 text-center">ou cole um link:</div>
                  <input
                    type="url"
                    value={imageUrl.startsWith('data:') ? '' : imageUrl}
                    onChange={e => {
                      setImageUrl(e.target.value);
                      setPreviewError(false);
                    }}
                    placeholder="https://... ou escolha um arquivo acima"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {imageUrl && (
                  <div className="mt-2 rounded-xl overflow-hidden h-32 border border-stone-200 bg-stone-50">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setPreviewError(true)}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!imageUrl.trim() || !title.trim()}
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-xl shadow-xs"
                >
                  Publicar no Mural
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
