import Modal from '../Modal';
import { useTheme } from '../../contexts/ThemeContext';
import { X } from 'lucide-react';
import './ManageTaskListsModal.css';
import '../Modal/ModalShared.css';
import { useTaskLists } from '../../contexts/TaskListsContext';
import { ListEdit } from '../ListEdit';
import { useEffect, useState } from 'react';
import { getRandomColor } from '../../utils/colorUtils';

interface ManageTaskListsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ManageTaskListsModal({ isOpen, onClose }: ManageTaskListsModalProps) {
  const { theme } = useTheme();
  const { taskLists, updateTaskList, createTaskList, reorderTaskLists, resetToDefaults } = useTaskLists();
  const [names, setNames] = useState<string[]>([]);
  // Only show non-hidden lists
  const visibleLists = taskLists.filter(l => !(l as any).hidden);

  useEffect(() => {
    if (isOpen) {
      setNames(visibleLists.map(l => l.name));
    }
  }, [isOpen, taskLists]);

  const handleSave = () => {
    // Hide lists that are not in the new names
    taskLists.forEach(list => {
      if (!names.includes(list.name) && !(list as any).hidden) {
        updateTaskList(list.id, { hidden: true } as any);
      }
    });
    // Unhide lists that are in the new names but currently hidden
    taskLists.forEach(list => {
      if (names.includes(list.name) && (list as any).hidden) {
        updateTaskList(list.id, { hidden: false } as any);
      }
    });
    
    // Add new lists for names not in any list
    names.forEach(name => {
      if (!taskLists.some(list => list.name === name)) {
        createTaskList({
          name,
          color: getRandomColor(),
          tasks: [],
        });
      }
    });

    reorderTaskLists(names);
    onClose();
  };

  const handleResetToDefaults = () => {
    resetToDefaults();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="manage-task-lists-modal">
        <div className="manage-task-lists-modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 className="manage-task-lists-modal-title" style={{ color: theme.text.primary, margin: 0 }}>
            Manage Task Lists
          </h2>
          <button
            className="modal-x-btn"
            onClick={onClose}
            style={{ color: theme.text.secondary }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <ListEdit
          values={names}
          onChange={setNames}
          placeholder="Task list name"
        />        <div className="manage-task-lists-modal-footer">
          <button 
            className="manage-task-lists-modal-reset-btn" 
            onClick={handleResetToDefaults}
          >
            Reset to Defaults
          </button>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="modal-footer-btn" 
              onClick={onClose} 
              style={{ color: theme.text.primary }}
            >
              Cancel
            </button>
            <button 
              className="manage-task-lists-modal-save-btn" 
              onClick={handleSave}
              style={{
                border: `1px solid ${theme.interactive.primary}`,
                backgroundColor: theme.interactive.primary,
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
