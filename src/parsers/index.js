import parseJSON from "./json";
import parseYAML from "./yaml";

const parsers = {
  yaml: parseYAML, yml: parseYAML,
  json: parseJSON,
};

export default parsers;
