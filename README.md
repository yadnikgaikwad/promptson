# Promptson

Convert natural language prompts into structured JSON formats for ChatGPT, Claude, and other AI models. Enhance your AI interactions with intelligent prompt formatting.

## Features
- **AI Prompt Generator**: Instantly generate tailored prompts for various categories (image, design, coding, copywriting).
- **JSON Prompt Formatter**: Convert natural language prompts into structured JSON for use with AI models.
- **Image Prompt Page**: Explore and save creative image prompts.
- **Saved Prompts**: View and manage your saved prompts.
- **Authentication**: Login and sign up functionality.
- **Responsive UI**: Modern, responsive design with a sidebar and top navbar.
- **Reusable UI Components**: Built with a modular component structure for easy extension.

## Tech Stack
- **Frontend**: [React](https://react.dev/) (JSX, hooks)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: CSS, [Tailwind CSS](https://tailwindcss.com/), custom themes
- **Routing**: [React Router](https://reactrouter.com/)
- **State Management**: React hooks
- **UI Components**: Custom and Radix UI components
- **Linting**: [ESLint](https://eslint.org/)
- **Package Manager**: [pnpm](https://pnpm.io/)

## Project Structure
```
Promptson/
  ├── public/           # Static assets (favicon, etc.)
  ├── src/
  │   ├── assets/       # Images and SVGs
  │   ├── components/   # React components (UI, features, layout)
  │   ├── hooks/        # Custom React hooks
  │   ├── lib/          # Utility and helper functions
  │   ├── App.jsx       # Main app entry
  │   └── App.css       # Global styles
  ├── package.json      # Project metadata and scripts
  ├── vite.config.js    # Vite configuration
  ├── eslint.config.js  # ESLint configuration
  └── ...
```

## Getting Started
### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (install with `npm install -g pnpm`)

### Installation
```bash
pnpm install
```

### Development
```bash
pnpm dev
```
Visit [http://localhost:5173](http://localhost:5173) to view the app.

### Linting
```bash
pnpm lint
```

### Building for Production
```bash
pnpm build
```

### Preview Production Build
```bash
pnpm preview
```

## Contributing
Contributions are welcome! Please open issues or pull requests for bug fixes, features, or improvements.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

![Alt](https://repobeats.axiom.co/api/embed/890a3b50a3c2718c4e28092cdeda2d2f2d6ded16.svg "Repobeats analytics image")

## License
[MIT](LICENSE) © 2025 Promptson 
