import { describe, it, expect } from 'vitest';
import { getSmartFoodRecommendation } from '../utils/foodRecommender';

describe('getSmartFoodRecommendation', () => {
  it('returns custom recommendation when movie has one', () => {
    const movie = {
      genre: ['Drama'],
      foodRecommendation: { name: 'Special Pizza', woltLink: 'https://wolt.com/pizza' }
    };
    const result = getSmartFoodRecommendation(movie);
    expect(result.name).toBe('Special Pizza');
    expect(result.woltLink).toBe('https://wolt.com/pizza');
  });

  it('generates genre-based recommendation when movie has none', () => {
    const movie = {
      genre: ['Komedija'],
      foodRecommendation: null
    };
    const result = getSmartFoodRecommendation(movie);
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('woltLink');
    expect(result.auto).toBe(true);
  });

  it('falls back to Drama for unknown genres', () => {
    const movie = {
      genre: ['UnknownGenre'],
      foodRecommendation: null
    };
    const result = getSmartFoodRecommendation(movie);
    expect(result).toHaveProperty('name');
    expect(typeof result.name).toBe('string');
  });
});
