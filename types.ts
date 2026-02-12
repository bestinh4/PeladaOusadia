
export interface Player {
  id: string;
  name: string;
  position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
  avatar: string;
  confirmed: boolean;
  paid: boolean;
  role: 'admin' | 'player';
  goals: number;
  assists: number;
  matches: number;
  goalsConceded: number;
  club?: string;
  number?: number;
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

export type Screen = 'login' | 'registration' | 'home' | 'players' | 'scout' | 'create-match' | 'profile' | 'draw' | 'finance';
