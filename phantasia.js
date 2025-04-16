import phantomaton from 'phantomaton';

import imagination from 'phantomaton-imagination';
import plugins from 'phantomaton-plugins';

const plugin = plugins.create([
  plugins.define(
    plugins.start
  ).with(
    plugins.input,
    imagination.adapter
  ).as(
    ([input, adapter]) => () => adapter.imagine(input)
  )
]);

export default (prompt) => phantomaton(prompt, {
  install: ['phantomaton-stability', plugin()]
});
