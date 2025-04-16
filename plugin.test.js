import { expect } from 'lovecraft';
import plugin from './plugin.js'; // The module under test

describe('Phantasia Plugin', () => {
  it('should export a function', () => {
    expect(plugin).to.be.a('function');
  });

  it('the exported function should return an object with an install array containing components', () => {
    // Calling the function returned by plugins.create() yields the plugin definition
    const definition = plugin();
    expect(definition).to.be.an('object');
    expect(definition.install).to.be.an('array');
    expect(definition.install.length).to.be.greaterThan(0);
    // Check the structure of the installed component (based on the source)
    expect(definition.install[0]).to.be.an('object');
    expect(definition.install[0]).to.have.property('start'); // From plugins.define(plugins.start)
    expect(definition.install[0]).to.have.property('with');
    expect(definition.install[0]).to.have.property('as');
  });
});