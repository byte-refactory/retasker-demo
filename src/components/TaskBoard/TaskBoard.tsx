import { useState, useCallback, useMemo } from 'react';
import TaskColumn from '../TaskColumn';
import SaveTaskModal from '../SaveTaskModal';
import './TaskBoard.css';
import { useTheme } from '../../contexts/ThemeContext';
import { useTaskLists } from '../../contexts/TaskListsContext';
import { Settings } from 'lucide-react';
import ManageTaskListsModal from '../ManageTaskListsModal';
import type { Task } from '../../models';

function TaskBoard(): React.ReactElement {
  const { theme } = useTheme();
  const { taskLists, deleteTask } = useTaskLists();

  const [isManageModalOpen, setManageModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<{
    isOpen: boolean;
    task: Task | null;
    sourceListId: string;
  }>({
    isOpen: false,
    task: null,
    sourceListId: '',
  });

  // Memoize task lists to prevent unnecessary re-renders
  const visibleTaskLists = useMemo(() => 
    taskLists, 
    [taskLists]
  );

  // Memoize edit task handlers to prevent recreation on every render
  const handleEditTask = useCallback((task: Task) => {
    // Find which list the task belongs to
    const sourceList = taskLists.find(list => 
      list.tasks.some(t => t.id === task.id)
    );
    
    if (sourceList) {
      setEditTask({
        isOpen: true,
        task,
        sourceListId: sourceList.id,
      });
    }
  }, [taskLists]);

  const handleEditTaskDelete = useCallback(() => {
    if (editTask.task?.id && editTask.sourceListId) {
      deleteTask(editTask.sourceListId, editTask.task.id);
      // Close the modal after deletion
      setEditTask({
        isOpen: false,
        task: null,
        sourceListId: '',
      });
    }
  }, [editTask.task?.id, editTask.sourceListId, deleteTask]);

  const handleEditTaskClose = useCallback(() => {
    setEditTask({
      isOpen: false,
      task: null,
      sourceListId: '',
    });
  }, []);

  const handleManageModalClose = useCallback(() => {
    setManageModalOpen(false);
  }, []);

  const handleManageModalOpen = useCallback(() => {
    setManageModalOpen(true);
  }, []);

  // Memoize the task list name lookup
  const editTaskListName = useMemo(() => 
    editTask.sourceListId 
      ? taskLists.find(list => list.id === editTask.sourceListId)?.name || ''
      : '', 
    [editTask.sourceListId, taskLists]
  );

  return (
    <main className="task-board" role="main">
      <div className="board-title-row">
        <h2 className="board-title" style={{ color: theme.text.primary }}>Task Board</h2>
        <button
          className="board-config-btn"
          aria-label="Configure board"
          title="Configure board"
          style={{ color: theme.text.secondary, background: 'none', border: 'none', cursor: 'pointer', marginLeft: 8, padding: 4, borderRadius: 4 }}
          onClick={handleManageModalOpen}
        >
          <Settings size={22} />
        </button>
      </div>

      <div className="board-columns" role="group" aria-label="Task columns">
        {visibleTaskLists.map(taskList => (
          <TaskColumn 
            key={taskList.id} 
            taskList={taskList}
            onEditTask={handleEditTask}
          />
        ))}
      </div>

      <ManageTaskListsModal isOpen={isManageModalOpen} onClose={handleManageModalClose} />
      
      {/* Edit Task Modal */}
      <SaveTaskModal
        isOpen={editTask.isOpen}
        onClose={handleEditTaskClose}
        taskListId={editTask.sourceListId}
        taskListName={editTaskListName}
        task={editTask.task}
        onDelete={handleEditTaskDelete}
      />
    </main>
  );
}

export default TaskBoard;
