import stylish from './stylish.js';
import plain from './plain.js';
import jsonFormatter from './json.js';

const formatters = {
  stylish,
  plain,
  json: jsonFormatter,
};

export default formatters;
