export type ActivityCategory = 'comidas' | 'lugares' | 'jogos' | 'fotos' | 'malas';

export type ShoppingCategory = 'mercado' | 'lanches' | 'bebidas' | 'refeicoes';

export interface Traveler {
  id: string;
  name: string;
  nickname: string;
  avatar: string;
  accentColor: string;
  role: string;
}

export interface ItemNote {
  id: string;
  authorId: string;
  text: string;
  createdAt: string;
}

export interface TripItem {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  suggestedBy: string; // traveler id
  completed: boolean;
  completedBy?: string; // traveler id
  completedAt?: string;
  location?: string;
  estimatedCost?: string;
  tags?: string[];
  imageUrl?: string;
  votes: string[]; // traveler ids who marked "eu quero!"
  notes?: ItemNote[];
}

export interface GameScore {
  travelerId: string;
  score: number;
}

export interface GameMatch {
  id: string;
  gameName: string;
  date: string;
  winnerId: string;
  scores: GameScore[];
  highlight?: string;
}

export interface PhotoMemory {
  id: string;
  title: string;
  caption: string;
  takenBy: string; // traveler id
  date: string;
  imageUrl: string;
  likes: string[]; // traveler ids
  location?: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: ShoppingCategory;
  requestedBy: string; // traveler id
  bought: boolean;
  boughtBy?: string;
  quantity?: string;
  notes?: string;
}

export interface FoodDishWish {
  id: string;
  dishName: string;
  mealType: 'cafe' | 'almoco' | 'jantar' | 'petisco';
  whoWants: string[]; // traveler ids
  suggestedBy: string; // traveler id
  ingredients: string;
  made: boolean;
  notes?: string;
}

export interface TripState {
  tripName: string;
  destination: string;
  dates: string;
  travelers: Traveler[];
  items: TripItem[];
  gameMatches: GameMatch[];
  photos: PhotoMemory[];
  shoppingList: ShoppingItem[];
  foodWishes: FoodDishWish[];
  quickNotepad: string;
  activeTravelerId: string;
  theme: 'light' | 'dark';
}
