import fs from 'fs';
import { expect, stub } from 'lovecraft';
import util from './util.js'; // For stubbing the underlying phantomaton call
import phantasia from './phantasia.js'; // The module under test

describe('Phantasia Module', () => {
  let phantomatonStub; // Stub for util.phantomaton
  let copyStub;
  const fakeImagineOutputPath = '/tmp/imagine-output.png'; // Path returned by the (stubbed) imagine call
  const testPrompt = 'A ghostly automaton writing passing tests 👻✅';

  beforeEach(() => {
    // When phantasia calls imagine, imagine calls util.phantomaton. Stub this.
    phantomatonStub = stub(util, 'phantomaton').resolves(fakeImagineOutputPath);
    // Stub the fs function used directly by phantasia
    copyStub = stub(fs, 'copyFileSync');
  });

  afterEach(() => {
    util.phantomaton.restore();
    copyStub.restore();
  });

  it('should ultimately call util.phantomaton via imagine', async () => {
    await phantasia(testPrompt);
    // Check that the underlying call happened (imagine was called and it called phantomaton)
    expect(phantomatonStub.calledOnce).to.be.true;
    // Check the prompt was passed down correctly
    expect(phantomatonStub.firstCall.args[0]).to.equal(testPrompt);
  });

  it('should copy the file if options.output is provided and return the output path', async () => {
    const outputPath = 'output/final_image.png';
    const result = await phantasia(testPrompt, { output: outputPath });

    // Ensure copy was called with the path returned by imagine (via the stub) and the target path
    expect(copyStub.calledOnceWith(fakeImagineOutputPath, outputPath)).to.be.true;
    // Ensure the final output path is returned
    expect(result).to.equal(outputPath);
  });

  it('should NOT copy the file if options.output is missing and return the original path from imagine', async () => {
    const result = await phantasia(testPrompt);

    expect(copyStub.called).to.be.false;
    // Ensure the path returned by imagine (via the stub) is returned
    expect(result).to.equal(fakeImagineOutputPath);
  });

  it('should handle empty options object gracefully', async () => {
    const result = await phantasia(testPrompt, {});

    expect(copyStub.called).to.be.false;
    expect(result).to.equal(fakeImagineOutputPath);
  });
});