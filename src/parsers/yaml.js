import jsYaml from 'js-yaml'

export default function parseYAML(rawContent) {
  return jsYaml.load(rawContent)
}
