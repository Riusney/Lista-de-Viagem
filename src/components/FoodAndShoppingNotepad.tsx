import React, { useState } from 'react';
import { ShoppingItem, FoodDishWish, Traveler, ShoppingCategory } from '../types/trip';
import {
  ShoppingCart,
  UtensilsCrossed,
  FileText,
  Plus,
  Check,
  Trash2,
  Heart,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Flame,
  Coffee,
  Sun,
  Moon,
  Clock,
} from 'lucide-react';

interface FoodAndShoppingNotepadProps {
  shoppingList: ShoppingItem[];
  foodWishes: FoodDishWish[];
  notepadText: string;
  travelers: Traveler[];
  activeTravelerId: string;
  onToggleShoppingItem: (id: string) => void;
  onAddShoppingItem: (item: Omit<ShoppingItem, 'id' | 'bought'>) => void;
  onDeleteShoppingItem: (id: string) => void;
  onToggleDishWish: (id: string) => void;
  onToggleDishVote: (id: string) => void;
  onAddDishWish: (dish: Omit<FoodDishWish, 'id' | 'made'>) => void;
  onDeleteDishWish: (id: string) => void;
  onSendIngredientsToShopping: (ingredientsText: string, dishName: string) => void;
  onUpdateNotepadText: (text: string) => void;
}

export const FoodAndShoppingNotepad: React.FC<FoodAndShoppingNotepadProps> = ({
  shoppingList,
  foodWishes,
  notepadText,
  travelers,
  activeTravelerId,
  onToggleShoppingItem,
  onAddShoppingItem,
  onDeleteShoppingItem,
  onToggleDishWish,
  onToggleDishVote,
  onAddDishWish,
  onDeleteDishWish,
  onSendIngredientsToShopping,
  onUpdateNotepadText,
}) => {
  const [subTab, setSubTab] = useState<'compras' | 'pratos' | 'bloco'>('compras');

  // New Shopping item form state
  const [newShopName, setNewShopName] = useState('');
  const [newShopCategory, setNewShopCategory] = useState<ShoppingCategory>('mercado');
  const [newShopQty, setNewShopQty] = useState('');
  const [newShopNotes, setNewShopNotes] = useState('');

  // New Food Dish form state
  const [showDishModal, setShowDishModal] = useState(false);
  const [dishName, setDishName] = useState('');
  const [mealType, setMealType] = useState<'cafe' | 'almoco' | 'jantar' | 'petisco'>('almoco');
  const [ingredients, setIngredients] = useState('');
  const [dishNotes, setDishNotes] = useState('');

  const activeTraveler = travelers.find(t => t.id === activeTravelerId) || travelers[0];

  const handleAddShoppingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShopName.trim()) return;

    onAddShoppingItem({
      name: newShopName.trim(),
      category: newShopCategory,
      quantity: newShopQty.trim() || undefined,
      notes: newShopNotes.trim() || undefined,
      requestedBy: activeTravelerId,
    });

    setNewShopName('');
    setNewShopQty('');
    setNewShopNotes('');
  };

  const handleAddDishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim()) return;

    onAddDishWish({
      dishName: dishName.trim(),
      mealType,
      ingredients: ingredients.trim(),
      notes: dishNotes.trim() || undefined,
      suggestedBy: activeTravelerId,
      whoWants: [activeTravelerId],
    });

    setDishName('');
    setIngredients('');
    setDishNotes('');
    setShowDishModal(false);
  };

  const totalShopping = shoppingList.length;
  const boughtCount = shoppingList.filter(i => i.bought).length;
  const pendingCount = totalShopping - boughtCount;

  const categoryLabels: Record<ShoppingCategory, string> = {
    mercado: 'Supermercado',
    lanches: 'Petiscos & Lanches',
    bebidas: 'Bebidas & Gelo',
    refeicoes: 'Carnes & Ingredientes',
  };

  const mealIcons: Record<string, string> = {
    cafe: '☕ Café da Manhã',
    almoco: '☀️ Almoço',
    jantar: '🌙 Jantar',
    petisco: '🍿 Lanche / Petisco',
  };

  return (
    <div className="space-y-6">
      {/* Top Banner for Food & Shopping */}
      <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-stone-100 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-stone-900 border border-amber-200/80 dark:border-amber-800/40 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">
              <UtensilsCrossed className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Cardápio & Lista de Compras Compartilhada</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
              O Que Vamos Comer & Comprar na Viagem
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1">
              Qualquer um dos 3 amigos pode anotar desejos de pratos, itens para o mercado e notas rápidas da cozinha!
            </p>
          </div>

          {/* Quick Sub-Navigation Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-200/80 dark:bg-stone-800 rounded-xl border border-stone-300/50 dark:border-stone-700 shrink-0">
            <button
              onClick={() => setSubTab('compras')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                subTab === 'compras'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Lista de Compras</span>
              <span className="text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-1.5 py-0.2 rounded-full tabular-nums">
                {boughtCount}/{totalShopping}
              </span>
            </button>

            <button
              onClick={() => setSubTab('pratos')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                subTab === 'pratos'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              <span>Pratos & Cardápio</span>
              <span className="text-[10px] bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 px-1.5 py-0.2 rounded-full tabular-nums">
                {foodWishes.length}
              </span>
            </button>

            <button
              onClick={() => setSubTab('bloco')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                subTab === 'bloco'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Bloco de Notas</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: LISTA DE COMPRAS */}
      {subTab === 'compras' && (
        <div className="space-y-6">
          {/* Quick Add Shopping Item Form */}
          <div className="bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Adicionar Item à Lista de Compras</span>
              <span className="text-xs font-normal text-stone-400">
                (Pedido por {activeTraveler.name} {activeTraveler.avatar})
              </span>
            </h3>

            <form onSubmit={handleAddShoppingSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    required
                    value={newShopName}
                    onChange={e => setNewShopName(e.target.value)}
                    placeholder="O que precisamos comprar? (Ex: Pão de alho, Carvão, Cerveja...)"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:bg-white dark:focus:bg-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={newShopCategory}
                    onChange={e => setNewShopCategory(e.target.value as ShoppingCategory)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="mercado">Supermercado</option>
                    <option value="lanches">Lanches & Petiscos</option>
                    <option value="bebidas">Bebidas & Gelo</option>
                    <option value="refeicoes">Carnes & Ingredientes</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={newShopQty}
                    onChange={e => setNewShopQty(e.target.value)}
                    placeholder="Qtd (Ex: 2L, 500g)"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full h-full min-h-[38px] flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500 rounded-xl shadow-xs transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Shopping items list */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>Itens a Comprar</span>
                <span className="text-xs font-normal text-stone-500 dark:text-stone-400">
                  ({pendingCount} pendentes, {boughtCount} no carrinho)
                </span>
              </h3>
            </div>

            {shoppingList.length > 0 ? (
              <div className="space-y-2">
                {shoppingList.map(item => {
                  const requester = travelers.find(t => t.id === item.requestedBy);
                  const buyer = item.boughtBy ? travelers.find(t => t.id === item.boughtBy) : null;

                  return (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl border transition-all ${
                        item.bought
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/70 dark:border-emerald-800/50'
                          : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Accessible Hitbox Checkbox */}
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={item.bought}
                          aria-label={`Marcar '${item.name}' como ${item.bought ? 'não comprado' : 'comprado'}`}
                          onClick={() => onToggleShoppingItem(item.id)}
                          className={`w-9 h-9 min-h-[36px] min-w-[36px] rounded-xl flex items-center justify-center transition-all shrink-0 ${
                            item.bought
                              ? 'bg-emerald-500 text-white shadow-2xs'
                              : 'border-2 border-stone-300 dark:border-stone-700 hover:border-amber-500 bg-stone-50 dark:bg-stone-800 text-transparent'
                          }`}
                        >
                          <Check className={`w-5 h-5 stroke-[3] ${item.bought ? 'opacity-100' : 'opacity-0'}`} />
                        </button>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-semibold truncate ${
                                item.bought
                                  ? 'line-through text-stone-400 dark:text-stone-500'
                                  : 'text-stone-900 dark:text-stone-100'
                              }`}
                            >
                              {item.name}
                            </span>
                            {item.quantity && (
                              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-950/60 px-1.5 py-0.5 rounded-md shrink-0">
                                {item.quantity}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                            <span>{categoryLabels[item.category]}</span>
                            <span aria-hidden="true">·</span>
                            <span>Pedido por {requester?.name} {requester?.avatar}</span>
                            {item.bought && buyer && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                                  Comprado por {buyer.name} {buyer.avatar}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={() => onDeleteShoppingItem(item.id)}
                        className="text-stone-300 dark:text-stone-600 hover:text-rose-500 dark:hover:text-rose-400 p-1.5 rounded-lg transition-colors shrink-0"
                        title="Remover item da lista"
                        aria-label={`Remover ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-500 text-xs">
                A lista de compras está vazia. Adicione o que vocês querem comprar para o café, petiscos e bebidas!
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PRATOS & CARDÁPIO */}
      {subTab === 'pratos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>Cardápio de Pratos Desejados do Trio</span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Pratos caseiros, almoços ou receitas especiais que vocês planejam comer juntos.
              </p>
            </div>

            <button
              onClick={() => setShowDishModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 rounded-xl shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Sugerir Prato</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {foodWishes.map(dish => {
              const author = travelers.find(t => t.id === dish.suggestedBy);
              const hasVoted = dish.whoWants.includes(activeTravelerId);

              return (
                <div
                  key={dish.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    dish.made
                      ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-200/70 dark:border-emerald-800/40'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-700 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-950/50 px-2 py-0.5 rounded-md">
                      {mealIcons[dish.mealType] || dish.mealType}
                    </span>

                    <button
                      onClick={() => onDeleteDishWish(dish.id)}
                      className="text-stone-300 dark:text-stone-600 hover:text-rose-500 dark:hover:text-rose-400 p-1"
                      title="Excluir prato"
                      aria-label={`Excluir ${dish.dishName}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4
                    className={`text-base font-bold text-stone-900 dark:text-stone-100 leading-snug ${
                      dish.made ? 'line-through text-stone-400 dark:text-stone-500' : ''
                    }`}
                  >
                    {dish.dishName}
                  </h4>

                  {dish.notes && (
                    <p className="text-xs text-stone-500 dark:text-stone-400 italic mt-1">
                      "{dish.notes}"
                    </p>
                  )}

                  {dish.ingredients && (
                    <div className="mt-3 p-2.5 bg-stone-50 dark:bg-stone-800/70 rounded-xl border border-stone-200/60 dark:border-stone-700/60 text-xs">
                      <div className="font-semibold text-stone-700 dark:text-stone-300 mb-1 flex items-center justify-between">
                        <span>Ingredientes Necessários:</span>
                        <button
                          onClick={() => onSendIngredientsToShopping(dish.ingredients, dish.dishName)}
                          className="text-[10px] text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-0.5 font-bold"
                          title="Adicionar estes ingredientes na Lista de Compras"
                        >
                          <span>+ Comprar Ingredientes</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
                        {dish.ingredients}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleDishVote(dish.id)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          hasVoted
                            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200/80'
                        }`}
                        title="Votar que quer comer esse prato!"
                      >
                        <Heart className={`w-3.5 h-3.5 ${hasVoted ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>Eu quero! ({dish.whoWants.length}/3)</span>
                      </button>

                      <button
                        onClick={() => onToggleDishWish(dish.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          dish.made
                            ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200/80'
                        }`}
                      >
                        {dish.made ? '✓ Já saboreamos!' : 'Marcar Feito'}
                      </button>
                    </div>

                    <div className="text-[11px] text-stone-400 dark:text-stone-500">
                      Por {author?.nickname} {author?.avatar}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: BLOCO DE NOTAS LIVRE */}
      {subTab === 'bloco' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-stone-900 p-5 sm:p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Bloco de Anotações Rápido do Trio</span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Espaço livre compartilhado para colar links, ideias de comidas, endereços ou recados instantâneos.
                </p>
              </div>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
                Salva automaticamente
              </span>
            </div>

            <textarea
              rows={10}
              value={notepadText}
              onChange={e => onUpdateNotepadText(e.target.value)}
              placeholder="Escreva aqui qualquer coisa sobre as comidas, mercado ou passeios que o trio combinar..."
              className="w-full p-4 text-xs sm:text-sm font-mono rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 focus:bg-white dark:focus:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* Modal: Add Dish */}
      {showDishModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full p-6 shadow-xl border border-stone-200 dark:border-stone-800">
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              Sugerir Prato / Refeição da Viagem
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
              O que você quer que o trio coma ou cozinhe em Anápolis?
            </p>

            <form onSubmit={handleAddDishSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Nome do Prato *
                </label>
                <input
                  type="text"
                  required
                  value={dishName}
                  onChange={e => setDishName(e.target.value)}
                  placeholder="Ex: Picanha na grelha, Risoto caipira, Torta de maçã..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Momento da Refeição
                </label>
                <select
                  value={mealType}
                  onChange={e => setMealType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="cafe">Café da Manhã</option>
                  <option value="almoco">Almoço</option>
                  <option value="jantar">Jantar</option>
                  <option value="petisco">Lanche / Petisco</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Ingredientes Necessários
                </label>
                <textarea
                  rows={2}
                  value={ingredients}
                  onChange={e => setIngredients(e.target.value)}
                  placeholder="Ex: Mandioca fresca, queijo ralado, manteiga de garrafa..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Recado / Dica Extra
                </label>
                <input
                  type="text"
                  value={dishNotes}
                  onChange={e => setDishNotes(e.target.value)}
                  placeholder="Ex: Quem cozinhar não lava a louça!"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowDishModal(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
                >
                  Salvar Prato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
