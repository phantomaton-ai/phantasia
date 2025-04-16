import phantomaton from 'phantomaton';

import imagination from 'phantomaton-imagination';
import plugins from 'phantomaton-plugins';

const plugin = plugins.create([
  plugins.define(
    plugins.start
  ).with(
    imagination.adapter,
    plugins.input
  ).as(
    (adapter, input) => () => adapter.imagine(input())
  )
]);

export default (prompt) => phantomaton(prompt, {
  install: [
    'phantomaton-imagination',
    'phantomaton-stability',
    plugin()
  ]
});
