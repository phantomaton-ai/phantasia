import { expect } from 'lovecraft';
import plugin from './plugin.js'; // The module under test
import plugins from 'phantomaton-plugins'; // To check instance type perhaps?

describe('Phantasia Plugin', () => {
  it('should export a function created by plugins.create', () => {
    // Check if it's a function
    expect(plugin).to.be.a('function');
    // Optional: Check if the internal structure hints at plugins.create origin
    // This is fragile, but might be useful if structure is guaranteed
    // expect(plugin.toString()).to.include('plugins.define');
  });

  it('the exported function should return a plugin definition object', () => {
    // Calling the exported function should yield the actual plugin object
    const definition = plugin();
    expect(definition).to.be.an('object');
    expect(definition.install).to.be.an('array');
    expect(definition.install.length).to.be.greaterThan(0); // Should have at least one item
    // We could check the types/structure of items in definition.install if needed
    expect(definition.install[0]).to.be.an('object'); // Assuming components are objects
  });
});