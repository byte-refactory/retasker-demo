import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import useModal from '../../hooks/useModal';
import Modal from '../Modal';

// Example modal content components
function TaskFormModal({ onClose }: { onClose: () => void }) {
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating task:', title);
    onClose();
  };

  return (
    <div style={{ padding: '24px', minWidth: '400px' }}>
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
          Create New Task
        </h2>
        <button
          onClick={onClose}
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

      {/* Content */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            color: theme.text.primary,
            fontWeight: 500
          }}>
            Task Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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

        {/* Footer */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          justifyContent: 'flex-end',
          marginTop: '24px'
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 16px',
              border: `1px solid ${theme.border.medium}`,
              borderRadius: '4px',
              backgroundColor: theme.background.secondary,
              color: theme.text.primary,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            style={{
              padding: '8px 16px',
              border: `1px solid ${theme.interactive.primary}`,
              borderRadius: '4px',
              backgroundColor: theme.interactive.primary,
              color: '#ffffff',
              cursor: title.trim() ? 'pointer' : 'not-allowed',
              opacity: title.trim() ? 1 : 0.6,
            }}
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
}

function ConfirmDeleteModal({ onClose, onConfirm }: { 
  onClose: () => void; 
  onConfirm: () => void; 
}) {
  const { theme } = useTheme();
  
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div style={{ padding: '24px', minWidth: '350px' }}>
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
          Delete Task
        </h2>
        <button
          onClick={onClose}
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

      {/* Content */}
      <p style={{ 
        margin: '0 0 24px 0', 
        color: theme.text.primary,
        lineHeight: 1.5
      }}>
        Are you sure you want to delete this task? This action cannot be undone.
      </p>

      {/* Footer */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        justifyContent: 'flex-end'
      }}>
        <button
          onClick={onClose}
          style={{
            padding: '8px 16px',
            border: `1px solid ${theme.border.medium}`,
            borderRadius: '4px',
            backgroundColor: theme.background.secondary,
            color: theme.text.primary,
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          style={{
            padding: '8px 16px',
            border: `1px solid ${theme.interactive.danger}`,
            borderRadius: '4px',
            backgroundColor: theme.interactive.danger,
            color: '#ffffff',
            cursor: 'pointer',
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function ModalExamples() {
  const { theme } = useTheme();
  const taskFormModal = useModal();
  const deleteModal = useModal();

  const handleDeleteConfirm = () => {
    console.log('Task deleted!');
  };

  const buttonStyle = {
    padding: '8px 16px',
    margin: '8px',
    border: `1px solid ${theme.interactive.primary}`,
    borderRadius: '4px',
    backgroundColor: theme.interactive.primary,
    color: '#ffffff',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: theme.text.primary, marginBottom: '20px' }}>
        Simple Modal Examples
      </h2>

      <div>
        <button onClick={taskFormModal.open} style={buttonStyle}>
          <Plus size={16} />
          Create Task
        </button>
        
        <button 
          onClick={deleteModal.open} 
          style={{
            ...buttonStyle,
            borderColor: theme.interactive.danger,
            backgroundColor: theme.interactive.danger,
          }}
        >
          Delete Task
        </button>
      </div>

      {/* Task Form Modal */}
      <Modal
        isOpen={taskFormModal.isOpen}
        onClose={taskFormModal.close}
        size="medium"
      >
        <TaskFormModal onClose={taskFormModal.close} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        size="small"
      >
        <ConfirmDeleteModal 
          onClose={deleteModal.close} 
          onConfirm={handleDeleteConfirm}
        />
      </Modal>
    </div>
  );
}
