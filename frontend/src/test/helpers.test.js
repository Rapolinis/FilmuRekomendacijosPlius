import { describe, it, expect } from 'vitest';
import { getMoonPhase, getWeatherMood, formatDate, getAverageRating, canRegisterForViewing } from '../utils/helpers';

describe('getMoonPhase', () => {
  it('returns an object with name, emoji, and value', () => {
    const phase = getMoonPhase();
    expect(phase).toHaveProperty('name');
    expect(phase).toHaveProperty('emoji');
    expect(phase).toHaveProperty('value');
    expect(typeof phase.name).toBe('string');
    expect(typeof phase.value).toBe('number');
    expect(phase.value).toBeGreaterThanOrEqual(0);
    expect(phase.value).toBeLessThan(1);
  });
});

describe('getWeatherMood', () => {
  it('returns an object with name, emoji, and mood', () => {
    const weather = getWeatherMood();
    expect(weather).toHaveProperty('name');
    expect(weather).toHaveProperty('emoji');
    expect(weather).toHaveProperty('mood');
    expect(typeof weather.name).toBe('string');
  });
});

describe('formatDate', () => {
  it('formats a date string in Lithuanian locale', () => {
    const result = formatDate('2026-03-15');
    expect(typeof result).toBe('string');
    expect(result).toContain('2026');
  });

  it('handles invalid dates gracefully', () => {
    const result = formatDate('invalid');
    expect(typeof result).toBe('string');
  });
});

describe('getAverageRating', () => {
  it('returns 0 for empty array', () => {
    expect(getAverageRating([])).toBe(0);
  });

  it('returns 0 for null', () => {
    expect(getAverageRating(null)).toBe(0);
  });

  it('calculates average correctly', () => {
    expect(getAverageRating([5, 4, 3])).toBe('4.0');
    expect(getAverageRating([5, 5, 5])).toBe('5.0');
    expect(getAverageRating([1])).toBe('1.0');
  });
});

describe('canRegisterForViewing', () => {
  it('returns false when viewing is full', () => {
    const viewing = {
      date: '2099-12-31',
      time: '20:00',
      maxParticipants: 2,
      participants: [1, 2],
    };
    expect(canRegisterForViewing(viewing)).toBe(false);
  });

  it('returns false when less than 1 hour before viewing', () => {
    const now = new Date();
    const soon = new Date(now.getTime() + 30 * 60 * 1000); // 30 min from now
    const viewing = {
      date: soon.toISOString().split('T')[0],
      time: soon.toTimeString().slice(0, 5),
      maxParticipants: 50,
      participants: [],
    };
    expect(canRegisterForViewing(viewing)).toBe(false);
  });

  it('returns true when spots available and more than 1 hour before', () => {
    const viewing = {
      date: '2099-12-31',
      time: '20:00',
      maxParticipants: 50,
      participants: [1],
    };
    expect(canRegisterForViewing(viewing)).toBe(true);
  });
});
