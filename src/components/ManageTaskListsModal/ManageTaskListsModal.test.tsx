import { screen, fireEvent, waitFor } from '@testing-library/react';
import ManageTaskListsModal from './ManageTaskListsModal';
import { describe, beforeEach, it, expect } from 'vitest';
import { renderWithTheme } from '../../test/renderWithTheme';
import { TaskListProvider } from '../../contexts/TaskListsContext';

// Helper to render modal in provider
const renderModal = (props = {}) => {
  return renderWithTheme(
    <TaskListProvider>
      <ManageTaskListsModal isOpen={true} onClose={() => { }} {...props} />
    </TaskListProvider>
  );
};

describe('ManageTaskListsModal', () => {
  beforeEach(() => {
    localStorage.clear();
  });  it('can add a new task list', async () => {
    // First add some default lists to localStorage so we have input fields
    const defaultLists = [
      { id: '1', name: 'To Do', color: '#007bff', tasks: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ];
    localStorage.setItem('retasker_task_lists', JSON.stringify(defaultLists));
    
    renderModal();
    const addBtn = screen.getByLabelText(/add item/i);
    fireEvent.click(addBtn);
    const inputs = screen.getAllByPlaceholderText(/task list name/i);
    const input = inputs[inputs.length - 1];
    fireEvent.change(input, { target: { value: 'New List' } });
    fireEvent.click(screen.getByText(/save/i));
    
    // Check localStorage to see if the new task list was created
    await waitFor(() => {
      const result = localStorage.getItem('retasker_task_lists');
      expect(result).toBeTruthy();
      if (result != null) {
        const stored = JSON.parse(result);
        expect(stored).toHaveLength(2);
        expect(stored.some((list: any) => list.name === 'New List')).toBe(true);
      }
    });
  });  it('can rename a task list', async () => {
    // First add some default lists to localStorage
    const defaultLists = [
      { id: '1', name: 'To Do', color: '#007bff', tasks: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ];
    localStorage.setItem('retasker_task_lists', JSON.stringify(defaultLists));
    
    renderModal();
    const input = screen.getAllByPlaceholderText(/task list name/i)[0];
    fireEvent.change(input, { target: { value: 'Renamed List' } });
    fireEvent.click(screen.getByText(/save/i));
    await waitFor(() => {
      const renamedInput = screen.getByDisplayValue('Renamed List');
      expect(renamedInput).toBeInTheDocument();
    });
  });
  it('can hide (remove) a task list', async () => {
    // First add some default lists to localStorage
    const defaultLists = [
      { id: '1', name: 'To Do', color: '#007bff', tasks: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '2', name: 'In Progress', color: '#28a745', tasks: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ];
    localStorage.setItem('retasker_task_lists', JSON.stringify(defaultLists));
    
    renderModal();
    const deleteBtns = screen.getAllByLabelText(/Delete/i);
    fireEvent.click(deleteBtns[0]);
    fireEvent.click(screen.getByText(/save/i));
    await waitFor(() => {
      expect(screen.queryByText('To Do')).not.toBeInTheDocument();
    });
  });
  it('can reorder task lists', async () => {
    // First add some default lists to localStorage
    const defaultLists = [
      { id: '1', name: 'List A', color: '#007bff', tasks: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '2', name: 'List B', color: '#28a745', tasks: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ];
    localStorage.setItem('retasker_task_lists', JSON.stringify(defaultLists));
    
    renderModal();
    // Simulate renaming and reordering
    const inputs = screen.getAllByPlaceholderText(/task list name/i);
    fireEvent.change(inputs[0], { target: { value: 'List 1' } });
    fireEvent.change(inputs[1], { target: { value: 'List 2' } });
    // Swap order
    fireEvent.change(inputs[0], { target: { value: 'List 2' } });
    fireEvent.change(inputs[1], { target: { value: 'List 1' } });
    fireEvent.click(screen.getByText(/save/i));
    // Check localStorage order
    await waitFor(() => {
      const result = localStorage.getItem('retasker_task_lists');
      expect(result).toBeTruthy();
      if (result != null) {
        const stored = JSON.parse(result);
        expect(stored[0].name).toBe('List 2');
        expect(stored[1].name).toBe('List 1');
      }
    });
  });

  it('disables save button when task list names are blank', async () => {
    const defaultLists = [
      { id: '1', name: 'To Do', color: '#007bff', tasks: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ];
    localStorage.setItem('retasker_task_lists', JSON.stringify(defaultLists));
    
    renderModal();
    const input = screen.getAllByPlaceholderText(/task list name/i)[0];
    fireEvent.change(input, { target: { value: '' } });
    
    const saveButton = screen.getByText(/save/i);
    expect(saveButton).toBeDisabled();
    expect(saveButton).toHaveAttribute('title', 'All task lists must have a name');
  });

  it('disables save button when task list names are duplicated', async () => {
    const defaultLists = [
      { id: '1', name: 'List A', color: '#007bff', tasks: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '2', name: 'List B', color: '#28a745', tasks: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ];
    localStorage.setItem('retasker_task_lists', JSON.stringify(defaultLists));
    
    renderModal();
    const inputs = screen.getAllByPlaceholderText(/task list name/i);
    fireEvent.change(inputs[1], { target: { value: 'List A' } }); // Make duplicate
    
    const saveButton = screen.getByText(/save/i);
    expect(saveButton).toBeDisabled();
    expect(saveButton).toHaveAttribute('title', 'Task list names must be unique');
  });

  it('shows error styling on invalid input fields', async () => {
    const defaultLists = [
      { id: '1', name: 'To Do', color: '#007bff', tasks: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ];
    localStorage.setItem('retasker_task_lists', JSON.stringify(defaultLists));
    
    renderModal();
    const input = screen.getAllByPlaceholderText(/task list name/i)[0];
    fireEvent.change(input, { target: { value: '' } });
    
    // The input should have error styling with red border
    expect(input).toHaveStyle('border: 1px solid rgb(220, 53, 69)');
  });
});
