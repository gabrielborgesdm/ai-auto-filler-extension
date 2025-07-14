### Project Overview

This is a Chrome browser extension designed to automatically fill web forms using AI. It leverages a local Ollama instance with a RAG (Retrieval-Augmented Generation) pipeline to provide contextually aware suggestions. The extension is built using React, Vite, and the `crxjs` plugin for a modern development experience.

### Tech Stack

- **Framework:** React 18+ with TypeScript
- **Bundler:** Vite
- **Chrome Extension Tooling:** `crxjs/vite-plugin`
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Package Manager:** npm

### Key Commands

- **Install Dependencies:** `npm install`
- **Run Development Server:** `npm run dev` (This will start the Vite server and enable HMR for the extension)
- **Build for Production:** `npm run build` (This will create a production-ready, unpacked extension in the `dist` directory)
- **Linting:** `npm run lint` (Please add a linting script to `package.json` if one doesn't exist)

### Coding Conventions

- **Components:** All React components should be functional components using hooks.
- **Typing:** Use TypeScript for all new code. Use strict types and avoid `any` where possible.
- **Styling:** Use Tailwind CSS utility classes directly in the JSX. Avoid writing separate CSS files unless absolutely necessary.
- **File Naming:** Use `PascalCase` for component files (e.g., `MyComponent.tsx`) and `camelCase` for non-component files (e.g., `apiClient.ts`).
- **Imports:** Use absolute imports relative to the `src` directory (e.g., `import MyComponent from '@/components/MyComponent'`).

### Architecture

- **`src/background.ts`:** The service worker for the extension. All communication with the Ollama backend and long-running tasks should be handled here.
- **`src/popup`:** Contains the UI for the extension's popup window, which opens when the user clicks the extension icon.
- **`src/components`:** Contains reusable React components.
  - `components/features`: Components specific to a feature (e.g., settings page, popup).
  - `components/shared`: Components that can be used across multiple features.
- **Content Scripts:** (To be created) These scripts will be injected into web pages to interact with forms and trigger the auto-filler.
- **Storage:** Use `chrome.storage.local` for persisting user settings and other extension data.
