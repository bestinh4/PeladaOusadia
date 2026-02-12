
import { Player } from './types';

export const MOCK_PLAYERS: Player[] = [
  {
    id: '1',
    name: 'Luka Modrić',
    position: 'Midfielder',
    level: 'Pro',
    avatar: 'https://picsum.photos/seed/luka/200/200',
    confirmed: true,
    goals: 15,
    club: 'Real Madrid',
    number: 10,
    rating: 88,
    stats: { pac: 74, sho: 76, pas: 89, dri: 88, def: 72, phy: 66 }
  },
  {
    id: '2',
    name: 'Ivan Perišić',
    position: 'Forward',
    level: 'Elite',
    avatar: 'https://picsum.photos/seed/ivan/200/200',
    confirmed: true,
    goals: 12,
    club: 'Hajduk Split',
    number: 4,
    rating: 84,
    stats: { pac: 82, sho: 80, pas: 78, dri: 81, def: 65, phy: 75 }
  },
  {
    id: '3',
    name: 'Mateo Kovačić',
    position: 'Midfielder',
    level: 'Pro',
    avatar: 'https://picsum.photos/seed/mateo/200/200',
    confirmed: true,
    goals: 8,
    club: 'Man City',
    rating: 82,
    stats: { pac: 70, sho: 68, pas: 84, dri: 86, def: 74, phy: 70 }
  },
  {
    id: '4',
    name: 'Joško Gvardiol',
    position: 'Defender',
    level: 'Elite',
    avatar: 'https://picsum.photos/seed/josko/200/200',
    confirmed: false,
    goals: 4,
    club: 'Man City',
    rating: 83,
    stats: { pac: 78, sho: 55, pas: 70, dri: 74, def: 85, phy: 84 }
  },
  {
    id: '5',
    name: 'Andrej Kramarić',
    position: 'Forward',
    level: 'Elite',
    avatar: 'https://picsum.photos/seed/andrej/200/200',
    confirmed: true,
    goals: 10,
    club: 'Hoffenheim',
    rating: 81,
    stats: { pac: 72, sho: 84, pas: 75, dri: 82, def: 35, phy: 68 }
  }
];
