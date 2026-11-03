import React from 'react';
import { Traveler } from '../types/trip';
import { TripStats } from '../utils/tripLogic';
import { CheckCircle2, Sparkles, MapPin, Calendar, Heart } from 'lucide-react';

interface HeroBannerProps {
  stats: TripStats;
  travelers: Traveler[];
  activeTravelerId: string;
  onSelectTraveler: (id: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  stats,
  travelers,
  activeTravelerId,
  onSelectTraveler,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-900 via-stone-900 to-stone-950 text-white shadow-md mb-8">
      {/* Background visual image with overlay */}
      <div className="absolute inset-0 z-0 opacity-35 mix-blend-overlay">
        <img
          src="/src/assets/images/anapolis_morro_capuava_1793729935047.jpg"
          alt="Anápolis Goiás"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-amber-300 uppercase mb-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Anápolis · Goiás
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Roteiro Oficial do Trio
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3 text-balance">
            Nossa Viagem dos Sonhos em Anápolis
          </h2>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed mb-4">
            Comidas típicas para devorar, parques e mirantes para desbravar, memórias fotográficas e noites de jogos memoráveis entre 3 amigos.
          </p>

          {/* Progress Bar */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 max-w-md">
            <div className="flex items-center justify-between text-xs font-medium mb-1.5">
              <span className="text-stone-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Progresso da Viagem
              </span>
              <span className="font-bold text-amber-300 tabular-nums">
                {stats.completedItems} de {stats.totalItems} concluídos ({stats.overallPercentage}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.max(5, stats.overallPercentage)}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3 Travelers Cards */}
        <div className="w-full md:w-auto flex flex-row md:flex-col gap-2.5 shrink-0">
          <div className="text-xs text-stone-300 font-semibold mb-0.5 hidden md:block">
            Os 3 Aventureiros:
          </div>
          <div className="grid grid-cols-3 md:grid-cols-1 gap-2 w-full">
            {travelers.map(t => {
              const contribution = stats.travelerContributions[t.id] || { suggested: 0, completed: 0 };
              const isCurrent = t.id === activeTravelerId;
              return (
                <button
                  key={t.id}
                  onClick={() => onSelectTraveler(t.id)}
                  className={`flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-1.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl border text-center sm:text-left transition-all ${
                    isCurrent
                      ? 'bg-white/20 border-amber-400/80 shadow-xs ring-1 ring-amber-400/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                  title={`Filtrar ou agir como ${t.name}`}
                >
                  <div className="text-xl sm:text-2xl shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-black/30 flex items-center justify-center">
                    {t.avatar}
                  </div>
                  <div className="min-w-0 w-full sm:w-auto">
                    <div className="flex items-center justify-center sm:justify-start gap-1">
                      <span className="text-xs sm:text-sm font-bold text-white truncate">
                        {t.nickname || t.name}
                      </span>
                      {isCurrent && (
                        <span className="text-[9px] bg-amber-400/30 text-amber-200 px-1 rounded-sm font-semibold hidden sm:inline">
                          você
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-stone-300 truncate">
                      {contribution.completed} feitos
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
