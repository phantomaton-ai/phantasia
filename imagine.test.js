import { expect, stub } from 'lovecraft';
import util from './util.js'; // The object whose property we'll stub
import plugin from './plugin.js'; // The plugin function used in the config
import imagine from './imagine.js'; // The module under test

describe('Imagine Module', () => {
  let phantomatonStub;
  const testPrompt = 'a test prompt for imagine 🧪✨';
  const fakeResult = 'path/to/generated/image.png';

  beforeEach(() => {
    // Stub the 'phantomaton' property ON the imported 'util' object
    phantomatonStub = stub(util, 'phantomaton').resolves(fakeResult);
  });

  afterEach(() => {
    // Restore the original property on 'util'
    util.phantomaton.restore();
  });

  it('should call util.phantomaton with prompt and correct install config', async () => {
    await imagine(testPrompt);

    expect(phantomatonStub.calledOnce).to.be.true;
    const args = phantomatonStub.firstCall.args;
    expect(args[0]).to.equal(testPrompt);
    expect(args[1]).to.be.an('object');
    expect(args[1].install).to.be.an('array').with.lengthOf(3);
    expect(args[1].install).to.deep.include('phantomaton-imagination');
    expect(args[1].install).to.deep.include('phantomaton-stability');
    // Check that the result of calling plugin() is included
    expect(args[1].install[2]).to.deep.equal(plugin()); // Ensure plugin() result is passed
  });

  it('should return the result from util.phantomaton', async () => {
    const result = await imagine(testPrompt);
    expect(result).to.equal(fakeResult);
  });
});