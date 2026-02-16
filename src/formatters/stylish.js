function isComplexValue(value) {
  return typeof value === 'object' && value !== null;
}

function formatValue(value, depth = 0) {
  if (value === null) return 'null';
  if (isComplexValue(value)) {
    const indent = '    '.repeat(depth + 1);
    const closeIndent = '    '.repeat(depth);
    const entries = Object.entries(value).map(([k, v]) => {
      return `${indent}${k}: ${formatValue(v, depth + 1)}`;
    });
    return `{\n${entries.join('\n')}\n${closeIndent}}`;
  }
  return String(value);
}

function stylishFormat(diff, depth = 0) {
  const indentSize = 4;
  const baseIndent = ' '.repeat(depth * indentSize);

  const lines = diff.map((item) => {
    if (item.status === 'nested' && item.children) {
      const children = stylishFormat(item.children, depth + 1);
      return `${baseIndent}    ${item.key}: {\n${children}\n${baseIndent}    }`;
    }

    if (item.status === 'added' && isComplexValue(item.value)) {
      const formatted = formatValue(item.value, depth + 1);
      return `${baseIndent}+ ${item.key}: ${formatted}`;
    }

    if (item.status === 'removed' && isComplexValue(item.value)) {
      const formatted = formatValue(item.value, depth + 1);
      return `${baseIndent}- ${item.key}: ${formatted}`;
    }

    if (item.status === 'changed') {
      const oldVal = formatValue(item.oldValue, depth + 1);
      const newVal = formatValue(item.value, depth + 1);
      return `${baseIndent}- ${item.key}: ${oldVal}\n${baseIndent}+ ${item.key}: ${newVal}`;
    }

    const prefix = {
      added: '+ ',
      removed: '- ',
      changed: '- ',
      unchanged: '  ',
    }[item.status];

    const value = formatValue(item.value, depth + 1);
    return `${baseIndent}${prefix}${item.key}: ${value}`;
  });

  return lines.join('\n');
}

export default function stylish(diff) {
  return '{\n' + stylishFormat(diff) + '\n}';
}
