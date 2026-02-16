import parseJSON from "./json.js";
import parseYAML from "./yaml.js";

const parsers = {
  yaml: parseYAML, yml: parseYAML,
  json: parseJSON,
};

export default parsers;
