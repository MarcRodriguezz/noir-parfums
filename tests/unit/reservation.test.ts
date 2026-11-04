import { describe, expect, it } from 'vitest';
import { editions } from '@/data/product';
import { findEdition } from '@/lib/reservation';

describe('findEdition', () => {
  it('finds an edition from the query string', () => {
    expect(findEdition('?size=100', editions)?.priceEur).toBe(240);
  });

  it.each(['', '?size=', '?size=75', '?size=abc', '?size=50ml', '?size=<script>'])(
    'rejects %s',
    (query) => {
      expect(findEdition(query, editions)).toBeUndefined();
    },
  );
});
