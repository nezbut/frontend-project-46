import { describe, it, expect } from 'vitest';
import parseYAML from './yaml';

describe('parseYAML', () => {
  it('should parse YAML string to object', () => {
    const yaml = 'key: value\nnum: 42';
    const result = parseYAML(yaml);
    expect(result).toEqual({ key: 'value', num: 42 });
  });

  it('should handle nested YAML', () => {
    const yaml = 'outer:\n  inner: value';
    const result = parseYAML(yaml);
    expect(result).toEqual({ outer: { inner: 'value' } });
  });
});
