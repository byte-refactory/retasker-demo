# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

# Retasker Demo

A front-end-only React + TypeScript demo project built with Vite, designed to showcase modern React development practices without a backend.

## Purpose

To demonstrate frontend architecture, component design, and state management using:
- React with functional components
- TypeScript for type safety
- `useReducer` and `useEffect` for local state management
- `localStorage` for persistence (no server required)

## Key Features (Planned)

- Taskboard UI with columns (e.g. To Do, In Progress, Done)
- Task creation and movement between columns
- State stored in `localStorage` for demo-friendly persistence
- Clean, modular component structure
- Optional: filtering, drag-and-drop, and theming

## Tech Stack

- React 18
- TypeScript
- Vite
- CSS Modules or basic CSS (no framework)
- GitHub Pages deployment (planned)

## Status

Early scaffolding — currently setting up layout and task state logic.

## Using the Base Modal Component

The `Modal` component in `src/components/Modal/Modal.tsx` provides a flexible, accessible modal dialog for your app. Use it to create custom modals for forms, confirmations, settings, etc.

### Basic Usage

```tsx
import Modal from '../components/Modal';

<Modal isOpen={isOpen} onClose={handleClose}>
  <div>Your modal content here</div>
</Modal>
```

### Props
- `isOpen` (boolean): Whether the modal is visible.
- `onClose` (function): Called when the modal should close (e.g., overlay click, Escape key).
- `children` (ReactNode): Modal content.
- `size` (optional): `'small' | 'medium' | 'large' | 'fullscreen'` (default: `'medium'`).
- `closeOnEscape` (optional): Close on Escape key (default: `true`).
- `closeOnOverlayClick` (optional): Close on overlay click (default: `true`).
- `className` (optional): Extra CSS classes for the modal container.

### Example: Custom Modal
```tsx
<Modal isOpen={isOpen} onClose={onClose} size="large">
  <div style={{ padding: 24 }}>
    <h2>My Modal</h2>
    <p>Put any content here.</p>
    <button onClick={onClose}>Close</button>
  </div>
</Modal>
```

### Accessibility
- The modal traps focus and restores it on close.
- The overlay is keyboard and screen reader accessible.
- Use semantic HTML inside the modal for best results.

### Styling
- The modal uses theme colors automatically.
- You can add custom styles via the `className` prop or by styling your content.

---

