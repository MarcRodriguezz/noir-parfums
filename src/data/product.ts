export interface Edition {
  sizeMl: number;
  priceEur: number;
}

export interface OlfactiveNote {
  id: 'top' | 'heart' | 'base';
  numeral: string;
  stage: string;
  moment: string;
  description: string;
  ingredients: string[];
}

export interface Material {
  name: string;
  summary: string;
  detail: string;
}

export interface Specification {
  term: string;
  value: string;
}

export const brand = {
  name: 'NOIR PARFUMS',
  wordmark: 'NOIR',
  claim: 'Beyond the Senses',
  disclaimer:
    'NOIR PARFUMS is a fictional house and this site is a prototype of a cinematic product page. Nothing here is for sale.',
} as const;

export const product = {
  number: 'Nº 01',
  name: 'Obsidian',
  fullName: 'NOIR Nº 01 — OBSIDIAN',
  concentration: 'Eau de Parfum',
  description:
    'NOIR Nº 01 — OBSIDIAN, a fictional eau de parfum of black bergamot, iris and burnt amber. A cinematic prototype by NOIR PARFUMS.',
} as const;

export const editions: readonly Edition[] = [
  { sizeMl: 50, priceEur: 165 },
  { sizeMl: 100, priceEur: 240 },
];

export const notes: readonly OlfactiveNote[] = [
  {
    id: 'top',
    numeral: 'I',
    stage: 'Top',
    moment: 'The first second',
    description:
      'Cold air before a storm. Bergamot left to darken on the branch, cracked pepper, and a trace of smoke from somewhere you cannot see.',
    ingredients: ['Black bergamot', 'Pink pepper', 'Cold smoke'],
  },
  {
    id: 'heart',
    numeral: 'II',
    stage: 'Heart',
    moment: 'The long minute',
    description:
      'The room settles. Iris, powdery and grey, opens over a tea steeped far too long. It stays close to the skin and asks you to lean in.',
    ingredients: ['Iris absolute', 'Black tea', 'Labdanum'],
  },
  {
    id: 'base',
    numeral: 'III',
    stage: 'Base',
    moment: 'The hour after',
    description:
      'What is left when everyone has gone. Amber taken past sweetness to the edge of burning, resting on oud and warm volcanic stone.',
    ingredients: ['Burnt amber', 'Oud resin', 'Obsidian accord'],
  },
];

export const specifications: readonly Specification[] = [
  { term: 'Concentration', value: 'Eau de Parfum, 22%' },
  { term: 'Volumes', value: '50 ml and 100 ml' },
  { term: 'Glass', value: 'Smoked, with a weighted clear base' },
  { term: 'Cap', value: 'Brushed champagne metal' },
  { term: 'Reverse label', value: 'Matte black, left unprinted' },
];

export const materials: readonly Material[] = [
  {
    name: 'The glass',
    summary: 'Smoked until the liquid disappears.',
    detail:
      'The walls are tinted so that the perfume reads as a shadow rather than a colour. Only the thick clear base catches the light, and it is the first thing you notice when the bottle is set down.',
  },
  {
    name: 'The cap',
    summary: 'Brushed by hand, in one direction.',
    detail:
      'A single cylinder of champagne metal, brushed vertically so that a reflection travels up it as you lift it. It is heavier than it looks, and it closes with almost no sound.',
  },
  {
    name: 'The label',
    summary: 'Black on black, on both sides.',
    detail:
      'Four letters on the front, in a soft metallic ink. Nothing on the back at all. Every list of ingredients and every line of explanation has been moved to the card inside the box.',
  },
];

export const navigation = [
  { href: '#essence', label: 'The Essence' },
  { href: '#revelation', label: 'The Revelation' },
  { href: '#craft', label: 'The Craft' },
  { href: '#finale', label: 'Reserve' },
] as const;
