import { expect } from 'lovecraft';
import plugin from './plugin.js'; // The module under test

describe('Phantasia Plugin', () => {
  it('should export a function', () => {
    // plugins.create returns a function
    expect(plugin).to.be.a('function');
  });

  it('the exported function should return an object with an install array', () => {
    // Calling the function returned by plugins.create() yields the plugin definition
    const definition = plugin();
    expect(definition).to.be.an('object');
    expect(definition.install).to.be.an('array');
    // We could potentially inspect the contents further, but this confirms the basic structure
  });
});