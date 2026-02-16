import { union, sortBy } from 'lodash';
import resolveAndRead, { isJSON, isYAML } from './files';
import parsers from './parsers/index';
import formatters from './formatters/index';

function getFileType(filepath) {
  if (isYAML(filepath)) return 'yaml'
  if (isJSON(filepath)) return 'json'
  return undefined
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function buildDiff(obj1, obj2) {
  const keys = sortBy(union(Object.keys(obj1), Object.keys(obj2)));
  const result = [];

  for (const key of keys) {
    const val1 = obj1[key];
    const val2 = obj2[key];

    if (val1 === undefined && val2 !== undefined) {
      if (isObject(val2)) {
        result.push({ key, status: 'added', value: val2, children: buildDiff({}, val2) });
      } else {
        result.push({ key, status: 'added', value: val2 });
      }
    } else if (val1 !== undefined && val2 === undefined) {
      if (isObject(val1)) {
        result.push({ key, status: 'removed', value: val1, children: buildDiff(val1, {}) });
      } else {
        result.push({ key, status: 'removed', value: val1 });
      }
    } else if (isObject(val1) && isObject(val2)) {
      result.push({
        key,
        status: 'nested',
        children: buildDiff(val1, val2)
      });
    } else if (val1 !== val2) {
      result.push({ key, status: 'changed', value: val2, oldValue: val1 });
    } else {
      result.push({ key, status: 'unchanged', value: val1 });
    }
  }

  return result;
}

export default function genDiff(filepath1, filepath2, outFormat = 'stylish') {
  const [file1, file2] = [filepath1, filepath2].map(filepath => {
    const fileType = getFileType(filepath)
    if (fileType === undefined) {
      throw new Error(`unsupported file type: ${filepath}`)
    }
    return parsers[fileType](resolveAndRead(filepath))
  });
  const diff = buildDiff(file1, file2);
  const formatter = formatters[outFormat] || formatters.stylish;
  return formatter(diff);
}
