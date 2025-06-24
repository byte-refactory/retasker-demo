import { useState } from 'react';
import Modal from '../Modal';
import { useTheme } from '../../contexts/ThemeContext';

export interface TaskFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

export interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskFormData) => void;
}

export default function CreateTaskModal({
  isOpen,
  onClose,
  onSubmit
}: CreateTaskModalProps) {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onSubmit(formData);
      handleClose();
    }
  };
  const handleClose = () => {
    setFormData({ title: '', description: '', priority: 'medium' });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="medium"
    >
      <div style={{ padding: '24px', minWidth: '400px' }}>
        <h2 style={{ 
          margin: '0 0 20px 0', 
          color: theme.text.primary,
          fontSize: '1.25rem',
          fontWeight: 600
        }}>
          Create New Task
        </h2>
        
        <form id="create-task-form" onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label 
              htmlFor="task-title"
              style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontWeight: 500,
                color: theme.text.primary 
              }}
            >
              Title *
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

          <div style={{ marginBottom: '16px' }}>
            <label 
              htmlFor="task-description"
              style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontWeight: 500,
                color: theme.text.primary 
              }}
            >
              Description
            </label>
            <textarea
              id="task-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter task description..."
              rows={4}
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

          <div style={{ marginBottom: '24px' }}>
            <label 
              htmlFor="task-priority"
              style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontWeight: 500,
                color: theme.text.primary 
              }}
            >
              Priority
            </label>
            <select
              id="task-priority"
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as TaskFormData['priority'] }))}
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
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </form>

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
            form="create-task-form"
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
            Create Task
          </button>
        </div>
      </div>
    </Modal>
  );
}
