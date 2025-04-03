export interface User {
  id: string;
  username: string;
  email: string;
  characterName: string;
  characterClass: string;
  characterRace: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  type: 'Tavern' | 'Dungeon' | 'Castle' | 'Temple' | 'City' | 'Wilderness';
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  world: string;
  createdBy: User;
  averageRating: number;
  createdAt: string;
  image?: string;
}

export interface CreateLocationInput {
  name: string;
  description: string;
  type: 'Tavern' | 'Dungeon' | 'Castle' | 'Temple' | 'City' | 'Wilderness';
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  world: string;
}

export interface Review {
  id: string;
  location: Location;
  user: User;
  rating: number;
  title: string;
  content: string;
  visitDate: string;
  characterLevel: number;
  partySize: number;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  errors?: Array<{
    msg: string;
    param: string;
  }>;
} 