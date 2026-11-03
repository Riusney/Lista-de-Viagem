import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTripStats,
  filterTripItems,
  calculateScoreboard,
  toggleItemCompletion,
  toggleVote,
  toggleShoppingItem,
  calculateShoppingStats,
  toggleDishWish,
  toggleDishVote,
} from './tripLogic';
import { Traveler, TripItem, GameMatch, ShoppingItem, FoodDishWish } from '../types/trip';

const mockTravelers: Traveler[] = [
  { id: '1', name: 'Gabriel', nickname: 'Biel', avatar: '🎒', accentColor: '#3b82f6', role: 'Navegador' },
  { id: '2', name: 'Lucas', nickname: 'Lu', avatar: '📸', accentColor: '#10b981', role: 'Fotógrafo' },
  { id: '3', name: 'Bia', nickname: 'Bia', avatar: '🧁', accentColor: '#f59e0b', role: 'Crítica Gastronômica' },
];

const mockItems: TripItem[] = [
  {
    id: 'item-1',
    title: 'Comer Pamonha de Sal',
    description: 'Com queijo e linguiça',
    category: 'comidas',
    suggestedBy: '1',
    completed: true,
    completedBy: '2',
    completedAt: '2026-11-03T12:00:00Z',
    votes: ['1', '2', '3'],
  },
  {
    id: 'item-2',
    title: 'Visitar Parque Ipiranga',
    description: 'Caminhada no lago',
    category: 'lugares',
    suggestedBy: '3',
    completed: false,
    votes: ['3'],
  },
  {
    id: 'item-3',
    title: 'Jogar Catan',
    description: 'Partida à noite',
    category: 'jogos',
    suggestedBy: '2',
    completed: false,
    votes: ['1', '2'],
  },
];

test('calculateTripStats computes correct total, completed and percentages', () => {
  const stats = calculateTripStats(mockItems, mockTravelers);
  assert.equal(stats.totalItems, 3);
  assert.equal(stats.completedItems, 1);
  assert.equal(stats.overallPercentage, 33);
  assert.equal(stats.categoryBreakdown.comidas.completed, 1);
  assert.equal(stats.categoryBreakdown.lugares.completed, 0);
  assert.equal(stats.travelerContributions['1'].suggested, 1);
  assert.equal(stats.travelerContributions['2'].completed, 1);
});

test('filterTripItems filters by category', () => {
  const filtered = filterTripItems(mockItems, { category: 'comidas' });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].title, 'Comer Pamonha de Sal');
});

test('filterTripItems filters by status', () => {
  const pending = filterTripItems(mockItems, { status: 'pending' });
  assert.equal(pending.length, 2);

  const completed = filterTripItems(mockItems, { status: 'completed' });
  assert.equal(completed.length, 1);
  assert.equal(completed[0].id, 'item-1');
});

test('filterTripItems searches query across title and description', () => {
  const searchResult = filterTripItems(mockItems, { searchQuery: 'ipiranga' });
  assert.equal(searchResult.length, 1);
  assert.equal(searchResult[0].id, 'item-2');
});

test('calculateScoreboard aggregates match points and ranks winners', () => {
  const mockMatches: GameMatch[] = [
    {
      id: 'm1',
      gameName: 'Uno',
      date: '2026-11-03',
      winnerId: '1',
      scores: [
        { travelerId: '1', score: 100 },
        { travelerId: '2', score: 50 },
        { travelerId: '3', score: 20 },
      ],
    },
    {
      id: 'm2',
      gameName: 'Catan',
      date: '2026-11-04',
      winnerId: '1',
      scores: [
        { travelerId: '1', score: 10 },
        { travelerId: '2', score: 8 },
        { travelerId: '3', score: 7 },
      ],
    },
  ];

  const scoreboard = calculateScoreboard(mockMatches, mockTravelers);
  assert.equal(scoreboard[0].travelerId, '1');
  assert.equal(scoreboard[0].totalWins, 2);
  assert.equal(scoreboard[0].winRate, 100);
});

test('toggleItemCompletion toggles status cleanly', () => {
  const item = mockItems[1]; // uncompleted
  const completed = toggleItemCompletion(item, '3', '2026-11-03T15:00:00Z');
  assert.equal(completed.completed, true);
  assert.equal(completed.completedBy, '3');
  assert.equal(completed.completedAt, '2026-11-03T15:00:00Z');

  const uncompleted = toggleItemCompletion(completed, '3');
  assert.equal(uncompleted.completed, false);
  assert.equal(uncompleted.completedBy, undefined);
  assert.equal(uncompleted.completedAt, undefined);
});

test('toggleVote adds and removes votes correctly', () => {
  const item = mockItems[1]; // votes: ['3']
  const voted = toggleVote(item, '1');
  assert.deepEqual(voted.votes, ['3', '1']);

  const unvoted = toggleVote(voted, '3');
  assert.deepEqual(unvoted.votes, ['1']);
});

test('toggleShoppingItem and calculateShoppingStats work correctly', () => {
  const shopItem: ShoppingItem = {
    id: 's1',
    name: 'Pão de Queijo Congelado',
    category: 'lanches',
    requestedBy: '1',
    bought: false,
    quantity: '1 pacote',
  };

  const bought = toggleShoppingItem(shopItem, '2');
  assert.equal(bought.bought, true);
  assert.equal(bought.boughtBy, '2');

  const unbought = toggleShoppingItem(bought, '2');
  assert.equal(unbought.bought, false);
  assert.equal(unbought.boughtBy, undefined);

  const stats = calculateShoppingStats([shopItem, bought]);
  assert.equal(stats.total, 2);
  assert.equal(stats.bought, 1);
  assert.equal(stats.pending, 1);
  assert.equal(stats.percentage, 50);
});

test('toggleDishWish and toggleDishVote work as expected', () => {
  const dish: FoodDishWish = {
    id: 'd1',
    dishName: 'Arroz com Pequi da Bia',
    mealType: 'almoco',
    whoWants: ['1', '3'],
    suggestedBy: '3',
    ingredients: 'Arroz, pequi cozido, alho, cebola, cheiro verde',
    made: false,
  };

  const updated = toggleDishWish(dish);
  assert.equal(updated.made, true);

  const voted = toggleDishVote(dish, '2');
  assert.deepEqual(voted.whoWants, ['1', '3', '2']);

  const unvoted = toggleDishVote(voted, '1');
  assert.deepEqual(unvoted.whoWants, ['3', '2']);
});
