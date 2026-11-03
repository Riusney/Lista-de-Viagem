import React from 'react';
import { Traveler } from '../types/trip';
import { CheckCircle2, Sparkles, UserCircle, Plus, Users, Download, Upload, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  tripName: string;
  destination: string;
  travelers: Traveler[];
  activeTravelerId: string;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
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
  theme,
  onToggleTheme,
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
    <header className="bg-white dark:bg-stone-900 border-b border-amber-900/10 dark:border-stone-800 sticky top-0 z-30 shadow-xs transition-colors">
      {/* Top Bar Contract: Brand zone - Nav/Context - Primary Action */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xs">
            <span className="text-xl">🗺️</span>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-stone-100 leading-tight">
              {tripName}
            </h1>
            <p className="text-xs text-amber-700/80 dark:text-amber-400 font-medium hidden sm:block">
              {destination} · Trio de Viagem
            </p>
          </div>
        </div>

        {/* Center / Quick Traveler Selector */}
        <div className="hidden md:flex items-center gap-2 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700">
          <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 px-2 flex items-center gap-1">
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
                    ? 'bg-white dark:bg-stone-900 text-slate-900 dark:text-stone-100 shadow-xs border border-stone-200 dark:border-stone-700 font-semibold scale-102'
                    : 'text-stone-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-700/60'
                }`}
                title={`Atuar como ${t.name} (${t.role})`}
              >
                <span>{t.avatar}</span>
                <span>{t.nickname}</span>
              </button>
            );
          })}
        </div>

        {/* Right / Actions: Theme Toggle, Edit Trio, Export, New Item */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title={theme === 'dark' ? 'Mudar para tema claro (Diurno)' : 'Mudar para tema escuro (Noturno)'}
            aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-stone-600" />
            )}
          </button>

          <button
            onClick={onOpenEditTravelers}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors border border-stone-200/80 dark:border-stone-700"
            title="Editar os 3 Viajantes"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Editar Trio</span>
          </button>

          <button
            onClick={onExportData}
            className="hidden lg:flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
            title="Baixar backup JSON da viagem"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onImportData}
            className="hidden lg:flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
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

      {/* Mobile Sub-strip: Active traveler switch + mini theme toggle */}
      <div className="md:hidden px-4 py-2 bg-stone-50 dark:bg-stone-950/60 border-t border-stone-200/60 dark:border-stone-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-stone-400 dark:text-stone-500 font-medium text-[11px] shrink-0">Você:</span>
          {travelers.map(t => {
            const isActive = t.id === activeTravelerId;
            return (
              <button
                key={t.id}
                onClick={() => onSelectActiveTraveler(t.id)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium shrink-0 transition-colors ${
                  isActive
                    ? 'bg-amber-600 text-white font-bold shadow-xs'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                <span>{t.avatar}</span>
                <span>{t.nickname}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="text-stone-500 dark:text-stone-400 hover:text-stone-800 p-1"
            title="Alternar tema"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onOpenEditTravelers}
            className="text-stone-500 dark:text-stone-400 hover:text-stone-800 p-1"
            title="Editar viajantes"
          >
            <Users className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
