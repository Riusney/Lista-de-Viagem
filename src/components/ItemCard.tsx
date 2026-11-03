import React, { useState } from 'react';
import { TripItem, Traveler } from '../types/trip';
import {
  Check,
  MapPin,
  DollarSign,
  Heart,
  MessageSquare,
  Trash2,
  Send,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ItemCardProps {
  item: TripItem;
  travelers: Traveler[];
  activeTravelerId: string;
  onToggleComplete: (itemId: string) => void;
  onToggleVote: (itemId: string) => void;
  onAddNote: (itemId: string, noteText: string) => void;
  onDeleteNote: (itemId: string, noteId: string) => void;
  onDeleteItem: (itemId: string) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  travelers,
  activeTravelerId,
  onToggleComplete,
  onToggleVote,
  onAddNote,
  onDeleteNote,
  onDeleteItem,
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');

  const suggester = travelers.find(t => t.id === item.suggestedBy) || travelers[0];
  const completer = item.completedBy ? travelers.find(t => t.id === item.completedBy) : null;
  const hasVoted = item.votes && item.votes.includes(activeTravelerId);
  const voteCount = item.votes ? item.votes.length : 0;

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(item.id, newNoteText.trim());
    setNewNoteText('');
  };

  const categoryIcons: Record<string, string> = {
    comidas: '🍽️',
    lugares: '🗺️',
    jogos: '🎲',
    fotos: '📸',
    malas: '🧳',
  };

  const categoryLabels: Record<string, string> = {
    comidas: 'Gastronomia',
    lugares: 'Passeio',
    jogos: 'Jogatina',
    fotos: 'Foto da Viagem',
    malas: 'Bagagem',
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 bg-white ${
        item.completed
          ? 'border-emerald-200/80 bg-emerald-50/20 shadow-xs'
          : 'border-stone-200/80 hover:border-amber-300 shadow-xs hover:shadow-sm'
      }`}
    >
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-4">
        {/* Accessible Hitbox Checkbox button (>= 44x44px) */}
        <button
          type="button"
          role="checkbox"
          aria-checked={item.completed}
          aria-label={`Marcar '${item.title}' como ${item.completed ? 'não concluído' : 'concluído'}`}
          onClick={() => onToggleComplete(item.id)}
          className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
            item.completed
              ? 'bg-emerald-500 text-white shadow-xs scale-102'
              : 'border-2 border-stone-300 hover:border-amber-500 bg-stone-50 text-transparent hover:text-stone-300'
          }`}
        >
          <Check className={`w-6 h-6 stroke-[3] ${item.completed ? 'opacity-100' : 'opacity-0 hover:opacity-50'}`} />
        </button>

        {/* Content Body */}
        <div className="flex-1 min-w-0 w-full">
          {/* Header Row: Category indicator & Title */}
          <div className="flex items-start justify-between gap-3 mb-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-1">
              <span className="font-semibold text-stone-700 flex items-center gap-1">
                <span>{categoryIcons[item.category] || '📍'}</span>
                <span>{categoryLabels[item.category] || item.category}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>Sugerido por {suggester ? suggester.name : 'Alguém'} {suggester?.avatar}</span>
            </div>

            {/* Delete button */}
            <button
              onClick={() => onDeleteItem(item.id)}
              className="text-stone-300 hover:text-rose-500 p-1 rounded-md transition-colors shrink-0"
              title="Excluir item da lista"
              aria-label={`Excluir item ${item.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <h3
            className={`text-base sm:text-lg font-bold tracking-tight text-stone-900 transition-all ${
              item.completed ? 'line-through text-stone-400' : ''
            }`}
          >
            {item.title}
          </h3>

          <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
            {item.description}
          </p>

          {/* Optional Image Preview */}
          {item.imageUrl && (
            <div className="mt-3 rounded-xl overflow-hidden max-h-48 w-full border border-stone-200">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-48 object-cover hover:scale-101 transition-transform"
                loading="lazy"
              />
            </div>
          )}

          {/* Metadata Row: Location, Cost, Completed Badge */}
          <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-stone-500">
            {item.location && (
              <span className="flex items-center gap-1 text-stone-600 font-medium">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate max-w-[220px]">{item.location}</span>
              </span>
            )}

            {item.estimatedCost && (
              <span className="flex items-center gap-1 text-stone-600 font-medium">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{item.estimatedCost}</span>
              </span>
            )}

            {item.completed && completer && (
              <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded-md">
                <span>Feito por {completer.name} {completer.avatar}</span>
              </span>
            )}
          </div>

          {/* Action Row: Upvote / "Eu quero!", Notes Toggle */}
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* Vote Button: 44px min touch target */}
              <button
                onClick={() => onToggleVote(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold min-h-[36px] transition-colors ${
                  hasVoted
                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80 border border-stone-200/60'
                }`}
                title="Votar que você quer fazer essa atividade!"
              >
                <Heart
                  className={`w-3.5 h-3.5 ${hasVoted ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`}
                />
                <span>
                  {hasVoted ? 'Quero muito!' : 'Eu quero!'} ({voteCount}/3)
                </span>
              </button>

              {/* Notes Button */}
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Notas ({item.notes ? item.notes.length : 0})</span>
                {showNotes ? (
                  <ChevronUp className="w-3 h-3 ml-0.5" />
                ) : (
                  <ChevronDown className="w-3 h-3 ml-0.5" />
                )}
              </button>
            </div>

            {/* Voters Avatars indicator */}
            {item.votes && item.votes.length > 0 && (
              <div className="flex items-center -space-x-1" title="Quem votou a favor">
                {item.votes.map(voterId => {
                  const voter = travelers.find(t => t.id === voterId);
                  if (!voter) return null;
                  return (
                    <span
                      key={voterId}
                      className="w-6 h-6 rounded-full bg-stone-100 border border-white flex items-center justify-center text-xs shadow-2xs"
                      title={`${voter.name} quer ir!`}
                    >
                      {voter.avatar}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notes Accordion */}
          {showNotes && (
            <div className="mt-3 pt-3 border-t border-stone-100/80">
              <div className="space-y-2 mb-3">
                {item.notes && item.notes.length > 0 ? (
                  item.notes.map(note => {
                    const noteAuthor = travelers.find(t => t.id === note.authorId);
                    return (
                      <div
                        key={note.id}
                        className="bg-stone-50 rounded-xl p-2.5 text-xs border border-stone-200/60 flex items-start justify-between gap-2"
                      >
                        <div>
                          <div className="font-semibold text-stone-800 flex items-center gap-1">
                            <span>{noteAuthor ? noteAuthor.name : 'Viajante'} {noteAuthor?.avatar}</span>
                          </div>
                          <p className="text-stone-600 mt-0.5">{note.text}</p>
                        </div>
                        <button
                          onClick={() => onDeleteNote(item.id, note.id)}
                          className="text-stone-400 hover:text-rose-500 p-0.5"
                          title="Remover anotação"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-stone-400 italic">
                    Nenhuma dica ou anotação ainda. Deixe um recado para o trio abaixo!
                  </p>
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleNoteSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={e => setNewNoteText(e.target.value)}
                  placeholder="Ex: Pedir pamonha sem pimenta / Levar agasalho..."
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl flex items-center gap-1 shrink-0"
                >
                  <Send className="w-3 h-3" />
                  <span>Salvar</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
