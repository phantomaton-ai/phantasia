# Phantasia 👻🖼️

An AI-powered command-line interface for image generation using Phantomaton and Stability AI.

![A ghostly automaton generating an image](example.png)

## Installation 🚀

```bash
npm install -g phantasia
```

Requires Node.js and a configured Stability AI API key.

## Overview 🌟

Phantasia provides a simple command-line wrapper around the [Phantomaton](https://github.com/phantomaton-ai/phantomaton) framework, specifically utilizing the [phantomaton-imagination](https://github.com/phantomaton-ai/phantomaton-imagination) and [phantomaton-stability](https://github.com/phantomaton-ai/phantomaton-stability) plugins to generate images based on textual prompts. It reads a prompt from standard input and saves the resulting image to a specified file.

## Usage 🛠️

### Command-line Usage

Provide the desired output filename as a command-line argument and pipe the prompt text via standard input.

```bash
# Using echo
echo "A spooky jack-o-lantern sitting on a computer keyboard" | phantasia spooky_keyboard.png

# Using a file
phantasia my_masterpiece.png < my_prompt.txt
```

The CLI will output the path to the generated image upon success.

### Programmatic Usage

You can also use Phantasia as a module in your Node.js projects:

```javascript
import phantasia from 'phantasia';

async function generateImage(prompt, outputPath) {
  try {
    const resultPath = await phantasia(prompt, { output: outputPath });
    console.log(`Image generated and saved to: ${resultPath}`);
  } catch (error) {
    console.error('Image generation failed:', error);
  }
}

generateImage('Spectral automaton coding in a haunted library', 'haunted_coding.png');
```

### Options ⚙️

When running `phantasia` programmatically, the following options are available:

* `output`: Path to use for image file output.
* `width`: Width, in pixels.
* `height`: Height, in pixels.

## Configuration 🔧

Phantasia relies upon the standard [Phantomaton configuration](https://github.com/phantomaton-ai/phantomaton?tab=readme-ov-file#configuration-).

A [Stability AI API key](https://platform.stability.ai/account/keys) is **required** for image generation. Ensure your Phantomaton configuration includes the necessary settings for `phantomaton-stability`.

Example configuration (`~/.phantomaton/configuration.json` or `.phantomaton/configuration.json`):
```json
{
  "phantomaton-stability": {
    "apiKey": "YOUR_STABILITY_AI_API_KEY"
  }
}
```

Refer to the [phantomaton-stability](https://github.com/phantomaton-ai/phantomaton-stability) plugin documentation for more details on its configuration options.

## Features 💫

- 👻 Simple CLI for AI image generation.
- 🖼️ Uses Stability AI via Phantomaton plugins.
-  Pipes input/output for easy integration with other tools.
- 🤖 Leverages the extensible Phantomaton framework.

## Requirements 🛠️

- Node.js (Version specified in `package.json`)
- Stability AI API Key

## Contributing 🦄

Contributions are wickedly welcome! Please submit ideas, bug reports, and pull requests to our [GitHub repository](https://github.com/phantomaton-ai/phantasia).

## License 🔒

MIT License
