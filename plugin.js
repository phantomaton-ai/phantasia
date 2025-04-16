import imagination from 'phantomaton-imagination';
import plugins from 'phantomaton-plugins';

export default plugins.create([
  plugins.define(
    plugins.start
  ).with(
    imagination.adapter,
    plugins.input
  ).as(
    (adapter, input) => () => adapter.imagine(input())
  )
]);
