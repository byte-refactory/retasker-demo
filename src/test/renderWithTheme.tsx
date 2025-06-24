import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '../contexts/ThemeContext';

export function renderWithTheme(ui: React.ReactNode, options?: Parameters<typeof render>[1]) {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options);
}
