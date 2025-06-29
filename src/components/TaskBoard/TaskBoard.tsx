import { DndContext, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import TaskColumn from '../TaskColumn';
import TaskDeleteConfirmationModal from '../TaskDeleteConfirmationModal';
import TaskCard from '../TaskCard';
import TrashDropZone from '../TrashDropZone';
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
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [clonedTaskLists, setClonedTaskLists] = useState<typeof taskLists | null>(null);
  const [isTrashHovered, setIsTrashHovered] = useState(false);
  const [resetTrashHover, setResetTrashHover] = useState(false);
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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskId = active.id as string;
    
    // Clone the current state to allow restoration if drag is cancelled
    setClonedTaskLists(taskLists);
    
    // Find the active task
    for (const list of taskLists) {
      const task = list.tasks.find(t => t.id === taskId);
      if (task) {
        setActiveTask(task);
        break;
      }
    }
  };

  const findContainer = (taskId: string) => {
    for (const list of taskLists) {
      if (list.tasks.find(t => t.id === taskId)) {
        return list.id;
      }
    }
    return null;
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Find the active and over containers
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId) || overId; // overId might be a container itself
    
    if (!activeContainer || !overContainer) return;
    
    // If we're in the same container, let SortableContext handle it
    if (activeContainer === overContainer) return;
    
    // Move the task to the new container for preview
    const activeList = taskLists.find(list => list.id === activeContainer);
    const overList = taskLists.find(list => list.id === overContainer);
    
    if (!activeList || !overList) return;
    
    const activeTask = activeList.tasks.find(t => t.id === activeId);
    const overTaskIndex = overList.tasks.findIndex(t => t.id === overId);
    
    if (!activeTask) return;
    
    // Determine the insertion index
    let insertIndex = overList.tasks.length;
    if (overTaskIndex !== -1) {
      insertIndex = overTaskIndex;
    }
    
    moveTaskToPosition(activeContainer, overContainer, activeId, insertIndex);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveTask(null);
    setClonedTaskLists(null);
    
    // Reset trash hover state after any drag operation
    setResetTrashHover(true);
    setTimeout(() => setResetTrashHover(false), 10); // Reset the reset flag
    
    if (!over) {
      // If dropped outside, restore original state
      return;
    }

    const taskId = active.id as string;
    const overId = over.id as string;

    // Handle dropping on trash (fallback for direct drops)
    if (isTrashHovered) {
      // Find source list and task
      let sourceTask: Task | null = null;
      
      for (const list of taskLists) {
        const task = list.tasks.find(t => t.id === taskId);
        if (task) {
          sourceTask = task;
          break;
        }
      }

      if (sourceTask) {
        // Find the current container (since task may have moved during drag)
        const currentContainer = taskLists.find(list => 
          list.tasks.find(t => t.id === taskId)
        );
        
        if (currentContainer) {
          setDeleteConfirmation({
            isOpen: true,
            task: sourceTask,
            sourceListId: currentContainer.id,
            taskListName: currentContainer.name,
          });
        }
      }
      return;
    }

    // Handle within-column sorting that wasn't handled by onDragOver
    const activeContainer = findContainer(taskId);
    const overContainer = findContainer(overId) || overId;
    
    if (activeContainer && overContainer && activeContainer === overContainer) {
      // This is within-column sorting - handle it here
      const containerList = taskLists.find(list => list.id === activeContainer);
      if (containerList) {
        const activeIndex = containerList.tasks.findIndex(t => t.id === taskId);
        const overIndex = containerList.tasks.findIndex(t => t.id === overId);
        
        if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
          moveTaskToPosition(activeContainer, activeContainer, taskId, overIndex);
        }
      }
    }

    // For cross-container drops, the onDragOver handler has already moved the task
    // The position is now final
  };

  const handleDragCancel = () => {
    // Restore original state if drag was cancelled
    if (clonedTaskLists) {
      // Note: In a real app, you'd restore the state here
      // For this demo, we'll just clear the active task
    }
    setActiveTask(null);
    setClonedTaskLists(null);
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
    <DndContext
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
          onHoverChange={setIsTrashHovered}
          resetHover={resetTrashHover}
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
