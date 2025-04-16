import fs from 'fs'; // Needed for stubbing copyFileSync
import { expect, stub } from 'lovecraft';
import util from './util.js'; // For stubbing the underlying phantomaton call

// Note: cli.js is dynamically imported within tests AFTER mocks are set up

describe('Phantasia CLI', () => {
  let phantomatonStub; // Stub for util.phantomaton
  let copyStub;        // Stub for fs.copyFileSync
  let logStub;
  let exitStub;
  let argvBackup;
  let stdinBackup;

  const testPrompt = 'Input prompt for CLI test execution ⌨️';
  const testFilename = 'cli-target.png';
  const fakeImagineOutputPath = '/tmp/cli-imagine-output.png'; // Path returned by imagine via stub

  // Simple stdin mock
  const MockStdin = () => {
      let data = null; let readable = []; let end = [];
      return {
          isTTY: false,
          on: (evt, fn) => (evt === 'readable' ? readable : end).push(fn),
          read: () => { const chunk = data; data = null; return chunk; },
          _simulateInput: (input) => {
              data = input;
              setImmediate(() => { // Use setImmediate for async behavior
                  readable.forEach(fn => fn());
                  end.forEach(fn => fn());
              });
          },
          _reset: () => { data = null; readable = []; end = []; }
      };
  };

  beforeEach(() => {
    // Stub the dependencies that will be called when cli.js runs phantasia()
    phantomatonStub = stub(util, 'phantomaton').resolves(fakeImagineOutputPath);
    copyStub = stub(fs, 'copyFileSync');

    // Mock process and console
    logStub = stub(console, 'log');
    exitStub = stub(process, 'exit');
    argvBackup = process.argv;
    stdinBackup = process.stdin;
    process.argv = ['node', 'cli.js']; // Reset args
    const mockStdin = MockStdin();
    Object.defineProperty(process, 'stdin', { value: mockStdin, configurable: true });
    mockStdin._reset();
  });

  afterEach(async () => {
    // Restore all stubs and mocks
    phantomatonStub.restore();
    copyStub.restore();
    logStub.restore();
    exitStub.restore();
    process.argv = argvBackup;
    Object.defineProperty(process, 'stdin', { value: stdinBackup, configurable: true });

    // Attempt to clear module cache for cli.js using dynamic import workaround
    const cliPath = './cli.js';
    try {
        await import(`${cliPath}?t=${Date.now()}`);
    } catch (e) {
        // Ignore errors, cache busting is best-effort
    }
  });

  // Helper to dynamically import cli.js ensuring mocks are applied first
  const runCli = async () => {
      return await import(`./cli.js?t=${Date.now()}`);
  }

  it('should ultimately call phantomaton and copyFileSync', async () => {
    process.argv.push(testFilename);
    process.stdin._simulateInput(testPrompt);

    await runCli(); // Execute the CLI script
    await new Promise(resolve => setImmediate(resolve)); // Wait for async ops

    // Check that the underlying calls were made correctly
    expect(phantomatonStub.calledOnce).to.be.true;
    expect(phantomatonStub.firstCall.args[0]).to.equal(testPrompt);
    expect(copyStub.calledOnceWith(fakeImagineOutputPath, testFilename)).to.be.true;
    expect(exitStub.called).to.be.false; // Should not exit on success
  });

  it('should print usage and exit if filename argument is missing', async () => {
    await runCli();
    await new Promise(resolve => setImmediate(resolve));

    expect(phantomatonStub.called).to.be.false;
    expect(copyStub.called).to.be.false;
    expect(logStub.calledOnceWith('Usage: phantasia <filename>')).to.be.true;
    expect(exitStub.calledOnce).to.be.true;
  });

   it('should print usage and exit if filename argument is empty', async () => {
    process.argv.push(''); // Add empty filename argument
    await runCli();
    await new Promise(resolve => setImmediate(resolve));

    expect(phantomatonStub.called).to.be.false;
    expect(copyStub.called).to.be.false;
    expect(logStub.calledOnceWith('Usage: phantasia <filename>')).to.be.true;
    expect(exitStub.calledOnce).to.be.true;
  });
});