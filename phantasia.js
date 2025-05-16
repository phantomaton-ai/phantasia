import fs from 'fs';

import imagine from './imagine.js';

export default async (prompt, options = {}) => {
  const output = await imagine(prompt, options);
  if (options.output) {
    fs.copyFileSync(output, options.output);
    return options.output;
  }
  return output;
};
