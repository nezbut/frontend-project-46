import { YAML } from "bun";

export default function parseYAML(rawContent) {
  return YAML.parse(rawContent);
}
