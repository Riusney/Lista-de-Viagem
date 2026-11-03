import React from 'react';
import { Traveler } from '../types/trip';
import { CheckCircle2, Sparkles, UserCircle, Plus, Users, Download, Upload } from 'lucide-react';

interface HeaderProps {
  tripName: string;
  destination: string;
  travelers: Traveler[];
  activeTravelerId: string;
  onSelectActiveTraveler: (id: string) => void;
  onOpenNewItem: () => void;
  onOpenEditTravelers: () => void;
  onExportData: () => void;
  onImportData: () => void;
  totalCompleted: number;
  totalItems: number;
  overallPercentage: number;
}

export const Header: React.FC<HeaderProps> = ({
  tripName,
  destination,
  travelers,
  activeTravelerId,
  onSelectActiveTraveler,
  onOpenNewItem,
  onOpenEditTravelers,
  onExportData,
  onImportData,
  totalCompleted,
  totalItems,
  overallPercentage,
}) => {
  const activeTraveler = travelers.find(t => t.id === activeTravelerId) || travelers[0];

  return (
    <header className="bg-white border-b border-amber-900/10 sticky top-0 z-30 shadow-xs">
      {/* Top Bar Contract: Brand zone - Nav/Context - Primary Action */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xs">
            <span className="text-xl">🗺️</span>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight">
              {tripName}
            </h1>
            <p className="text-xs text-amber-700/80 font-medium hidden sm:block">
              {destination} · Trio de Viagem
            </p>
          </div>
        </div>

        {/* Center / Quick Traveler Selector */}
        <div className="hidden md:flex items-center gap-2 bg-stone-100 p-1 rounded-xl border border-stone-200">
          <span className="text-xs font-semibold text-stone-500 px-2 flex items-center gap-1">
            <UserCircle className="w-3.5 h-3.5" /> Quem está usando:
          </span>
          {travelers.map(t => {
            const isActive = t.id === activeTravelerId;
            return (
              <button
                key={t.id}
                onClick={() => onSelectActiveTraveler(t.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs border border-stone-200 font-semibold scale-102'
                    : 'text-stone-600 hover:text-slate-900 hover:bg-stone-200/60'
                }`}
                title={`Atuar como ${t.name} (${t.role})`}
              >
                <span>{t.avatar}</span>
                <span>{t.nickname}</span>
              </button>
            );
          })}
        </div>

        {/* Right / Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenEditTravelers}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors border border-stone-200/80"
            title="Editar os 3 Viajantes"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Editar Trio</span>
          </button>

          <button
            onClick={onExportData}
            className="hidden lg:flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
            title="Baixar backup JSON da viagem"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onImportData}
            className="hidden lg:flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
            title="Restaurar backup JSON da viagem"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenNewItem}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-xl shadow-xs transition-transform active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span className="whitespace-nowrap">Novo Item</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-strip: Active traveler switch + mini progress */}
      <div className="md:hidden px-4 py-2 bg-stone-50 border-t border-stone-200/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-stone-400 font-medium text-[11px] shrink-0">Você:</span>
          {travelers.map(t => {
            const isActive = t.id === activeTravelerId;
            return (
              <button
                key={t.id}
                onClick={() => onSelectActiveTraveler(t.id)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium shrink-0 transition-colors ${
                  isActive
                    ? 'bg-amber-600 text-white font-bold shadow-xs'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                <span>{t.avatar}</span>
                <span>{t.nickname}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onOpenEditTravelers}
          className="text-stone-500 hover:text-stone-800 shrink-0 ml-2"
          title="Editar viajantes"
        >
          <Users className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
