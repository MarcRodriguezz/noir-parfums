import type { Edition } from '@/data/product';

export function findEdition(query: string, editions: readonly Edition[]): Edition | undefined {
  const size = new URLSearchParams(query).get('size');
  if (size === null || !/^\d+$/.test(size)) return undefined;
  return editions.find((edition) => edition.sizeMl === Number(size));
}
