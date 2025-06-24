import '@testing-library/jest-dom'

// Silence canvas.getContext errors in jsdom for tests
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: () => null,
});
