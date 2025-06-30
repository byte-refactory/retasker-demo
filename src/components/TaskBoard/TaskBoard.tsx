import { 
  DndContext, 
  DragOverlay, 
  TouchSensor, 
  MouseSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import TaskColumn from '../TaskColumn';
import SaveTaskModal from '../SaveTaskModal';
import TaskCard from '../TaskCard';
import './TaskBoard.css';
import { useTheme } from '../../contexts/ThemeContext';
import { useTaskLists } from '../../contexts/TaskListsContext';
import { useDragDrop } from '../../contexts/DragDropContext';
import { Settings } from 'lucide-react';
import ManageTaskListsModal from '../ManageTaskListsModal';
import { useState } from 'react';
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

  // Configure sensors for mobile and desktop support - hooks must be at top level
  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });
  
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 50ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 50,
      tolerance: 5,
    },
  });
  
  const sensors = useSensors(mouseSensor, touchSensor);
  
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


  // Edit task handlers - without useCallback to prevent dependency issues
  const handleEditTask = (task: Task) => {
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
  };

  const handleEditTaskDelete = () => {
    if (editTask.task?.id && editTask.sourceListId) {
      deleteTask(editTask.sourceListId, editTask.task.id);
      // Close the modal after deletion
      setEditTask({
        isOpen: false,
        task: null,
        sourceListId: '',
      });
    }
  };

  const handleEditTaskClose = () => {
    setEditTask({
      isOpen: false,
      task: null,
      sourceListId: '',
    });
  };

  // Get the task list name directly without memoization to avoid dependency issues
  const editTaskListName = editTask.sourceListId 
    ? taskLists.find(list => list.id === editTask.sourceListId)?.name || ''
    : '';

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
          isOpen={editTask.isOpen}
          onClose={handleEditTaskClose}
          taskListId={editTask.sourceListId}
          taskListName={editTaskListName}
          task={editTask.task}
          onDelete={handleEditTaskDelete}
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
