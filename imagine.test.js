import { expect, stub } from 'lovecraft';
import util from './util.js'; // Dependency to stub
import plugin from './plugin.js'; // Dependency
import imagine from './imagine.js'; // The module under test

describe('Imagine Module', () => {
  let phantomatonStub;
  const testPrompt = 'a test prompt 🧪';
  const fakeResult = 'path/to/generated/image.png';

  beforeEach(() => {
    // Stub the phantomaton function inside the util object
    phantomatonStub = stub(util, 'phantomaton').resolves(fakeResult);
  });

  afterEach(() => {
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
    expect(args[1].install[2]).to.deep.equal(plugin());
  });

  it('should return the result from util.phantomaton', async () => {
    const result = await imagine(testPrompt);
    expect(result).to.equal(fakeResult);
  });
});