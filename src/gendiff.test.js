import { describe, it, expect } from 'vitest';
import { buildDiff } from './gendiff';

describe('buildDiff', () => {
  it('should return unchanged keys with unchanged status', () => {
    const obj1 = { host: 'hexlet.io' };
    const obj2 = { host: 'hexlet.io' };
    const result = buildDiff(obj1, obj2);
    expect(result[0]).toEqual({ key: 'host', status: 'unchanged', value: 'hexlet.io' });
  });

  it('should return removed keys with removed status', () => {
    const obj1 = { proxy: '123.234.53.22' };
    const obj2 = {};
    const result = buildDiff(obj1, obj2);
    expect(result[0]).toEqual({ key: 'proxy', status: 'removed', value: '123.234.53.22' });
  });

  it('should return added keys with added status', () => {
    const obj1 = {};
    const obj2 = { verbose: true };
    const result = buildDiff(obj1, obj2);
    expect(result[0]).toEqual({ key: 'verbose', status: 'added', value: true });
  });

  it('should return changed keys with changed status', () => {
    const obj1 = { timeout: 50 };
    const obj2 = { timeout: 20 };
    const result = buildDiff(obj1, obj2);
    expect(result[0]).toEqual({ key: 'timeout', status: 'changed', value: 20, oldValue: 50 });
  });

  it('should sort keys alphabetically', () => {
    const obj1 = { z: 1, a: 2, m: 3 };
    const obj2 = {};
    const result = buildDiff(obj1, obj2);
    expect(result[0].key).toBe('a');
    expect(result[1].key).toBe('m');
    expect(result[2].key).toBe('z');
  });

  it('should handle nested objects with nested status', () => {
    const obj1 = { outer: { inner: 'value' } };
    const obj2 = { outer: { inner: 'value' } };
    const result = buildDiff(obj1, obj2);
    expect(result[0]).toHaveProperty('status', 'nested');
    expect(result[0]).toHaveProperty('children');
  });
});
