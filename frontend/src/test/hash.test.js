import { describe, it, expect } from 'vitest';
import { sha256 } from '../utils/hash';

describe('sha256', () => {
  it('hashes "admin" correctly', async () => {
    const result = await sha256('admin');
    expect(result).toBe('8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918');
  });

  it('hashes "12345678" correctly', async () => {
    const result = await sha256('12345678');
    expect(result).toBe('ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f');
  });

  it('produces different hashes for different inputs', async () => {
    const hash1 = await sha256('hello');
    const hash2 = await sha256('world');
    expect(hash1).not.toBe(hash2);
  });

  it('produces consistent hashes for same input', async () => {
    const hash1 = await sha256('test');
    const hash2 = await sha256('test');
    expect(hash1).toBe(hash2);
  });

  it('returns a 64-character hex string', async () => {
    const result = await sha256('anything');
    expect(result).toHaveLength(64);
    expect(result).toMatch(/^[a-f0-9]+$/);
  });
});
