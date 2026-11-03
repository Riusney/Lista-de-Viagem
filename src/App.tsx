/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TripState, TripItem, GameMatch, PhotoMemory, Traveler, ActivityCategory } from './types/trip';
import { initialTripData } from './data/initialTripData';
import {
  calculateTripStats,
  filterTripItems,
  calculateScoreboard,
  toggleItemCompletion,
  toggleVote,
} from './utils/tripLogic';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { NavigationTabs, MainTabType } from './components/NavigationTabs';
import { FilterToolbar } from './components/FilterToolbar';
import { ItemCard } from './components/ItemCard';
import { GamesSection } from './components/GamesSection';
import { PhotoGallery } from './components/PhotoGallery';
import { AddItemModal } from './components/AddItemModal';
import { EditTravelersModal } from './components/EditTravelersModal';
import { BottomNav } from './components/BottomNav';
import { Plus, Sparkles, Share2, RotateCcw, Check, Download, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'anapolis_trip_state_v1';

export default function App() {
  const [tripState, setTripState] = useState<TripState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not load saved trip state, using initial seed data.', e);
    }
    return initialTripData;
  });

  const [activeTab, setActiveTab] = useState<MainTabType>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [travelerFilter, setTravelerFilter] = useState<'all' | string>('all');

  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isEditTravelersOpen, setIsEditTravelersOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tripState));
    } catch (e) {
      console.error('Failed to save trip state to localStorage', e);
    }
  }, [tripState]);

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setTripState(JSON.parse(e.newValue));
        } catch (err) {
          console.error('Error parsing storage update', err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Calculations
  const stats = useMemo(() => {
    return calculateTripStats(tripState.items, tripState.travelers);
  }, [tripState.items, tripState.travelers]);

  const scoreboard = useMemo(() => {
    return calculateScoreboard(tripState.gameMatches, tripState.travelers);
  }, [tripState.gameMatches, tripState.travelers]);

  // Tab counts
  const tabCounts = useMemo(() => {
    const res: Record<MainTabType, { total: number; completed: number }> = {
      todas: { total: tripState.items.length, completed: tripState.items.filter(i => i.completed).length },
      comidas: {
        total: tripState.items.filter(i => i.category === 'comidas').length,
        completed: tripState.items.filter(i => i.category === 'comidas' && i.completed).length,
      },
      lugares: {
        total: tripState.items.filter(i => i.category === 'lugares').length,
        completed: tripState.items.filter(i => i.category === 'lugares' && i.completed).length,
      },
      jogos: {
        total: tripState.items.filter(i => i.category === 'jogos').length,
        completed: tripState.items.filter(i => i.category === 'jogos' && i.completed).length,
      },
      fotos: {
        total: tripState.items.filter(i => i.category === 'fotos').length,
        completed: tripState.items.filter(i => i.category === 'fotos' && i.completed).length,
      },
      malas: {
        total: tripState.items.filter(i => i.category === 'malas').length,
        completed: tripState.items.filter(i => i.category === 'malas' && i.completed).length,
      },
    };
    return res;
  }, [tripState.items]);

  // Filtered items for current view
  const currentCategoryFilter = activeTab === 'todas' ? 'all' : (activeTab as ActivityCategory);
  const filteredItems = useMemo(() => {
    return filterTripItems(tripState.items, {
      category: currentCategoryFilter,
      status: statusFilter,
      travelerId: travelerFilter,
      searchQuery,
    });
  }, [tripState.items, currentCategoryFilter, statusFilter, travelerFilter, searchQuery]);

  // Handlers
  const handleSelectActiveTraveler = (id: string) => {
    setTripState(prev => ({ ...prev, activeTravelerId: id }));
    const t = tripState.travelers.find(tr => tr.id === id);
    showToast(`Agora usando como ${t?.name || 'viajante'}!`);
  };

  const handleToggleComplete = (itemId: string) => {
    setTripState(prev => {
      const updated = prev.items.map(item => {
        if (item.id === itemId) {
          const toggled = toggleItemCompletion(item, prev.activeTravelerId);
          if (toggled.completed) {
            showToast(`Atividade marcada como concluída! 🎉`);
          }
          return toggled;
        }
        return item;
      });
      return { ...prev, items: updated };
    });
  };

  const handleToggleVote = (itemId: string) => {
    setTripState(prev => {
      const updated = prev.items.map(item => {
        if (item.id === itemId) {
          return toggleVote(item, prev.activeTravelerId);
        }
        return item;
      });
      return { ...prev, items: updated };
    });
  };

  const handleAddNote = (itemId: string, noteText: string) => {
    const newNote = {
      id: 'note-' + Date.now(),
      authorId: tripState.activeTravelerId,
      text: noteText,
      createdAt: new Date().toISOString(),
    };
    setTripState(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId
          ? { ...item, notes: [...(item.notes || []), newNote] }
          : item
      ),
    }));
    showToast('Anotação adicionada com sucesso!');
  };

  const handleDeleteNote = (itemId: string, noteId: string) => {
    setTripState(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId
          ? { ...item, notes: (item.notes || []).filter(n => n.id !== noteId) }
          : item
      ),
    }));
  };

  const handleDeleteItem = (itemId: string) => {
    setTripState(prev => ({
      ...prev,
      items: prev.items.filter(i => i.id !== itemId),
    }));
    showToast('Item removido da lista');
  };

  const handleAddItem = (newItem: Omit<TripItem, 'id'>) => {
    const itemWithId: TripItem = {
      ...newItem,
      id: 'item-' + Date.now(),
    };
    setTripState(prev => ({
      ...prev,
      items: [itemWithId, ...prev.items],
    }));
    showToast(`"${newItem.title}" adicionado à lista!`);
  };

  const handleAddMatch = (newMatch: Omit<GameMatch, 'id'>) => {
    const matchWithId: GameMatch = {
      ...newMatch,
      id: 'gm-' + Date.now(),
    };
    setTripState(prev => ({
      ...prev,
      gameMatches: [matchWithId, ...prev.gameMatches],
    }));
    showToast(`Partida de ${newMatch.gameName} registrada no placar! 🏆`);
  };

  const handleDeleteMatch = (matchId: string) => {
    setTripState(prev => ({
      ...prev,
      gameMatches: prev.gameMatches.filter(m => m.id !== matchId),
    }));
  };

  const handleAddPhoto = (newPhoto: Omit<PhotoMemory, 'id'>) => {
    const photoWithId: PhotoMemory = {
      ...newPhoto,
      id: 'photo-' + Date.now(),
    };
    setTripState(prev => ({
      ...prev,
      photos: [photoWithId, ...prev.photos],
    }));
    showToast('Foto adicionada ao mural com sucesso! 📸');
  };

  const handleDeletePhoto = (photoId: string) => {
    setTripState(prev => ({
      ...prev,
      photos: prev.photos.filter(p => p.id !== photoId),
    }));
  };

  const handleTogglePhotoLike = (photoId: string) => {
    setTripState(prev => {
      const travelerId = prev.activeTravelerId;
      const updatedPhotos = prev.photos.map(p => {
        if (p.id === photoId) {
          const hasLiked = p.likes.includes(travelerId);
          return {
            ...p,
            likes: hasLiked
              ? p.likes.filter(id => id !== travelerId)
              : [...p.likes, travelerId],
          };
        }
        return p;
      });
      return { ...prev, photos: updatedPhotos };
    });
  };

  const handleSaveTravelers = (updatedTravelers: Traveler[]) => {
    setTripState(prev => ({ ...prev, travelers: updatedTravelers }));
    showToast('Dados do trio atualizados!');
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tripState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'anapolis-viagem-trio.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Backup do roteiro baixado com sucesso!');
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (parsed.items && parsed.travelers) {
          setTripState(parsed);
          showToast('Roteiro restaurado com sucesso!');
        } else {
          showToast('Arquivo inválido.');
        }
      } catch (err) {
        showToast('Erro ao ler arquivo JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetToDefault = () => {
    if (window.confirm('Tem certeza de que deseja restaurar as dicas originais de Anápolis?')) {
      setTripState(initialTripData);
      localStorage.removeItem(STORAGE_KEY);
      showToast('Roteiro restaurado para o padrão!');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900 pb-24 md:pb-16 flex flex-col">
      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Header */}
      <Header
        tripName={tripState.tripName}
        destination={tripState.destination}
        travelers={tripState.travelers}
        activeTravelerId={tripState.activeTravelerId}
        onSelectActiveTraveler={handleSelectActiveTraveler}
        onOpenNewItem={() => setIsAddItemOpen(true)}
        onOpenEditTravelers={() => setIsEditTravelersOpen(true)}
        onExportData={handleExportData}
        onImportData={handleImportClick}
        totalCompleted={stats.completedItems}
        totalItems={stats.totalItems}
        overallPercentage={stats.overallPercentage}
      />

      {/* Main Content */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 flex-1">
        {/* Hero Banner */}
        <HeroBanner
          stats={stats}
          travelers={tripState.travelers}
          activeTravelerId={tripState.activeTravelerId}
          onSelectTraveler={tId => {
            handleSelectActiveTraveler(tId);
            setTravelerFilter(tId);
          }}
        />

        {/* Category Navigation Tabs */}
        <NavigationTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={tabCounts}
        />

        {/* Conditional View Rendering */}
        {activeTab === 'jogos' ? (
          <GamesSection
            gameItems={tripState.items.filter(i => i.category === 'jogos')}
            matches={tripState.gameMatches}
            travelers={tripState.travelers}
            activeTravelerId={tripState.activeTravelerId}
            scoreboard={scoreboard}
            onToggleComplete={handleToggleComplete}
            onToggleVote={handleToggleVote}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
            onDeleteItem={handleDeleteItem}
            onAddMatch={handleAddMatch}
            onDeleteMatch={handleDeleteMatch}
            onOpenNewItem={() => setIsAddItemOpen(true)}
          />
        ) : activeTab === 'fotos' ? (
          <PhotoGallery
            photos={tripState.photos}
            photoItems={tripState.items.filter(i => i.category === 'fotos')}
            travelers={tripState.travelers}
            activeTravelerId={tripState.activeTravelerId}
            onAddPhoto={handleAddPhoto}
            onDeletePhoto={handleDeletePhoto}
            onToggleLike={handleTogglePhotoLike}
            onToggleComplete={handleToggleComplete}
            onToggleVote={handleToggleVote}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
            onDeleteItem={handleDeleteItem}
            onOpenNewItem={() => setIsAddItemOpen(true)}
          />
        ) : (
          /* Checklist View for 'todas', 'comidas', 'lugares', 'malas' */
          <div>
            {/* Filter Toolbar */}
            <FilterToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              travelerFilter={travelerFilter}
              onTravelerFilterChange={setTravelerFilter}
              travelers={tripState.travelers}
              itemCount={filteredItems.length}
            />

            {/* Items List */}
            {filteredItems.length > 0 ? (
              <div className="space-y-3.5">
                {filteredItems.map(item => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    travelers={tripState.travelers}
                    activeTravelerId={tripState.activeTravelerId}
                    onToggleComplete={handleToggleComplete}
                    onToggleVote={handleToggleVote}
                    onAddNote={handleAddNote}
                    onDeleteNote={handleDeleteNote}
                    onDeleteItem={handleDeleteItem}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/80 p-8 shadow-xs">
                <span className="text-4xl block mb-2">🔍</span>
                <h3 className="text-base font-bold text-stone-900 mb-1">
                  Nenhuma atividade encontrada
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
                  {searchQuery || travelerFilter !== 'all' || statusFilter !== 'all'
                    ? 'Tente limpar a busca ou mudar os filtros de status e viajante.'
                    : 'Ainda não há itens nessa categoria. Que tal sugerir algo novo?'}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setTravelerFilter('all');
                    setIsAddItemOpen(true);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl"
                >
                  + Adicionar Nova Atividade
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 right-4 left-4 md:left-auto md:right-8 z-50 bg-stone-900 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-3 border border-stone-700 max-w-md animate-fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-stone-400 hover:text-white text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        travelers={tripState.travelers}
        activeTravelerId={tripState.activeTravelerId}
        defaultCategory={activeTab === 'todas' ? 'comidas' : (activeTab as ActivityCategory)}
        onAddItem={handleAddItem}
      />

      {/* Edit Travelers Modal */}
      <EditTravelersModal
        isOpen={isEditTravelersOpen}
        onClose={() => setIsEditTravelersOpen(false)}
        travelers={tripState.travelers}
        onSaveTravelers={handleSaveTravelers}
      />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-stone-200/80 bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="text-base">🌽</span>
            <span>Viagem para Anápolis · Goiás · Feito com carinho para o trio</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleExportData}
              className="hover:text-amber-700 transition-colors flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Exportar Roteiro
            </button>
            <span>·</span>
            <button
              onClick={handleResetToDefault}
              className="text-stone-400 hover:text-rose-600 transition-colors flex items-center gap-1"
              title="Restaurar roteiro inicial"
            >
              <RotateCcw className="w-3 h-3" /> Restaurar Padrão
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
