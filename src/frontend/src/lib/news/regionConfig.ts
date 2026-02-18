export interface Region {
  id: 'israel' | 'dubai' | 'india' | 'westbengal';
  name: string;
  flag: string;
}

export const REGIONS: Region[] = [
  {
    id: 'israel',
    name: 'Israel',
    flag: '🇮🇱',
  },
  {
    id: 'dubai',
    name: 'Dubai',
    flag: '🇦🇪',
  },
  {
    id: 'india',
    name: 'India',
    flag: '🇮🇳',
  },
  {
    id: 'westbengal',
    name: 'West Bengal',
    flag: '🏛️',
  },
];
