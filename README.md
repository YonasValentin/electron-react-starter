[![Buy Me a Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/YonasValentin)

# create-electron-app

Create modern Electron apps with an interactive CLI - just like Create React App, but for Electron! 🚀

## Quick Start

```bash
npx create-electron-app my-electron-app
cd my-electron-app
npm run dev
```

## Interactive Setup

The CLI will walk you through setting up your project with modern tooling:

```
✨ Welcome to create-electron-app!

? What is your project named? my-electron-app
? Would you like to use TypeScript? Yes
? Would you like to use Tailwind CSS? Yes  
? Would you like to use React Router? No
? Would you like to use ESLint? Yes
? Would you like to include Mac App Store configuration? Yes
? Would you like to include example components? Yes
? Which package manager would you like to use? npm

Creating my-electron-app...
✅ Created project structure
✅ Copied template files  
✅ Installed dependencies
✅ Initialized git repository

Success! Created my-electron-app at /path/to/my-electron-app
```

## Features

- **🚀 Modern Stack**: Electron + React + TypeScript
- **🎨 Styling**: Tailwind CSS support
- **📱 Routing**: React Router integration
- **📏 Code Quality**: ESLint configuration
- **🍎 Mac App Store**: Ready for distribution
- **⚡ Fast Setup**: Get started in seconds
- **🔧 Flexible**: Choose only what you need

## Options

- `--skip-install` - Skip installing dependencies
- `--skip-git` - Skip initializing git repository
- `--verbose` - Print additional logs
- `--template <name>` - Use a specific template

## Generated Project Structure

```
my-electron-app/
├── src/
│   ├── main/           # Electron main process
│   ├── renderer/       # React application
│   └── shared/         # Shared utilities
├── build/              # Build assets
├── package.json
├── tsconfig.json       # TypeScript config
├── tailwind.config.js  # Tailwind config
└── README.md
```

## Development Scripts

- `npm run dev` - Start development with hot reload
- `npm run build` - Build for production
- `npm start` - Start Electron app
- `npm run lint` - Lint and fix code
- `npm run reset` - Reset to clean project (removes examples)
- `npm run dist:mas` - Build for Mac App Store

## Requirements

- Node.js 16.0.0 or higher
- npm 7.0.0 or higher

## License

MIT

---

[![Buy Me a Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/YonasValentin)