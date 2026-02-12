
export interface Player {
  id: string;
  name: string;
  position: string;
  level: string;
  avatar: string;
  confirmed: boolean;
  goals: number;
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
  type: 'Futsal' | 'Society' | 'Campo';
  location: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  bibsRequired: boolean;
}

export type Screen = 'login' | 'home' | 'players' | 'scout' | 'create-match' | 'profile';
