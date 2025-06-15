# {{PROJECT_NAME}}

A modern Electron application built with React{{#if TYPESCRIPT}} and TypeScript{{/if}}.

## Features

- ⚡ **Electron** - Cross-platform desktop apps
- ⚛️ **React** - Modern UI framework
{{#if TYPESCRIPT}}- 🔷 **TypeScript** - Type-safe development{{/if}}
{{#if TAILWIND}}- 🎨 **Tailwind CSS** - Utility-first CSS framework{{/if}}
{{#if ROUTER}}- 🚦 **React Router** - Client-side routing{{/if}}
{{#if ESLINT}}- 📏 **ESLint** - Code linting and formatting{{/if}}
{{#if MAC_APP_STORE}}- 🍎 **Mac App Store** - Ready for distribution{{/if}}

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start Electron app
npm start
```

### Building

```bash
# Build for production
npm run build

# Package the app
npm run dist
```

### Reset Project

Remove example code and start with a clean slate:

```bash
# Reset to clean project
npm run reset
```

This will remove example components and give you a minimal setup to start building your app.

{{#if MAC_APP_STORE}}
### Mac App Store

```bash
# Build for Mac App Store
npm run dist:mas

# Build for Mac App Store (development)
npm run dist:mas-dev
```
{{/if}}

## Project Structure

```
{{PROJECT_NAME}}/
├── src/
│   ├── main/           # Electron main process
│   ├── renderer/       # React application
│   └── shared/         # Shared utilities
├── build/              # Build assets
└── dist/               # Distribution files
```

## License

MIT