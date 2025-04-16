import { expect } from 'lovecraft';
import plugin from './plugin.js'; // The module under test

describe('Phantasia Plugin', () => {
  it('should export a function', () => {
    expect(plugin).to.be.a('function');
  });

  it('the exported function should return an object with an install array containing components', () => {
    const definition = plugin();
    expect(definition).to.be.an('object');
    expect(definition.install).to.be.an('array');
    expect(definition.install.length).to.be.greaterThan(0);
    expect(definition.install[0]).to.be.an('object');
  });
});