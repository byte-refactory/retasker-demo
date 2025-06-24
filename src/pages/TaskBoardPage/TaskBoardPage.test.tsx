import { afterEach, describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import TaskBoardPage from './TaskBoardPage';
import * as StorageUtils from '../../utils/storageService';
import { renderWithTheme } from '../../test/renderWithTheme';

// Mock StorageService for isolation
afterEach(() => {
  localStorage.clear();
});

describe('TaskBoardPage', () => {
  it('renders without crashing', () => {
    renderWithTheme(<TaskBoardPage />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('shows default lists if storage is empty', () => {
    renderWithTheme(<TaskBoardPage />);
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('shows lists from storage if present', () => {
    StorageUtils.StorageService.saveTaskLists([
      { id: '1', name: 'Custom List', color: '#123', tasks: [], createdAt: new Date(), updatedAt: new Date() }
    ]);
    renderWithTheme(<TaskBoardPage />);
    expect(screen.getByText('Custom List')).toBeInTheDocument();
  });
});
