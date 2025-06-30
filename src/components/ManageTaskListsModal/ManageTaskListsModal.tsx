import Modal from '../Modal';
import { useTheme } from '../../contexts/ThemeContext';
import { X } from 'lucide-react';
import './ManageTaskListsModal.css';
import '../Modal/ModalShared.css';
import { useTaskLists } from '../../contexts/TaskListsContext';
import { ListEdit } from '../ListEdit';
import { useEffect, useState } from 'react';
import { getRandomColor } from '../../utils/colorUtils';
import type { ItemReference } from '../ListEdit/ListEditItem';
import type { TaskList } from '../../models/TaskList';

interface ManageTaskListsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ManageTaskListsModal({ isOpen, onClose }: ManageTaskListsModalProps) {
  const { theme } = useTheme();
  const { taskLists, updateTaskList, createTaskList, reorderTaskLists, resetToDefaults } = useTaskLists();
  const [taskListItems, setTaskListItems] = useState<ItemReference[]>([]);
  // Only show non-hidden lists
  const visibleLists = taskLists.filter(l => !(l as any).hidden);
  
  useEffect(() => {
    if (isOpen) {
      setTaskListItems(visibleLists.map(l => ({ id: l.id, name: l.name })));
    }
  }, [isOpen, taskLists]);

  // Validation logic
  const getValidationError = () => {
    const names = taskListItems.map(item => item.name.trim());
    
    // Check for blank names
    const hasBlankNames = names.some(name => name === '');
    if (hasBlankNames) {
      return 'All task lists must have a name';
    }
    
    // Check for duplicate names
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
    if (duplicates.length > 0) {
      return 'Task list names must be unique';
    }
    
    return null;
  };

  // Error checking function for individual items
  const getItemError = (item: ItemReference) => {
    const trimmedName = item.name.trim();
    
    // Check if name is blank
    if (trimmedName === '') {
      return true;
    }
    
    // Check if name is duplicate
    const names = taskListItems.map(listItem => listItem.name.trim());
    const isDuplicate = names.filter(name => name === trimmedName).length > 1;
    return isDuplicate;
  };

  const validationError = getValidationError();
  const canSave = validationError === null;

  const handleSave = async () => {
    // Check validation before proceeding
    if (!canSave) {
      return;
    }

    // First, collect all new lists that need to be created
    const newListsToCreate = taskListItems.filter(item => 
      !taskLists.some(list => list.id === item.id)
    );
    
    // Create new lists first
    const createdLists: TaskList[] = [];
    for (const item of newListsToCreate) {
      const newList = createTaskList({
        name: item.name,
        color: getRandomColor(),
        tasks: [],
      });
      createdLists.push(newList);
    }
    
    // Update existing task list names
    taskListItems.forEach(item => {
      const existingList = taskLists.find(list => list.id === item.id);
      if (existingList && existingList.name !== item.name) {
        updateTaskList(existingList.id, { ...existingList, name: item.name });
      }
    });
    
    // Hide lists that are not in the new items
    taskLists.forEach(list => {
      if (!taskListItems.some(item => item.id === list.id) && !(list as any).hidden) {
        updateTaskList(list.id, { hidden: true } as any);
      }
    });
    
    // Unhide lists that are in the new items but currently hidden
    taskLists.forEach(list => {
      if (taskListItems.some(item => item.id === list.id) && (list as any).hidden) {
        updateTaskList(list.id, { hidden: false } as any);
      }
    });

    // Wait a bit for state updates to settle, then do reordering
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        // Map old IDs to new IDs for created lists
        const orderedIds = taskListItems.map(item => {
          const existingList = taskLists.find(list => list.id === item.id);
          if (existingList) {
            return item.id; // Use existing ID
          }
          // For new lists, find the created list by name
          const createdList = createdLists.find(list => list.name === item.name);
          return createdList ? createdList.id : item.id;
        });
        
        reorderTaskLists(orderedIds);
      }, 100);
    }
    
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
          values={taskListItems}
          onChange={setTaskListItems}
          placeholder="Task list name"
          getItemError={getItemError}
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
              disabled={!canSave}
              title={validationError || 'Save changes'}
              style={{
                border: `1px solid ${canSave ? theme.interactive.primary : theme.border.medium}`,
                backgroundColor: canSave ? theme.interactive.primary : theme.background.secondary,
                color: canSave ? 'white' : theme.text.secondary,
                cursor: canSave ? 'pointer' : 'not-allowed',
                opacity: canSave ? 1 : 0.6,
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
