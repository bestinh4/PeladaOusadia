
export interface Player {
  id: string;
  name: string;
  position: string;
  level: string;
  avatar: string;
  confirmed: boolean;
  goals: number;
  assists?: number;
  matches?: number;
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

export type Screen = 'login' | 'home' | 'players' | 'scout' | 'create-match' | 'profile' | 'draw' | 'finance';
