function isComplexValue(value) {
  return typeof value === 'object' && value !== null;
}

function formatValue(value, depth = 0) {
  if (value === null) return 'null';
  if (isComplexValue(value)) {
    const indent = '    '.repeat(depth);
    const entries = Object.entries(value).map(([k, v]) => {
      return `${indent}    ${k}: ${formatValue(v, depth + 1)}`;
    });
    return `{\n${entries.join('\n')}\n${indent}}`;
  }
  return String(value);
}

function stylishFormat(diff, depth = 0) {
  const lines = diff.map((item) => {
    if (item.status === 'nested' && item.children) {
      const indent = ' '.repeat(depth * 4 + 2);
      const children = stylishFormat(item.children, depth + 1);
      return `${indent}${item.key}: {\n${children}\n${indent}}`;
    }

    const baseIndent = ' '.repeat(depth * 4);

    if (item.status === 'added' && isComplexValue(item.value)) {
      const formatted = formatValue(item.value, depth);
      return `${baseIndent}+ ${item.key}: ${formatted}`;
    }

    if (item.status === 'removed' && isComplexValue(item.value)) {
      const formatted = formatValue(item.value, depth);
      return `${baseIndent}- ${item.key}: ${formatted}`;
    }

    if (item.status === 'changed') {
      const oldVal = formatValue(item.oldValue, depth);
      const newVal = formatValue(item.value, depth);
      return `${baseIndent}- ${item.key}: ${oldVal}\n${baseIndent}+ ${item.key}: ${newVal}`;
    }

    const prefix = {
      added: '+ ',
      removed: '- ',
      changed: '- ',
      unchanged: '  ',
    }[item.status];

    const value = formatValue(item.value, depth);
    return `${baseIndent}${prefix}${item.key}: ${value}`;
  });

  return lines.join('\n');
}

export default function stylish(diff) {
  return '{\n' + stylishFormat(diff) + '\n}';
}
