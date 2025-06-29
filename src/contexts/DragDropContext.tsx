import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import type { Task } from '../models';
import { useTaskLists } from './TaskListsContext';

// Event subscription types
type TaskDeletionCallback = (taskId: string, task: Task, sourceListId: string, taskListName: string) => void;
type DragStartCallback = (task: Task) => void;
type DragEndCallback = () => void;

// DragDrop context type
interface DragDropContextType {
  // State
  isDragging: boolean;
  activeTask: Task | null;
  
  // Event handlers
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleDragCancel: () => void;
  
  // Event subscriptions
  onTaskDeletion: (callback: TaskDeletionCallback) => () => void;
  onDragStart: (callback: DragStartCallback) => () => void;
  onDragEnd: (callback: DragEndCallback) => () => void;
  
  // Trigger events
  triggerTaskDeletion: (taskId: string, task: Task, sourceListId: string, taskListName: string) => void;
}

// Create context
const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

// Provider props
interface DragDropProviderProps {
  children: ReactNode;
}

// DragDrop provider component
export function DragDropProvider({ children }: DragDropProviderProps) {
  const { taskLists, moveTaskToPosition } = useTaskLists();
  
  // State
  const [isDragging, setIsDragging] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [clonedTaskLists, setClonedTaskLists] = useState<typeof taskLists | null>(null);
  
  // Event subscribers
  const [taskDeletionCallbacks, setTaskDeletionCallbacks] = useState<TaskDeletionCallback[]>([]);
  const [dragStartCallbacks, setDragStartCallbacks] = useState<DragStartCallback[]>([]);
  const [dragEndCallbacks, setDragEndCallbacks] = useState<DragEndCallback[]>([]);

  // Helper function to find container
  const findContainer = useCallback((taskId: string) => {
    for (const list of taskLists) {
      if (list.tasks.find(t => t.id === taskId)) {
        return list.id;
      }
    }
    return null;
  }, [taskLists]);

  // Event subscription functions
  const onTaskDeletion = useCallback((callback: TaskDeletionCallback) => {
    setTaskDeletionCallbacks(prev => [...prev, callback]);
    
    // Return unsubscribe function
    return () => {
      setTaskDeletionCallbacks(prev => prev.filter(cb => cb !== callback));
    };
  }, []);

  const onDragStart = useCallback((callback: DragStartCallback) => {
    setDragStartCallbacks(prev => [...prev, callback]);
    
    return () => {
      setDragStartCallbacks(prev => prev.filter(cb => cb !== callback));
    };
  }, []);

  const onDragEnd = useCallback((callback: DragEndCallback) => {
    setDragEndCallbacks(prev => [...prev, callback]);
    
    return () => {
      setDragEndCallbacks(prev => prev.filter(cb => cb !== callback));
    };
  }, []);

  // Trigger event functions
  const triggerTaskDeletion = useCallback((taskId: string, task: Task, sourceListId: string, taskListName: string) => {
    taskDeletionCallbacks.forEach(callback => callback(taskId, task, sourceListId, taskListName));
  }, [taskDeletionCallbacks]);

  // Drag event handlers
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const taskId = active.id as string;
    
    setIsDragging(true);
    // Clone the current state to allow restoration if drag is cancelled
    setClonedTaskLists(taskLists);
    
    // Find the active task
    for (const list of taskLists) {
      const task = list.tasks.find(t => t.id === taskId);
      if (task) {
        setActiveTask(task);
        // Notify subscribers
        dragStartCallbacks.forEach(callback => callback(task));
        break;
      }
    }
  }, [taskLists, dragStartCallbacks]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
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
  }, [taskLists, findContainer, moveTaskToPosition]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    setIsDragging(false);
    setActiveTask(null);
    setClonedTaskLists(null);
    
    // Notify drag end subscribers
    dragEndCallbacks.forEach(callback => callback());
    
    if (!over) {
      // If dropped outside, restore original state
      return;
    }

    const taskId = active.id as string;
    const overId = over.id as string;

    // Handle dropping on trash
    if (overId === 'trash') {
      // Check if the trash element is actually being hovered
      const trashElement = document.getElementById('trash');
      const isTrashHovered = trashElement && trashElement.matches(':hover');
      
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
            // Trigger deletion event instead of handling it here
            triggerTaskDeletion(taskId, sourceTask, currentContainer.id, currentContainer.name);
          }
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
  }, [taskLists, findContainer, moveTaskToPosition, dragEndCallbacks, triggerTaskDeletion]);

  const handleDragCancel = useCallback(() => {
    // Restore original state if drag was cancelled
    if (clonedTaskLists) {
      // Note: In a real app, you'd restore the state here
      // For this demo, we'll just clear the active task
    }
    
    setIsDragging(false);
    setActiveTask(null);
    setClonedTaskLists(null);
    
    // Notify drag end subscribers
    dragEndCallbacks.forEach(callback => callback());
  }, [clonedTaskLists, dragEndCallbacks]);

  const contextValue: DragDropContextType = {
    // State
    isDragging,
    activeTask,
    
    // Event handlers
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
    
    // Event subscriptions
    onTaskDeletion,
    onDragStart,
    onDragEnd,
    
    // Trigger events
    triggerTaskDeletion,
  };

  return (
    <DragDropContext.Provider value={contextValue}>
      {children}
    </DragDropContext.Provider>
  );
}

// Custom hook to use drag drop
export function useDragDrop(): DragDropContextType {
  const context = useContext(DragDropContext);
  if (context === undefined) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
}
