import React from 'react';
import { MainTabType } from './NavigationTabs';
import { ListTodo, Utensils, MapPin, Dice5, Camera } from 'lucide-react';

interface BottomNavProps {
  activeTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: { id: MainTabType; label: string; icon: React.ReactNode }[] = [
    { id: 'todas', label: 'Tudo', icon: <ListTodo className="w-5 h-5" /> },
    { id: 'comidas', label: 'Comidas', icon: <Utensils className="w-5 h-5" /> },
    { id: 'lugares', label: 'Lugares', icon: <MapPin className="w-5 h-5" /> },
    { id: 'jogos', label: 'Jogos', icon: <Dice5 className="w-5 h-5" /> },
    { id: 'fotos', label: 'Mural', icon: <Camera className="w-5 h-5" /> },
  ];

  return (
    <nav
      aria-label="Navegação mobile"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-lg px-2 py-1"
    >
      <div className="grid grid-cols-5 items-center h-14">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] rounded-xl transition-all ${
                isActive
                  ? 'text-amber-700 font-bold'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              <span className={`transition-transform ${isActive ? 'scale-110 text-amber-600' : ''}`}>
                {tab.icon}
              </span>
              <span className="text-[10px] tracking-tight mt-0.5">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
