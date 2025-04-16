import fs from 'fs';
import { expect, stub } from 'lovecraft';
import phantomaton from 'phantomaton'; // Need to stub the core call

// Import the function to test
import phantasia from '../phantasia.js';

describe('Phantasia Module', () => {
  let phantomatonStub;
  let copyFileSyncStub;
  const fakeImagePath = '/tmp/phantom-image.png';
  const testPrompt = 'A robot ghost writing code 👻🤖';

  beforeEach(() => {
    // Stub the core phantomaton function called by phantasia.js
    // IMPORTANT: We are stubbing the *default export* of the 'phantomaton' module
    phantomatonStub = stub(phantomaton, 'default').resolves(fakeImagePath);

    // Stub fs.copyFileSync
    copyFileSyncStub = stub(fs, 'copyFileSync');
  });

  afterEach(() => {
    phantomatonStub.restore();
    copyFileSyncStub.restore();
  });

  it('should call phantomaton core with correct prompt and plugins', async () => {
    await phantasia(testPrompt);

    expect(phantomatonStub.calledOnce).to.be.true;
    const args = phantomatonStub.firstCall.args;
    expect(args[0]).to.equal(testPrompt);
    expect(args[1]).to.be.an('object');
    expect(args[1].install).to.be.an('array').with.lengthOf(3);
    expect(args[1].install).to.deep.include('phantomaton-imagination');
    expect(args[1].install).to.deep.include('phantomaton-stability');
    // Check if the custom plugin function is present (though hard to inspect precisely)
    expect(args[1].install[2]).to.be.a('function');
  });

  it('should copy the file if options.output is provided and return the output path', async () => {
    const outputPath = 'output/here.png';
    const result = await phantasia(testPrompt, { output: outputPath });

    expect(copyFileSyncStub.calledOnceWith(fakeImagePath, outputPath)).to.be.true;
    expect(result).to.equal(outputPath);
  });

  it('should NOT copy the file if options.output is missing and return the original path', async () => {
    const result = await phantasia(testPrompt);

    expect(copyFileSyncStub.called).to.be.false;
    expect(result).to.equal(fakeImagePath);
  });

  it('should handle empty options object gracefully', async () => {
    const result = await phantasia(testPrompt, {});

    expect(copyFileSyncStub.called).to.be.false;
    expect(result).to.equal(fakeImagePath);
  });
});
