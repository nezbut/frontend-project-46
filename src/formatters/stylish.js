const INDENT_SIZE = 4
const SIGN_OFFSET = 2

function isComplexValue(value) {
  return typeof value === 'object' && value !== null
}

function getSignIndent(depth) {
  return ' '.repeat((depth - 1) * INDENT_SIZE + SIGN_OFFSET)
}

function getNestedIndent(depth) {
  return ' '.repeat(depth * INDENT_SIZE)
}

function getObjectClosingIndent(depth) {
  return ' '.repeat((depth - 1) * INDENT_SIZE)
}

function formatValue(value, depth) {
  if (value === null) {
    return 'null'
  }

  if (!isComplexValue(value)) {
    return String(value)
  }

  const entries = Object.entries(value).map(([key, itemValue]) => {
    return `${getNestedIndent(depth)}${key}: ${formatValue(itemValue, depth + 1)}`
  })

  return `{\n${entries.join('\n')}\n${getObjectClosingIndent(depth)}}`
}

function stylishFormat(diff, depth = 1) {
  const lines = diff.map(item => {
    if (item.status === 'nested' && item.children) {
      const indent = getNestedIndent(depth)
      const children = stylishFormat(item.children, depth + 1)
      return `${indent}${item.key}: {\n${children}\n${indent}}`
    }

    const baseIndent = getSignIndent(depth)

    if (item.status === 'added' && isComplexValue(item.value)) {
      const formatted = formatValue(item.value, depth + 1)
      return `${baseIndent}+ ${item.key}: ${formatted}`
    }

    if (item.status === 'removed' && isComplexValue(item.value)) {
      const formatted = formatValue(item.value, depth + 1)
      return `${baseIndent}- ${item.key}: ${formatted}`
    }

    if (item.status === 'changed') {
      const oldVal = formatValue(item.oldValue, depth + 1)
      const newVal = formatValue(item.value, depth + 1)
      return `${baseIndent}- ${item.key}: ${oldVal}\n${baseIndent}+ ${item.key}: ${newVal}`
    }

    const prefix = {
      added: '+ ',
      removed: '- ',
      changed: '- ',
      unchanged: '  ',
    }[item.status]

    const value = formatValue(item.value, depth + 1)
    return `${baseIndent}${prefix}${item.key}: ${value}`
  })

  return lines.join('\n')
}

export default function stylish(diff) {
  return `{\n${stylishFormat(diff)}\n}`
}
