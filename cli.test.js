import { expect, stub } from 'lovecraft';
import phantasia from './phantasia.js'; // Dependency to stub

describe('Phantasia CLI', () => {
  let phantasiaStub;
  let logStub;
  let exitStub;
  let argv;
  let stdin;

  const prompt = 'Test prompt via stdin';
  const file = 'test-output.png';

  // Mock stdin setup - simplified
  const MockStdin = () => {
      let data = null;
      let readable = [];
      let end = [];
      return {
          isTTY: false,
          on: (evt, fn) => (evt === 'readable' ? readable : end).push(fn),
          read: () => { const chunk = data; data = null; return chunk; },
          _simulate: (input) => {
              data = input;
              process.nextTick(() => {
                  readable.forEach(fn => fn());
                  end.forEach(fn => fn());
              });
          },
          _reset: () => { data = null; readable = []; end = []; }
      };
  };


  beforeEach(() => {
    phantasiaStub = stub(phantasia, 'default').resolves(file);
    logStub = stub(console, 'log');
    exitStub = stub(process, 'exit');

    argv = process.argv; // Backup original
    stdin = process.stdin; // Backup original

    process.argv = ['node', 'cli.js']; // Reset args
    const mock = MockStdin();
    Object.defineProperty(process, 'stdin', { value: mock, configurable: true });
    mock._reset();
  });

  afterEach(async () => {
    phantasiaStub.restore();
    logStub.restore();
    exitStub.restore();

    process.argv = argv; // Restore original
    Object.defineProperty(process, 'stdin', { value: stdin, configurable: true }); // Restore original

    // Attempt to clear cache for re-importing cli.js
    const url = new URL('./cli.js', import.meta.url).pathname;
    if (require.cache && require.resolve) {
       delete require.cache[require.resolve(url)];
    }
    // Note: True ESM cache busting is complex and environment specific.
  });

  it('should call phantasia with stdin prompt and output filename arg', async () => {
    process.argv.push(file);
    process.stdin._simulate(prompt);

    await import('./cli.js'); // Execute script

    // Allow async operations within cli.js to settle
    await new Promise(resolve => process.nextTick(resolve));
    await new Promise(resolve => process.nextTick(resolve));

    expect(phantasiaStub.calledOnce).to.be.true;
    expect(phantasiaStub.firstCall.args[0]).to.equal(prompt);
    expect(phantasiaStub.firstCall.args[1]).to.deep.equal({ output: file });
    expect(exitStub.called).to.be.false;
  });

  it('should print usage and exit if filename argument is missing', async () => {
    await import('./cli.js');
    await new Promise(resolve => process.nextTick(resolve));

    expect(phantasiaStub.called).to.be.false;
    expect(logStub.calledOnceWith('Usage: phantasia <filename>')).to.be.true;
    expect(exitStub.calledOnce).to.be.true;
  });

   it('should print usage and exit if filename argument is empty', async () => {
    process.argv.push(''); // Add empty filename argument
    await import('./cli.js');
    await new Promise(resolve => process.nextTick(resolve));

    expect(phantasiaStub.called).to.be.false;
    expect(logStub.calledOnceWith('Usage: phantasia <filename>')).to.be.true;
    expect(exitStub.calledOnce).to.be.true;
  });
});