import fs from 'fs';
import { expect, stub } from 'lovecraft';

// Dynamically import imagine to allow stubbing its default export
const imagineModule = await import('./imagine.js');
const imagine = imagineModule.default;

// Dynamically import phantasia *after* setting up stubs if needed,
// but for stubbing its *dependency* (imagine), we import phantasia normally.
import phantasia from './phantasia.js'; // The module under test

describe('Phantasia Module', () => {
  let imagineStub;
  let copyStub;
  const fakePath = '/tmp/phantom-image.png';
  const testPrompt = 'A ghostly automaton optimizing workflows 👻⚙️';

  beforeEach(() => {
    // Stub the default export of the imagine module
    imagineStub = stub(imagineModule, 'default').resolves(fakePath);
    // Stub the fs function
    copyStub = stub(fs, 'copyFileSync');
  });

  afterEach(() => {
    // Restore stubs
    imagineStub.restore();
    copyStub.restore();
  });

  it('should call imagine with the prompt', async () => {
    await phantasia(testPrompt);
    expect(imagineStub.calledOnceWith(testPrompt)).to.be.true;
  });

  it('should copy the file if options.output is provided and return the output path', async () => {
    const output = 'output/generated_scene.png';
    const result = await phantasia(testPrompt, { output });

    expect(copyStub.calledOnceWith(fakePath, output)).to.be.true;
    expect(result).to.equal(output);
  });

  it('should NOT copy the file if options.output is missing and return the original path', async () => {
    const result = await phantasia(testPrompt);

    expect(copyStub.called).to.be.false;
    expect(result).to.equal(fakePath);
  });

  it('should handle empty options object gracefully', async () => {
    const result = await phantasia(testPrompt, {});

    expect(copyStub.called).to.be.false;
    expect(result).to.equal(fakePath);
  });
});