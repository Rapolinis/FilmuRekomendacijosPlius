import { describe, it, expect, beforeEach } from 'vitest';
import { loadFromStorage, saveToStorage, removeFromStorage } from '../utils/storage';

describe('storage utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and loads data correctly', () => {
    saveToStorage('test', { name: 'hello' });
    const result = loadFromStorage('test', null);
    expect(result).toEqual({ name: 'hello' });
  });

  it('returns fallback when key does not exist', () => {
    const result = loadFromStorage('nonexistent', 'default');
    expect(result).toBe('default');
  });

  it('removes data correctly', () => {
    saveToStorage('toRemove', 'value');
    removeFromStorage('toRemove');
    const result = loadFromStorage('toRemove', 'fallback');
    expect(result).toBe('fallback');
  });

  it('handles arrays', () => {
    saveToStorage('arr', [1, 2, 3]);
    expect(loadFromStorage('arr', [])).toEqual([1, 2, 3]);
  });

  it('handles nested objects', () => {
    const data = { users: [{ id: 1, name: 'test' }], count: 5 };
    saveToStorage('nested', data);
    expect(loadFromStorage('nested', null)).toEqual(data);
  });
});
