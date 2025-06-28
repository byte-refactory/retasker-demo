import TaskColumn from '../TaskColumn';
import TrashDropZone from '../TrashDropZone';
import TaskDeleteConfirmationModal from '../TaskDeleteConfirmationModal';
import './TaskBoard.css';
import { useTheme } from '../../contexts/ThemeContext';
import { useTaskLists } from '../../contexts/TaskListsContext';
import { Settings } from 'lucide-react';
import ManageTaskListsModal from '../ManageTaskListsModal';
import { useState } from 'react';
import type { Task } from '../../models';

function TaskBoard(): React.ReactElement {
  const { theme } = useTheme();
  const { taskLists, moveTaskToPosition, deleteTask } = useTaskLists();
  const [isManageModalOpen, setManageModalOpen] = useState(false);
  const [dragState, setDragState] = useState<{ task: Task; sourceListId: string } | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    task: Task | null;
    sourceListId: string;
    taskListName: string;
  }>({
    isOpen: false,
    task: null,
    sourceListId: '',
    taskListName: '',
  });
  const handleTaskDragStart = (task: Task, sourceListId: string) => {
    setDragState({ task, sourceListId });
  };

  const handleTaskDragEnd = () => {
    setDragState(null);
  };  const handleTaskDrop = (task: Task, targetListId: string, insertionIndex?: number) => {
    if (!dragState) return;
    // Use the provided insertionIndex directly
    const index = typeof insertionIndex === 'number' ? insertionIndex : 0;
    moveTaskToPosition(dragState.sourceListId, targetListId, task.id, index);
    setDragState(null);
  };

  const handleTrashDrop = (task: Task) => {
    if (!dragState) return;
    
    const sourceList = taskLists.find(list => list.id === dragState.sourceListId);
    if (!sourceList) return;

    setDeleteConfirmation({
      isOpen: true,
      task: task,
      sourceListId: dragState.sourceListId,
      taskListName: sourceList.name,
    });
    
    // Hide the dragging task immediately
    setDragState(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmation.task && deleteConfirmation.sourceListId) {
      deleteTask(deleteConfirmation.sourceListId, deleteConfirmation.task.id);
    }
    setDeleteConfirmation({
      isOpen: false,
      task: null,
      sourceListId: '',
      taskListName: '',
    });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({
      isOpen: false,
      task: null,
      sourceListId: '',
      taskListName: '',
    });
  };
  return (
    <main className="task-board" role="main">
      {/* Trash Drop Zone - only visible during drag */}
      <TrashDropZone 
        isVisible={!!dragState} 
        onDrop={handleTrashDrop}
      />

      <div className="board-title-row">
        <h2 className="board-title" style={{ color: theme.text.primary }}>Task Board</h2>
        <button
          className="board-config-btn"
          aria-label="Configure board"
          title="Configure board"
          style={{ color: theme.text.secondary, background: 'none', border: 'none', cursor: 'pointer', marginLeft: 8, padding: 4, borderRadius: 4 }}
          onClick={() => setManageModalOpen(true)}
        >
          <Settings size={22} />
        </button>
      </div>

      <div className="board-columns" role="group" aria-label="Task columns">
        {taskLists.filter(t => !t.hidden).map(taskList => (
          <TaskColumn 
            key={taskList.id} 
            taskList={taskList}
            onTaskDragStart={handleTaskDragStart}
            onTaskDragEnd={handleTaskDragEnd}
            onTaskDrop={handleTaskDrop}
          />
        ))}
      </div>

      <ManageTaskListsModal isOpen={isManageModalOpen} onClose={() => setManageModalOpen(false)} />
      
      {/* Task Delete Confirmation Modal */}
      <TaskDeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        task={deleteConfirmation.task}
        taskListName={deleteConfirmation.taskListName}
      />
    </main>
  );
}

export default TaskBoard;
