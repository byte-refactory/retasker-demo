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
import TaskCard from '../TaskCard';
import TrashDropZone from '../TrashDropZone';
import './TaskBoard.css';
import { useTheme } from '../../contexts/ThemeContext';
import { useTaskLists } from '../../contexts/TaskListsContext';
import { useDragDrop } from '../../contexts/DragDropContext';
import { Settings } from 'lucide-react';
import ManageTaskListsModal from '../ManageTaskListsModal';
import { useState, useEffect } from 'react';
import type { Task } from '../../models';

function TaskBoard(): React.ReactElement {
  const { theme } = useTheme();
  const { taskLists, deleteTask } = useTaskLists();
  const { 
    activeTask, 
    handleDragStart, 
    handleDragOver, 
    handleDragEnd, 
    handleDragCancel,
    onTaskDeletion 
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
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );
  
  const [isManageModalOpen, setManageModalOpen] = useState(false);
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

  // Subscribe to task deletion events from drag drop context
  useEffect(() => {
    const unsubscribe = onTaskDeletion((_taskId, task, sourceListId, taskListName) => {
      setDeleteConfirmation({
        isOpen: true,
        task,
        sourceListId,
        taskListName,
      });
    });
    
    return unsubscribe;
  }, [onTaskDeletion]);

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
            />
          ))}
        </div>

        {/* Trash Drop Zone - only visible when dragging */}
        <TrashDropZone 
          isVisible={!!activeTask} 
        />

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
