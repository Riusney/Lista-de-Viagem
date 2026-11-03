import React from 'react';
import { ActivityCategory } from '../types/trip';
import { Utensils, MapPin, Dice5, Camera, Briefcase, ListTodo } from 'lucide-react';

export type MainTabType = 'todas' | ActivityCategory;

interface NavigationTabsProps {
  activeTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
  counts: Record<MainTabType, { total: number; completed: number }>;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  counts,
}) => {
  const tabs: { id: MainTabType; label: string; icon: React.ReactNode }[] = [
    { id: 'todas', label: 'Tudo', icon: <ListTodo className="w-4 h-4" /> },
    { id: 'comidas', label: 'Comidas', icon: <Utensils className="w-4 h-4" /> },
    { id: 'lugares', label: 'Lugares', icon: <MapPin className="w-4 h-4" /> },
    { id: 'jogos', label: 'Jogos & Placar', icon: <Dice5 className="w-4 h-4" /> },
    { id: 'fotos', label: 'Mural de Fotos', icon: <Camera className="w-4 h-4" /> },
    { id: 'malas', label: 'Bagagem', icon: <Briefcase className="w-4 h-4" /> },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1.5 bg-stone-200/70 rounded-2xl overflow-x-auto mb-6 scrollbar-none">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        const count = counts[tab.id];

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
              isActive
                ? 'bg-white text-stone-900 shadow-xs scale-101 border border-stone-300/40'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
            }`}
          >
            <span className={isActive ? 'text-amber-600' : 'text-stone-500'}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
            {count && count.total > 0 && (
              <span className={`text-[11px] tabular-nums font-normal ${
                isActive ? 'text-amber-700 font-semibold' : 'text-stone-400'
              }`}>
                {count.completed}/{count.total}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
