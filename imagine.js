import plugin from './plugin.js';
import util from './util.js';

export default (prompt) => util.phantomaton(prompt, {
  install: [
    'phantomaton-imagination',
    'phantomaton-stability',
    plugin()
  ]
});
