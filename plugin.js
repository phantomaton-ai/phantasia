import imagination from 'phantomaton-imagination';
import plugins from 'phantomaton-plugins';

export default plugins.create(({ configuration }) => [
  plugins.define(
    plugins.start
  ).with(
    imagination.adapter, plugins.input
  ).as(
    (adapter, input) => () => adapter.image(input(), configuration)
  )
]);
