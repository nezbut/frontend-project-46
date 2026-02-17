import fs from 'fs'
import path from 'path'

export default function resolveAndRead(rawFilepath) {
  return readFile(resolvePath(rawFilepath))
}

export const isJSON = filepath => filepath.toLowerCase().endsWith('.json')
export const isYAML = filepath => filepath.toLowerCase().endsWith('.yaml') || filepath.toLowerCase().endsWith('.yml')

export function resolvePath(rawFilepath) {
  return path.resolve(process.cwd(), rawFilepath)
}

export function readFile(filepath) {
  return fs.readFileSync(filepath)
}
