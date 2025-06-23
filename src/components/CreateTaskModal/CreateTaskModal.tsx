import { useState } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useTaskLists } from '../../contexts/TaskListsContext';

interface CreateTaskModalProps {
  onClose: () => void;
  taskListId: string;
  taskListName: string;
}

export default function CreateTaskModal({ onClose, taskListId, taskListName }: CreateTaskModalProps) {
  const { theme } = useTheme();
  const { createTask } = useTaskLists();
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      createTask(taskListId, {
        title: formData.title.trim(),
        description: formData.description.trim()
      });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({ title: '', description: '' });
    onClose();
  };

  return (
    <div style={{ padding: '24px', minWidth: '450px' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ 
          margin: 0, 
          color: theme.text.primary,
          fontSize: '1.25rem',
          fontWeight: 600
        }}>
          Add Task to {taskListName}
        </h2>
        <button
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            color: theme.text.secondary,
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
          }}
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label 
            htmlFor="task-title"
            style={{ 
              display: 'block', 
              marginBottom: '8px',
              color: theme.text.primary,
              fontWeight: 500
            }}
          >
            Task Title *
          </label>
          <input
            id="task-title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter task title..."
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${theme.border.medium}`,
              borderRadius: '4px',
              backgroundColor: theme.background.primary,
              color: theme.text.primary,
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
            autoFocus
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label 
            htmlFor="task-description"
            style={{ 
              display: 'block', 
              marginBottom: '8px',
              color: theme.text.primary,
              fontWeight: 500
            }}
          >
            Description
          </label>
          <textarea
            id="task-description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter task description (optional)..."
            rows={3}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${theme.border.medium}`,
              borderRadius: '4px',
              backgroundColor: theme.background.primary,
              color: theme.text.primary,
              fontSize: '14px',
              boxSizing: 'border-box',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Footer */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          justifyContent: 'flex-end'
        }}>
          <button
            type="button"
            onClick={handleClose}
            style={{
              padding: '8px 16px',
              border: `1px solid ${theme.border.medium}`,
              borderRadius: '4px',
              backgroundColor: theme.background.secondary,
              color: theme.text.primary,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!formData.title.trim()}
            style={{
              padding: '8px 16px',
              border: `1px solid ${theme.interactive.primary}`,
              borderRadius: '4px',
              backgroundColor: theme.interactive.primary,
              color: '#ffffff',
              cursor: formData.title.trim() ? 'pointer' : 'not-allowed',
              opacity: formData.title.trim() ? 1 : 0.6,
              transition: 'all 0.2s ease',
            }}
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
}
