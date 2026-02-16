import { describe, it, expect } from 'vitest';
import plain from './plain.js';

describe('plain formatter', () => {
  it('should format added property', () => {
    const diff = [{ key: 'follow', status: 'added', value: false }];
    const result = plain(diff);
    expect(result).toContain("Property 'follow' was added with value: false");
  });

  it('should format removed property', () => {
    const diff = [{ key: 'proxy', status: 'removed', value: '123.234.53.22' }];
    const result = plain(diff);
    expect(result).toContain("Property 'proxy' was removed");
  });

  it('should format changed property', () => {
    const diff = [{ key: 'timeout', status: 'changed', value: 20, oldValue: 50 }];
    const result = plain(diff);
    expect(result).toContain("Property 'timeout' was updated. From 50 to 20");
  });

  it('should show [complex value] for objects', () => {
    const diff = [{ key: 'setting5', status: 'added', value: { key5: 'value5' } }];
    const result = plain(diff);
    expect(result).toContain('[complex value]');
  });

  it('should show full path for nested properties', () => {
    const diff = [
      {
        key: 'common',
        status: 'nested',
        children: [
          { key: 'follow', status: 'added', value: false }
        ]
      }
    ];
    const result = plain(diff);
    expect(result).toContain("Property 'common.follow' was added with value: false");
  });

  it('should quote string values', () => {
    const diff = [{ key: 'host', status: 'added', value: 'hexlet.io' }];
    const result = plain(diff);
    expect(result).toContain("'hexlet.io'");
  });
});
