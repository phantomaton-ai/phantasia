import { expect, stub } from 'lovecraft';

// Dynamically import phantasia to allow stubbing its default export
const phantasiaModule = await import('./phantasia.js');

describe('Phantasia CLI', () => {
  let phantasiaStub;
  let logStub;
  let exitStub;
  let argvBackup;
  let stdinBackup;

  const testPrompt = 'Input prompt for CLI test ✨';
  const testFilename = 'cli-output.png';

  // Simple stdin mock
  const MockStdin = () => {
      let data = null;
      let readableListeners = [];
      let endListeners = [];
      return {
          isTTY: false,
          on: (event, listener) => (event === 'readable' ? readableListeners : endListeners).push(listener),
          read: () => { const chunk = data; data = null; return chunk; },
          _simulateInput: (input) => {
              data = input;
              // Use setImmediate or nextTick to ensure listeners are attached in cli.js
              setImmediate(() => {
                  readableListeners.forEach(fn => fn());
                  endListeners.forEach(fn => fn());
              });
          },
          _reset: () => { data = null; readableListeners = []; endListeners = []; }
      };
  };


  beforeEach(() => {
    // Stub the default export of the phantasia module
    phantasiaStub = stub(phantasiaModule, 'default').resolves(testFilename);
    logStub = stub(console, 'log');
    exitStub = stub(process, 'exit');

    // Backup and mock process properties
    argvBackup = process.argv;
    stdinBackup = process.stdin;
    process.argv = ['node', 'cli.js']; // Base args
    const mockStdin = MockStdin();
    Object.defineProperty(process, 'stdin', { value: mockStdin, configurable: true });
    mockStdin._reset(); // Ensure clean state
  });

  afterEach(() => {
    // Restore all stubs and process properties
    phantasiaStub.restore();
    logStub.restore();
    exitStub.restore();
    process.argv = argvBackup;
    Object.defineProperty(process, 'stdin', { value: stdinBackup, configurable: true });

    // Attempt to clear module cache for cli.js for re-import test runs
    // Note: Proper ESM cache busting is tricky and environment-dependent.
    const cliPath = new URL('./cli.js', import.meta.url).pathname;
     if (require.cache && require.resolve) {
         delete require.cache[require.resolve(cliPath)];
     }
  });

  it('should call phantasia with stdin prompt and output filename arg', async () => {
    process.argv.push(testFilename); // Add filename argument
    process.stdin._simulateInput(testPrompt); // Trigger stdin simulation

    // Dynamically import cli.js to execute it *after* mocks are set up
    await import('./cli.js');

    // Allow async operations (stdin reading, phantasia call) to complete
    await new Promise(resolve => setImmediate(resolve)); // Wait for next event loop cycle

    expect(phantasiaStub.calledOnce).to.be.true;
    expect(phantasiaStub.firstCall.args[0]).to.equal(testPrompt);
    expect(phantasiaStub.firstCall.args[1]).to.deep.equal({ output: testFilename });
    expect(exitStub.called).to.be.false; // Should not exit on success
  });

  it('should print usage and exit if filename argument is missing', async () => {
    // process.argv is already ['node', 'cli.js']
    await import('./cli.js');
    await new Promise(resolve => setImmediate(resolve));

    expect(phantasiaStub.called).to.be.false;
    expect(logStub.calledOnceWith('Usage: phantasia <filename>')).to.be.true;
    expect(exitStub.calledOnce).to.be.true;
  });

   it('should print usage and exit if filename argument is empty', async () => {
    process.argv.push(''); // Add empty filename argument
    await import('./cli.js');
    await new Promise(resolve => setImmediate(resolve));

    expect(phantasiaStub.called).to.be.false;
    expect(logStub.calledOnceWith('Usage: phantasia <filename>')).to.be.true;
    expect(exitStub.calledOnce).to.be.true;
  });
});