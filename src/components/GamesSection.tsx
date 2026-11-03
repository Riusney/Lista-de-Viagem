import React, { useState } from 'react';
import { GameMatch, Traveler, TripItem } from '../types/trip';
import { PlayerScoreboard } from '../utils/tripLogic';
import { Trophy, Plus, Dice5, Flame, Calendar, Award, Trash2 } from 'lucide-react';
import { ItemCard } from './ItemCard';

interface GamesSectionProps {
  gameItems: TripItem[];
  matches: GameMatch[];
  travelers: Traveler[];
  activeTravelerId: string;
  scoreboard: PlayerScoreboard[];
  onToggleComplete: (itemId: string) => void;
  onToggleVote: (itemId: string) => void;
  onAddNote: (itemId: string, noteText: string) => void;
  onDeleteNote: (itemId: string, noteId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onAddMatch: (match: Omit<GameMatch, 'id'>) => void;
  onDeleteMatch: (matchId: string) => void;
  onOpenNewItem: () => void;
}

export const GamesSection: React.FC<GamesSectionProps> = ({
  gameItems,
  matches,
  travelers,
  activeTravelerId,
  scoreboard,
  onToggleComplete,
  onToggleVote,
  onAddNote,
  onDeleteNote,
  onDeleteItem,
  onAddMatch,
  onDeleteMatch,
  onOpenNewItem,
}) => {
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [gameName, setGameName] = useState('Uno Selvagem');
  const [winnerId, setWinnerId] = useState(travelers[0]?.id || '');
  const [highlight, setHighlight] = useState('');
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    travelers.forEach(t => {
      initial[t.id] = 0;
    });
    return initial;
  });

  const handleScoreChange = (tId: string, val: string) => {
    const num = parseInt(val, 10);
    setScores(prev => ({ ...prev, [tId]: isNaN(num) ? 0 : num }));
  };

  const handleSaveMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameName.trim()) return;

    const formattedScores = travelers.map(t => ({
      travelerId: t.id,
      score: scores[t.id] || 0,
    }));

    onAddMatch({
      gameName: gameName.trim(),
      date: new Date().toISOString().split('T')[0],
      winnerId: winnerId || travelers[0].id,
      scores: formattedScores,
      highlight: highlight.trim() || undefined,
    });

    setShowMatchModal(false);
    setHighlight('');
  };

  const getLeader = scoreboard[0];

  return (
    <div className="space-y-8">
      {/* Top Banner / Scoreboard of the Trio */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>Copa Anápolis de Jogos do Trio</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
              Placar de Vitórias & Noites de Jogos
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Quem levar mais partidas ganha a sobremesa por conta dos outros dois!
            </p>
          </div>

          <button
            onClick={() => setShowMatchModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-transform active:scale-98 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Partida</span>
          </button>
        </div>

        {/* 3 Travelers Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scoreboard.map((player, idx) => {
            const traveler = travelers.find(t => t.id === player.travelerId);
            const isFirst = idx === 0 && player.totalWins > 0;
            const rankLabel = idx === 0 ? '🥇 1º Lugar' : idx === 1 ? '🥈 2º Lugar' : '🥉 3º Lugar';

            return (
              <div
                key={player.travelerId}
                className={`relative rounded-2xl p-4 sm:p-5 border transition-all ${
                  isFirst
                    ? 'bg-amber-100/70 border-amber-300 shadow-xs ring-1 ring-amber-400/30'
                    : 'bg-white border-stone-200/80'
                }`}
              >
                {isFirst && (
                  <div className="absolute -top-3 right-4 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                    <Flame className="w-3 h-3" /> Atual Líder
                  </div>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center border border-stone-200 shrink-0">
                    {traveler?.avatar || '🎲'}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold text-amber-700 block">
                      {rankLabel}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 truncate">
                      {player.travelerName}
                    </h3>
                    <span className="text-xs text-stone-500 truncate block">
                      {traveler?.role}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-stone-200/60 text-center">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-medium">Vitórias</span>
                    <span className="text-lg font-extrabold text-stone-900 tabular-nums">
                      {player.totalWins}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block font-medium">Jogos</span>
                    <span className="text-lg font-bold text-stone-700 tabular-nums">
                      {player.totalGames}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block font-medium">Aprov.</span>
                    <span className="text-lg font-bold text-amber-700 tabular-nums">
                      {player.winRate}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Checklist of Games Planned */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Dice5 className="w-5 h-5 text-amber-600" />
              <span>Jogos Planejados para a Viagem</span>
            </h3>
            <p className="text-xs text-stone-500">
              Marque como concluído quando a jogatina acontecer!
            </p>
          </div>
          <button
            onClick={onOpenNewItem}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800"
          >
            + Adicionar Jogo à Lista
          </button>
        </div>

        <div className="space-y-3">
          {gameItems.length > 0 ? (
            gameItems.map(item => (
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
            ))
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-400 text-sm">
              Nenhum jogo planejado ainda. Adicione Uno, Catan, Truco ou o jogo preferido do trio!
            </div>
          )}
        </div>
      </div>

      {/* Matches History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <span>Histórico de Partidas Realizadas</span>
          </h3>
          <span className="text-xs text-stone-500">
            {matches.length} partidas registradas
          </span>
        </div>

        <div className="space-y-3">
          {matches.map(match => {
            const winner = travelers.find(t => t.id === match.winnerId);
            return (
              <div
                key={match.id}
                className="bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg font-bold shrink-0">
                    🏆
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-stone-900 text-base">{match.gameName}</h4>
                      <span className="text-xs text-stone-400">· {match.date}</span>
                    </div>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Vencedor: <strong className="text-amber-700">{winner?.name} {winner?.avatar}</strong>
                    </p>
                    {match.highlight && (
                      <p className="text-xs text-stone-500 italic mt-1 bg-stone-50 p-2 rounded-lg border border-stone-200/60">
                        "{match.highlight}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                  <div className="flex items-center gap-2 text-xs">
                    {match.scores.map(s => {
                      const t = travelers.find(tr => tr.id === s.travelerId);
                      return (
                        <span
                          key={s.travelerId}
                          className="bg-stone-100 px-2.5 py-1 rounded-lg font-medium text-stone-700 tabular-nums"
                        >
                          {t?.nickname}: <strong>{s.score}</strong>
                        </span>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => onDeleteMatch(match.id)}
                    className="text-stone-300 hover:text-rose-500 p-1"
                    title="Excluir partida"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Add New Match */}
      {showMatchModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 mb-1">Registrar Nova Partida</h3>
            <p className="text-xs text-stone-500 mb-4">
              Quem venceu a rodada hoje? Guarde no placar da viagem!
            </p>

            <form onSubmit={handleSaveMatch} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Nome do Jogo
                </label>
                <input
                  type="text"
                  required
                  value={gameName}
                  onChange={e => setGameName(e.target.value)}
                  placeholder="Ex: Uno, Catan, Truco, Mario Kart..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Quem Ganhou a Partida? 👑
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {travelers.map(t => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setWinnerId(t.id)}
                      className={`p-2 rounded-xl border text-center text-xs font-bold transition-all ${
                        winnerId === t.id
                          ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <span className="text-lg block">{t.avatar}</span>
                      <span>{t.nickname}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Pontos / Placar Final (opcional)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {travelers.map(t => (
                    <div key={t.id}>
                      <span className="text-[11px] text-stone-500 font-medium block mb-0.5">
                        {t.nickname}
                      </span>
                      <input
                        type="number"
                        value={scores[t.id] ?? 0}
                        onChange={e => handleScoreChange(t.id, e.target.value)}
                        className="w-full px-2 py-1.5 text-xs text-center font-bold rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Momento Engraçado / Destaque da Partida
                </label>
                <input
                  type="text"
                  value={highlight}
                  onChange={e => setHighlight(e.target.value)}
                  placeholder="Ex: Lucas tomou 3 cartas de +4 seguidas e chorou de rir"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowMatchModal(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
                >
                  Salvar no Placar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
