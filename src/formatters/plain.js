function isComplexValue(value) {
  return typeof value === 'object' && value !== null;
}

function formatValue(value) {
  if (isComplexValue(value)) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return String(value);
}

function plainFormat(diff, path = '') {
  const lines = [];

  for (const item of diff) {
    const currentPath = path ? `${path}.${item.key}` : item.key;

    if (item.status === 'added') {
      lines.push(`Property '${currentPath}' was added with value: ${formatValue(item.value)}`);
    } else if (item.status === 'removed') {
      lines.push(`Property '${currentPath}' was removed`);
    } else if (item.status === 'changed') {
      lines.push(`Property '${currentPath}' was updated. From ${formatValue(item.oldValue)} to ${formatValue(item.value)}`);
    } else if (item.status === 'nested') {
      lines.push(plainFormat(item.children, currentPath));
    }
  }

  return lines.join('\n');
}

export default function plain(diff) {
  return plainFormat(diff);
}
