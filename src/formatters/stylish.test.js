import { describe, it, expect } from 'vitest';
import stylish from './stylish.js';

describe('stylish formatter', () => {
  it('should format unchanged keys with space prefix', () => {
    const diff = [{ key: 'host', status: 'unchanged', value: 'hexlet.io' }];
    const result = stylish(diff);
    expect(result).toContain('  host: hexlet.io');
  });

  it('should format added keys with + prefix', () => {
    const diff = [{ key: 'verbose', status: 'added', value: true }];
    const result = stylish(diff);
    expect(result).toContain('+ verbose: true');
  });

  it('should format removed keys with - prefix', () => {
    const diff = [{ key: 'proxy', status: 'removed', value: '123.234.53.22' }];
    const result = stylish(diff);
    expect(result).toContain('- proxy: 123.234.53.22');
  });

  it('should format changed keys with both - and +', () => {
    const diff = [{ key: 'timeout', status: 'changed', value: 20, oldValue: 50 }];
    const result = stylish(diff);
    expect(result).toContain('- timeout: 50');
    expect(result).toContain('+ timeout: 20');
  });

  it('should handle nested structures', () => {
    const diff = [
      {
        key: 'common',
        status: 'nested',
        children: [
          { key: 'setting1', status: 'unchanged', value: 'Value 1' }
        ]
      }
    ];
    const result = stylish(diff);
    expect(result).toContain('common: {');
    expect(result).toContain('setting1: Value 1');
  });

  it('should wrap output in curly braces', () => {
    const diff = [{ key: 'host', status: 'unchanged', value: 'hexlet.io' }];
    const result = stylish(diff);
    expect(result.startsWith('{')).toBe(true);
    expect(result.endsWith('}')).toBe(true);
  });
});
