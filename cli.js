#!/usr/bin/env node

import fs from 'fs';
import phantasia from './phantasia.js';

const filename = process.argv[2];

if (!filename || filename.length < 1) {
  console.log('Usage: phantasia <filename>');
  process.exit();
}

const input = await new Promise(resolve => {
  let data = '';

  if (process.stdin.isTTY) {
    process.stdin.on('data', (data) => {
      const line = data.toString().trim();
      if (line.endsWith('\\')) {
        data += line.slice(0, line.length - 1) + '\n';
      } else {
        resolve(data + line);
      }
    });
  } else {
    process.stdin.on('readable', () => {
      let chunk;
      while ((chunk = process.stdin.read()) !== null) {
        data += chunk;
      }
    });
    
    process.stdin.on('end', () => {
      resolve(data);
    });
  }  
});

const output = await phantasia(input);

fs.copyFileSync(output, filename);
