import { describe, expect, it } from 'vitest';
import { formatPrice, splitWords } from '@/lib/format';

describe('formatPrice', () => {
  it('formats whole euros without decimals', () => {
    expect(formatPrice(240)).toBe('€240');
  });

  it('adds thousands separators', () => {
    expect(formatPrice(1250)).toBe('€1,250');
  });
});

describe('splitWords', () => {
  it('splits on any whitespace and drops empties', () => {
    expect(splitWords('  dark,  glassy\nand caught ')).toEqual([
      'dark,',
      'glassy',
      'and',
      'caught',
    ]);
  });

  it('returns nothing for blank text', () => {
    expect(splitWords('   ')).toEqual([]);
  });
});
