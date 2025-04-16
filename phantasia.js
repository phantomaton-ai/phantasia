import fs from 'fs';

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

const imagine = (prompt) => phantomaton(prompt, {
  install: [
    'phantomaton-imagination',
    'phantomaton-stability',
    plugin()
  ]
});

export default async (prompt, options = {}) => {
  const output = await imagine(prompt);
  if (options.output) {
    fs.copyFileSync(output, options.output);
    return options.output;
  }
  return output;
};
