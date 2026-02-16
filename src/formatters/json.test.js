import { describe, it, expect } from 'vitest';
import jsonFormatter from './json';

describe('json formatter', () => {
  it('should return valid JSON string', () => {
    const diff = [{ key: 'host', status: 'unchanged', value: 'hexlet.io' }];
    const result = jsonFormatter(diff);
    expect(() => JSON.parse(result)).not.toThrow();
  });

  it('should contain all diff data', () => {
    const diff = [{ key: 'host', status: 'unchanged', value: 'hexlet.io' }];
    const result = jsonFormatter(diff);
    const parsed = JSON.parse(result);
    expect(parsed[0].key).toBe('host');
    expect(parsed[0].status).toBe('unchanged');
    expect(parsed[0].value).toBe('hexlet.io');
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
    const result = jsonFormatter(diff);
    const parsed = JSON.parse(result);
    expect(parsed[0].status).toBe('nested');
    expect(parsed[0].children).toBeDefined();
  });

  it('should format with 2-space indentation', () => {
    const diff = [{ key: 'host', status: 'added', value: 'test' }];
    const result = jsonFormatter(diff);
    expect(result).toContain('  "key":');
  });
});
