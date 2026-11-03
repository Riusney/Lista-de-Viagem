import React from 'react';
import { Traveler } from '../types/trip';
import { Search, Filter, CheckCircle2, Clock, User } from 'lucide-react';

interface FilterToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: 'all' | 'pending' | 'completed';
  onStatusFilterChange: (status: 'all' | 'pending' | 'completed') => void;
  travelerFilter: 'all' | string;
  onTravelerFilterChange: (travelerId: 'all' | string) => void;
  travelers: Traveler[];
  itemCount: number;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  travelerFilter,
  onTravelerFilterChange,
  travelers,
  itemCount,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-3 sm:p-4 mb-6 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Buscar comidas, parques, jogos ou dicas..."
          className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
        />
      </div>

      {/* Segmented Status Filter */}
      <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200/60 shrink-0">
        <button
          onClick={() => onStatusFilterChange('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            statusFilter === 'all'
              ? 'bg-white text-stone-900 shadow-2xs font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Todas ({itemCount})
        </button>

        <button
          onClick={() => onStatusFilterChange('pending')}
          className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            statusFilter === 'pending'
              ? 'bg-white text-amber-800 shadow-2xs font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Clock className="w-3 h-3 text-amber-600" />
          <span>A Fazer</span>
        </button>

        <button
          onClick={() => onStatusFilterChange('completed')}
          className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            statusFilter === 'completed'
              ? 'bg-white text-emerald-800 shadow-2xs font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Feitas</span>
        </button>
      </div>

      {/* Traveler Filter Selector */}
      <div className="flex items-center gap-1.5 shrink-0">
        <label htmlFor="traveler-filter-select" className="text-xs font-semibold text-stone-500 whitespace-nowrap">
          Filtrar por:
        </label>
        <select
          id="traveler-filter-select"
          value={travelerFilter}
          onChange={e => onTravelerFilterChange(e.target.value)}
          className="text-xs font-medium py-1.5 px-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
        >
          <option value="all">Todo o Trio</option>
          {travelers.map(t => (
            <option key={t.id} value={t.id}>
              {t.name} ({t.nickname}) {t.avatar}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
