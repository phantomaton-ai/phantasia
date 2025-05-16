import plugin from './plugin.js';
import util from './util.js';

export default (prompt, configuration = {}) => util.phantomaton(prompt, {
  install: [
    'phantomaton-imagination',
    'phantomaton-stability',
    plugin(configuration)
  ]
});
