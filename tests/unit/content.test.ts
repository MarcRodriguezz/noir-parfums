import { describe, expect, it } from 'vitest';
import { editions, materials, navigation, notes, product } from '@/data/product';

describe('product content', () => {
  it('tells the fragrance in top, heart and base order', () => {
    expect(notes.map((note) => note.id)).toEqual(['top', 'heart', 'base']);
  });

  it('gives every note three ingredients', () => {
    notes.forEach((note) => {
      expect(note.ingredients).toHaveLength(3);
    });
  });

  it('prices larger editions higher', () => {
    const prices = [...editions].sort((a, b) => a.sizeMl - b.sizeMl).map((e) => e.priceEur);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it('keeps the product name exact', () => {
    expect(product.fullName).toBe('NOIR Nº 01 — OBSIDIAN');
  });

  it('points navigation at unique anchors', () => {
    const hrefs = navigation.map((link) => link.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    hrefs.forEach((href) => {
      expect(href).toMatch(/^#[a-z]+$/);
    });
  });

  it('describes every material', () => {
    materials.forEach((material) => {
      expect(material.detail.length).toBeGreaterThan(material.summary.length);
    });
  });
});
