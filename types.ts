
export interface Player {
  id: string;
  name: string;
  position: string;
  level: string;
  avatar: string;
  confirmed: boolean;
  paid: boolean;
  role: 'admin' | 'player'; // Added for permissions
  goals: number;
  assists: number;
  matches: number;
  club?: string;
  number?: number;
  rating: number;
  stats: {
    pac: number;
    sho: number;
    pas: number;
    dri: number;
    def: number;
    phy: number;
  };
}

export interface Match {
  id: string;
  location: string;
  date: string;
  time: string;
  type: string;
  price: number;
  limit: number;
  active: boolean;
  createdAt: any;
}

export type Screen = 'login' | 'home' | 'players' | 'scout' | 'create-match' | 'profile' | 'draw' | 'finance';
