# AI AutoFiller

**AI-powered form autofill Chrome extension using Ollama and local language models.**
It reads the selected input and its parent element, then sends the serialized data to an LLM that predicts the most appropriate value — based on field structure and any user-defined context.

> *This is still a work in progress.*
> The basic functionality is working, and I’ll be improving it with upcoming commits.

---

### How it works now:

You can click on any input, and the extension will try to guess what should be filled in based on the HTML structure and the context you provide manually.

Right now, you can define dynamic fields directly in the extension — those act as your context for autofilling.

The plan is to later plug in a proper RAG setup, so it can pull real contextual data (like past form entries or user documents) to make smarter predictions.

---

### ✅ What it does so far:

* Lets you create dynamic context fields
* Allows input selection on any page
* Sends the selected input and its parent node to a local LLM via Ollama
* Predicts and autofills the value based on your context

---

### 🔜 What I’m planning to add:

* RAG search for better contextual answers
* Better UX (alerts, styling, visual feedback when listening for input)
* A shortcut key to trigger autofill
* Streaming input generation (token-by-token fill)

# Giving permission to ollama
It's necessary to allow the ollama server to accept requests from the extension.

```bash
sudo systemctl edit ollama.service

[Service]
Environment="OLLAMA_HOST=0.0.0.0"
Environment="OLLAMA_ORIGINS=*"

sudo service ollama restart
```

see https://objectgraph.com/blog/ollama-cors/


This template helps you quickly start developing Chrome extensions with React, TypeScript and Vite. It includes the CRXJS Vite plugin for seamless Chrome extension development.

## Features

- React with TypeScript
- TypeScript support
- Vite build tool
- CRXJS Vite plugin integration
- Chrome extension manifest configuration

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open Chrome and navigate to `chrome://extensions/`, enable "Developer mode", and load the unpacked extension from the `dist` directory.

4. Build for production:

```bash
npm run build
```

## Project Structure

- `src/popup/` - Extension popup UI
- `src/content/` - Content scripts
- `manifest.config.ts` - Chrome extension manifest configuration

## Documentation

- [React Documentation](https://reactjs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [CRXJS Documentation](https://crxjs.dev/vite-plugin)

## Chrome Extension Development Notes

- Use `manifest.config.ts` to configure your extension
- The CRXJS plugin automatically handles manifest generation
- Content scripts should be placed in `src/content/`
- Popup UI should be placed in `src/popup/`
