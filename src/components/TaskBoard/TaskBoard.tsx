import { 
  DndContext, 
  DragOverlay, 
  TouchSensor, 
  MouseSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import TaskColumn from '../TaskColumn';
import TaskDeleteConfirmationModal from '../TaskDeleteConfirmationModal';
import SaveTaskModal from '../SaveTaskModal';
import TaskCard from '../TaskCard';
import './TaskBoard.css';
import { useTheme } from '../../contexts/ThemeContext';
import { useTaskLists } from '../../contexts/TaskListsContext';
import { useDragDrop } from '../../contexts/DragDropContext';
import { Settings } from 'lucide-react';
import ManageTaskListsModal from '../ManageTaskListsModal';
import { useState, useMemo } from 'react';
import type { Task } from '../../models';

function TaskBoard(): React.ReactElement {
  const { theme } = useTheme();
  const { taskLists, deleteTask } = useTaskLists();
  const { 
    activeTask, 
    handleDragStart, 
    handleDragOver, 
    handleDragEnd, 
    handleDragCancel
  } = useDragDrop();

  // Configure sensors for mobile and desktop support
  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Require the mouse to move by 10 pixels before activating
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      // Press delay of 50ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 50,
        tolerance: 5,
      },
    })
  );
  
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

  // Edit task handlers
  const handleEditTask = (task: Task) => {
    // Find which list the task belongs to
    for (const taskList of taskLists) {
      if (taskList.tasks.some(t => t.id === task.id)) {
        setEditTask({
          isOpen: true,
          task,
          sourceListId: taskList.id,
        });
        break;
      }
    }
  };

  const handleEditTaskDelete = () => {
    if (editTask.task && editTask.sourceListId) {
      deleteTask(editTask.sourceListId, editTask.task.id);
    }
  };

  const handleEditTaskClose = () => {
    setEditTask({
      isOpen: false,
      task: null,
      sourceListId: '',
    });
  };

  // Memoize the task list name to prevent unnecessary re-renders
  const editTaskListName = useMemo(() => {
    return taskLists.find(list => list.id === editTask.sourceListId)?.name || '';
  }, [taskLists, editTask.sourceListId]);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <main className="task-board" role="main">
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
              onEditTask={handleEditTask}
            />
          ))}
        </div>

        <ManageTaskListsModal isOpen={isManageModalOpen} onClose={() => setManageModalOpen(false)} />
        
        {/* Edit Task Modal */}
        <SaveTaskModal
          key={editTask.task?.id || 'create'}
          isOpen={editTask.isOpen}
          onClose={handleEditTaskClose}
          taskListId={editTask.sourceListId}
          taskListName={editTaskListName}
          task={editTask.task}
          onDelete={handleEditTaskDelete}
        />
        
        {/* Task Delete Confirmation Modal */}
        <TaskDeleteConfirmationModal
          isOpen={deleteConfirmation.isOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          task={deleteConfirmation.task}
          taskListName={deleteConfirmation.taskListName}
        />
      </main>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask ? (
          <TaskCard task={activeTask} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default TaskBoard;
