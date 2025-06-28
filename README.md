# Retasker Demo

A modern, clean task board application built with React, TypeScript, and Vite. This is a frontend-only demo that showcases modern React development practices with persistent local storage.

## Features

✅ **Task Management**
- Create tasks with title and description
- Organize tasks in customizable columns (To Do, In Progress, Done)
- Delete tasks with confirmation modal
- Edit task lists and columns

✅ **Modern UI/UX**
- Clean, responsive design with hover effects
- Dark/Light theme toggle
- Accessible components with ARIA labels
- Mobile-friendly responsive layout

✅ **Persistence**
- All data stored in localStorage
- No backend required - perfect for demos
- Data persists across browser sessions

✅ **Developer Experience**
- TypeScript for type safety
- Modern React with hooks and context
- Component-based architecture
- Hot module reloading with Vite

## Tech Stack

- **React 18** - Modern React with functional components and hooks
- **TypeScript** - Full type safety throughout the application
- **Vite** - Fast development server and build tool
- **CSS3** - Modern CSS with custom properties for theming
- **Lucide React** - Beautiful, consistent icons

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd retasker-demo
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Attribution/   # App attribution
│   ├── Modal/         # Base modal component
│   ├── TaskBoard/     # Main task board
│   ├── TaskCard/      # Individual task cards
│   ├── TaskColumn/    # Task list columns
│   ├── ThemeToggle/   # Dark/light theme toggle
│   └── ...
├── contexts/          # React context providers
│   ├── TaskListsContext.tsx  # Task data management
│   └── ThemeContext.tsx      # Theme state
├── hooks/             # Custom React hooks
├── models/            # TypeScript type definitions
├── pages/             # Page components
├── utils/             # Utility functions
└── test/              # Test files
```

## Component Architecture

### Modal System
The app includes a flexible, accessible modal system:

```tsx
import Modal from '../components/Modal';

<Modal isOpen={isOpen} onClose={handleClose} size="medium">
  <div>Your modal content here</div>
</Modal>
```

**Props:**
- `isOpen` (boolean): Whether the modal is visible
- `onClose` (function): Called when modal should close
- `children` (ReactNode): Modal content
- `size` (optional): `'small' | 'medium' | 'large' | 'fullscreen'`
- `closeOnEscape` (optional): Close on Escape key (default: true)
- `closeOnOverlayClick` (optional): Close on overlay click (default: true)

### Theme System
The app supports light and dark themes with a context-based system:

```tsx
import { useTheme } from '../contexts/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div style={{ backgroundColor: theme.background.primary }}>
      Content
    </div>
  );
}
```

### Task Management
Tasks are managed through a context provider with localStorage persistence:

```tsx
import { useTaskLists } from '../contexts/TaskListsContext';

function MyComponent() {
  const { taskLists, createTask, deleteTask, moveTask } = useTaskLists();
  // Use the task management functions
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Code Style

The project uses:
- ESLint for code linting
- TypeScript strict mode
- Consistent naming conventions
- Component-based architecture

## Accessibility

The application follows accessibility best practices:
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus management in modals
- High contrast theme support

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ support required
- Local storage support required

## License

This project is for demonstration purposes.

---

**Note:** This is a frontend-only demo application. All data is stored locally in the browser's localStorage and will persist across sessions but only on the same device/browser.

