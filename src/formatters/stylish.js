function isComplexValue(value) {
  return typeof value === 'object' && value !== null;
}

function formatValue(value, depth = 0) {
  if (value === null) return 'null';
  if (isComplexValue(value)) {
    const indent = '    '.repeat(depth);
    const innerIndent = '    '.repeat(depth + 1);
    const entries = Object.entries(value).map(([k, v]) => {
      return `${innerIndent}${k}: ${formatValue(v, depth + 1)}`;
    });
    return `{\n${entries.join('\n')}\n${indent}}`;
  }
  return String(value);
}

function stylishFormat(diff, depth = 0) {
  const currentIndent = '    '.repeat(depth);

  const getPrefix = (status) => ({
    added: '+ ',
    removed: '- ',
    changed: '- ',
    unchanged: '  '
  }[status]);

  const lines = diff.map((item) => {
    if (item.status === 'nested' && item.children) {
      const children = stylishFormat(item.children, depth + 1);
      return `${currentIndent}  ${item.key}: {\n${children}\n${currentIndent}  }`;
    }

    if (item.status === 'added' && isComplexValue(item.value)) {
      const formatted = formatValue(item.value, depth + 1);
      return `${currentIndent}+ ${item.key}: ${formatted}`;
    }

    if (item.status === 'removed' && isComplexValue(item.value)) {
      const formatted = formatValue(item.value, depth + 1);
      return `${currentIndent}- ${item.key}: ${formatted}`;
    }

    if (item.status === 'changed') {
      const oldVal = formatValue(item.oldValue, depth + 1);
      const newVal = formatValue(item.value, depth + 1);
      return `${currentIndent}- ${item.key}: ${oldVal}\n${currentIndent}+ ${item.key}: ${newVal}`;
    }

    const value = formatValue(item.value, depth + 1);

    const prefix = getPrefix(item.status);
    return `${currentIndent}${prefix}${item.key}: ${value}`;
  });

  return lines.join('\n');
}

export default function stylish(diff) {
  return '{\n' + stylishFormat(diff) + '\n}';
}
