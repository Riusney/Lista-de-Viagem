import { ActivityCategory, GameMatch, Traveler, TripItem } from '../types/trip';

export interface CategorySummary {
  category: ActivityCategory;
  total: number;
  completed: number;
  percentage: number;
}

export interface TripStats {
  totalItems: number;
  completedItems: number;
  overallPercentage: number;
  categoryBreakdown: Record<ActivityCategory, CategorySummary>;
  travelerContributions: Record<string, { suggested: number; completed: number }>;
}

export interface PlayerScoreboard {
  travelerId: string;
  travelerName: string;
  totalGames: number;
  totalWins: number;
  winRate: number; // 0 - 100
  totalPoints: number;
}

export function calculateTripStats(items: TripItem[], travelers: Traveler[]): TripStats {
  const totalItems = items.length;
  const completedItems = items.filter(i => i.completed).length;
  const overallPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const categories: ActivityCategory[] = ['comidas', 'lugares', 'jogos', 'fotos', 'malas'];
  const categoryBreakdown = {} as Record<ActivityCategory, CategorySummary>;

  for (const cat of categories) {
    const catItems = items.filter(i => i.category === cat);
    const catTotal = catItems.length;
    const catCompleted = catItems.filter(i => i.completed).length;
    categoryBreakdown[cat] = {
      category: cat,
      total: catTotal,
      completed: catCompleted,
      percentage: catTotal > 0 ? Math.round((catCompleted / catTotal) * 100) : 0,
    };
  }

  const travelerContributions: Record<string, { suggested: number; completed: number }> = {};
  for (const traveler of travelers) {
    travelerContributions[traveler.id] = {
      suggested: items.filter(i => i.suggestedBy === traveler.id).length,
      completed: items.filter(i => i.completed && i.completedBy === traveler.id).length,
    };
  }

  return {
    totalItems,
    completedItems,
    overallPercentage,
    categoryBreakdown,
    travelerContributions,
  };
}

export function filterTripItems(
  items: TripItem[],
  options: {
    category?: ActivityCategory | 'all';
    status?: 'all' | 'pending' | 'completed';
    travelerId?: 'all' | string;
    searchQuery?: string;
  }
): TripItem[] {
  const { category = 'all', status = 'all', travelerId = 'all', searchQuery = '' } = options;

  return items.filter(item => {
    // Category filter
    if (category !== 'all' && item.category !== category) {
      return false;
    }

    // Status filter
    if (status === 'completed' && !item.completed) return false;
    if (status === 'pending' && item.completed) return false;

    // Traveler filter (suggested by or completed by or voted)
    if (travelerId !== 'all') {
      const isSuggested = item.suggestedBy === travelerId;
      const isCompletedBy = item.completedBy === travelerId;
      const hasVoted = item.votes && item.votes.includes(travelerId);
      if (!isSuggested && !isCompletedBy && !hasVoted) {
        return false;
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchLoc = item.location ? item.location.toLowerCase().includes(q) : false;
      const matchTags = item.tags ? item.tags.some(t => t.toLowerCase().includes(q)) : false;
      if (!matchTitle && !matchDesc && !matchLoc && !matchTags) {
        return false;
      }
    }

    return true;
  });
}

export function calculateScoreboard(matches: GameMatch[], travelers: Traveler[]): PlayerScoreboard[] {
  return travelers.map(traveler => {
    let totalGames = 0;
    let totalWins = 0;
    let totalPoints = 0;

    for (const match of matches) {
      const playerParticipation = match.scores.find(s => s.travelerId === traveler.id);
      if (playerParticipation !== undefined) {
        totalGames += 1;
        totalPoints += playerParticipation.score;
      }
      if (match.winnerId === traveler.id) {
        totalWins += 1;
      }
    }

    const winRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;

    return {
      travelerId: traveler.id,
      travelerName: traveler.name,
      totalGames,
      totalWins,
      winRate,
      totalPoints,
    };
  }).sort((a, b) => b.totalWins - a.totalWins || b.winRate - a.winRate);
}

export function toggleItemCompletion(
  item: TripItem,
  currentTravelerId: string,
  customDate?: string
): TripItem {
  if (item.completed) {
    return {
      ...item,
      completed: false,
      completedBy: undefined,
      completedAt: undefined,
    };
  }
  return {
    ...item,
    completed: true,
    completedBy: currentTravelerId,
    completedAt: customDate || new Date().toISOString(),
  };
}

export function toggleVote(item: TripItem, travelerId: string): TripItem {
  const currentVotes = item.votes || [];
  const exists = currentVotes.includes(travelerId);
  const updatedVotes = exists
    ? currentVotes.filter(id => id !== travelerId)
    : [...currentVotes, travelerId];

  return {
    ...item,
    votes: updatedVotes,
  };
}
