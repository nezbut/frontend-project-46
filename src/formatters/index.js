import stylish from './stylish';
import plain from './plain';
import jsonFormatter from './json';

const formatters = {
  stylish,
  plain,
  json: jsonFormatter,
};

export default formatters;
