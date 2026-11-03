export type ActivityCategory = 'comidas' | 'lugares' | 'jogos' | 'fotos' | 'malas';

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

export interface TripState {
  tripName: string;
  destination: string;
  dates: string;
  travelers: Traveler[];
  items: TripItem[];
  gameMatches: GameMatch[];
  photos: PhotoMemory[];
  activeTravelerId: string;
}
