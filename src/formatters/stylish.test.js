import { describe, it, expect } from 'vitest';
import stylish from './stylish.js';
import genDiff from '../gendiff.js';
import { resolvePath } from '../files.js';

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

  it('should keep indentation for nested structures', () => {
    const filepath1 = resolvePath('__fixtures__/nested/file1.json');
    const filepath2 = resolvePath('__fixtures__/nested/file2.json');

    const expected = `{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: null
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: 
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        deep: {
            id: {
                number: 45
            }
        }
        fee: 100500
    }
}`;

    expect(genDiff(filepath1, filepath2, 'stylish')).toEqual(expected);
  });
});
