import { describe, it, expect } from 'vitest';
import parseJSON from './json.js';

describe('parseJSON', () => {
  it('should parse JSON string to object', () => {
    const json = '{"key": "value", "num": 42}';
    const result = parseJSON(json);
    expect(result).toEqual({ key: 'value', num: 42 });
  });

  it('should throw on invalid JSON', () => {
    const json = '{invalid}';
    expect(() => parseJSON(json)).toThrow();
  });

  it('should handle nested objects', () => {
    const json = '{"outer": {"inner": "value"}}';
    const result = parseJSON(json);
    expect(result).toEqual({ outer: { inner: 'value' } });
  });
});
