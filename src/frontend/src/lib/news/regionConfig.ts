export interface Region {
  id: 'israel' | 'dubai' | 'india' | 'westbengal';
  name: string;
  flag: string;
}

export const REGIONS: Region[] = [
  {
    id: 'india',
    name: 'India',
    flag: '🇮🇳',
  },
  {
    id: 'dubai',
    name: 'Dubai',
    flag: '🇦🇪',
  },
  {
    id: 'westbengal',
    name: 'West Bengal',
    flag: '🏛️',
  },
  {
    id: 'israel',
    name: 'Israel',
    flag: '🇮🇱',
  },
];
