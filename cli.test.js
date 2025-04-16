import { expect, stub } from 'lovecraft';
import phantasia from '../phantasia.js'; // Import the function called by cli.js

describe('Phantasia CLI', () => {
  let phantasiaStub;
  let consoleLogStub;
  let processExitStub;
  let originalArgv;
  let originalStdin;

  const testPrompt = 'Test prompt from stdin';
  const outputFilename = 'test-output.png';

  // Mock stdin setup
  const mockStdin = {
    isTTY: false,
    _data: null,
    _readableListeners: [],
    _endListeners: [],
    on: (event, listener) => {
      if (event === 'readable') mockStdin._readableListeners.push(listener);
      if (event === 'end') mockStdin._endListeners.push(listener);
    },
    read: () => {
      if (mockStdin._data === null) return null;
      const chunk = mockStdin._data;
      mockStdin._data = null; // Consume data
      return chunk;
    },
    // Helper to simulate data arrival and stream end
    _simulateInput: (input) => {
      mockStdin._data = input;
      // Use process.nextTick to allow event listeners to be attached
      // before firing the events in cli.js
      process.nextTick(() => {
        mockStdin._readableListeners.forEach(l => l());
        mockStdin._endListeners.forEach(l => l());
      });
    },
    _reset: () => {
        mockStdin._data = null;
        mockStdin._readableListeners = [];
        mockStdin._endListeners = [];
    }
  };


  beforeEach(() => {
    // Stub the core phantasia function
    phantasiaStub = stub(phantasia, 'default').resolves(outputFilename); // Stub default export

    // Stub console and process methods
    consoleLogStub = stub(console, 'log');
    processExitStub = stub(process, 'exit');

    // Store original process objects
    originalArgv = process.argv;
    originalStdin = process.stdin;

    // Mock process.argv and process.stdin
    process.argv = ['node', 'cli.js']; // Base args
    Object.defineProperty(process, 'stdin', { value: mockStdin, configurable: true });
    mockStdin._reset(); // Ensure mock stdin is clean
  });

  afterEach(async () => {
    // Restore all stubs
    phantasiaStub.restore();
    consoleLogStub.restore();
    processExitStub.restore();

    // Restore original process objects
    process.argv = originalArgv;
    Object.defineProperty(process, 'stdin', { value: originalStdin, configurable: true });

    // Need to remove the cli.js module from cache so it can be re-imported clean
    // This assumes an ESM environment where import() is dynamic or we manage cache
    // Adjust if using require cache mechanisms
    const cliPath = new URL('./cli.js', import.meta.url).pathname;
     if (global.import && global.import.meta && global.import.meta.resolve) {
        // This part is tricky and environment-dependent for ESM cache busting
        // For now, we'll rely on tests being run in separate processes or
        // accept that direct re-import might not re-run top-level code fully
        // without more advanced cache manipulation.
        // console.warn("ESM module cache invalidation not fully implemented in test harness");
     } else if (require.cache && require.resolve) {
         delete require.cache[require.resolve(cliPath)];
     }
  });

  it('should call phantasia with stdin prompt and output filename arg', async () => {
    process.argv.push(outputFilename); // Add filename argument
    mockStdin._simulateInput(testPrompt); // Simulate stdin data

    await import('../cli.js'); // Execute the CLI script

    // Allow async operations within cli.js (like stdin reading) to complete
    await new Promise(resolve => process.nextTick(resolve));
    await new Promise(resolve => process.nextTick(resolve)); // Maybe one more tick

    expect(phantasiaStub.calledOnce).to.be.true;
    expect(phantasiaStub.firstCall.args[0]).to.equal(testPrompt);
    expect(phantasiaStub.firstCall.args[1]).to.deep.equal({ output: outputFilename });
    expect(processExitStub.called).to.be.false; // Should not exit on success
  });

  it('should print usage and exit if filename argument is missing', async () => {
    // process.argv is already ['node', 'cli.js']

    await import('../cli.js'); // Execute the CLI script
    await new Promise(resolve => process.nextTick(resolve)); // Allow promises to settle

    expect(phantasiaStub.called).to.be.false;
    expect(consoleLogStub.calledOnceWith('Usage: phantasia <filename>')).to.be.true;
    expect(processExitStub.calledOnce).to.be.true;
  });

   it('should print usage and exit if filename argument is empty', async () => {
    process.argv.push(''); // Add empty filename argument

    await import('../cli.js'); // Execute the CLI script
    await new Promise(resolve => process.nextTick(resolve)); // Allow promises to settle

    expect(phantasiaStub.called).to.be.false;
    expect(consoleLogStub.calledOnceWith('Usage: phantasia <filename>')).to.be.true;
    expect(processExitStub.calledOnce).to.be.true;
  });

  // TODO: Add test for TTY input handling if possible/needed, might be complex
});